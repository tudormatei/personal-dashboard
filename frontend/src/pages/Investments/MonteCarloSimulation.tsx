import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import Loader from "../../components/Loader/Loader";
import Alert from "../../components/Alert/Alert";
import Card from "../../components/Card/Card";
import { colors, radii, spacing, typography } from "../../constants/styling";
import { formatDateReadable, formatNumber } from "../../utils/utils";
import { Field, FormContainer } from "./Investments.styled";
import Label from "../../components/Label/Label";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import type { components, operations } from "../../types/api-routes";
import type { AlertData } from "../../types/types";
import { DashboardGrid, FlexWrapper } from "../../components/Layout/Layout";
import { SubHeader } from "../../components/Typography/Headings";

type MonteCarloResponse =
  operations["get_monte_carlo_simulation_result_api_investments_monte_carlo_simulations__job_id__get"]["responses"][200]["content"]["application/json"];

type MonteCarloResult = components["schemas"]["MonteCarloResult"];

type TWRPoint = components["schemas"]["TimeWeightedReturnItem"];

type MonteCarloSimulationProps = {
  startValue: number;
  twrSeries: TWRPoint[];
  currency: string;
};

const MonteCarloSimulation = ({
  startValue,
  twrSeries,
  currency,
}: MonteCarloSimulationProps) => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertData | null>(null);

  const [data, setData] = useState<MonteCarloResult | null>(null);

  const [params, setParams] = useState({
    monthlyDeposit: 200,
    monthlyWithdrawal: 0,
    daysAhead: 100,
    sims: 5000,
    targetValue: null as number | null,
  });

  const handleChange = (field: string, value: number | null) => {
    setParams((prev) => ({ ...prev, [field]: value }));
  };

  const startSimulation = async () => {
    setLoading(true);
    setAlert(null);
    setData(null);

    try {
      const res = await fetch("/api/investments/monte-carlo-simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start_value: startValue,
          twr_series: twrSeries,
          monthly_deposit: params.monthlyDeposit,
          monthly_withdrawal: params.monthlyWithdrawal,
          days_ahead: params.daysAhead,
          sims: params.sims,
          target_value: params.targetValue,
        }),
      });

      const job = (await res.json()) as MonteCarloResponse;

      const poll = async () => {
        const r = await fetch(
          `/api/investments/monte-carlo-simulations/${job.job_id}`
        );
        const response = (await r.json()) as MonteCarloResponse;
        if (response.status === "finished" && response.result) {
          setData(response.result);
          setLoading(false);
        } else {
          setTimeout(poll, 1000);
        }
      };
      poll();
    } catch {
      setAlert({ text: "Something went wrong", type: "error" });
      setLoading(false);
    }
  };

  return (
    <>
      <SubHeader>Monte Carlo Simulation</SubHeader>

      <FormContainer>
        <Field>
          <Label>{`Monthly Deposit ${currency}`}</Label>
          <Input
            value={params.monthlyDeposit}
            onChange={(e) =>
              handleChange("monthlyDeposit", Number(e.target.value))
            }
          />
        </Field>
        <Field>
          <Label>{`Monthly Withdrawal ${currency}`}</Label>
          <Input
            value={params.monthlyWithdrawal}
            onChange={(e) =>
              handleChange("monthlyWithdrawal", Number(e.target.value))
            }
          />
        </Field>
        <Field>
          <Label>Days Ahead</Label>
          <Input
            value={params.daysAhead}
            onChange={(e) => handleChange("daysAhead", Number(e.target.value))}
          />
        </Field>
        <Field>
          <Label>Simulations</Label>
          <Input
            value={params.sims}
            onChange={(e) => handleChange("sims", Number(e.target.value))}
          />
        </Field>
        <Field>
          <Label>Target Value (optional)</Label>
          <Input
            value={params.targetValue ?? ""}
            onChange={(e) =>
              handleChange("targetValue", Number(e.target.value))
            }
          />
        </Field>
        <Field>
          <Button onClick={startSimulation} disabled={loading}>
            {loading ? "Running..." : "Start Simulation"}
          </Button>
        </Field>
      </FormContainer>

      {data?.portfolioProjection && (
        <DashboardGrid>
          <Card
            title="Baseline Start Value"
            value={`${formatNumber(startValue)} ${currency}`}
          />
          <Card
            title="Baseline End Value"
            value={`${formatNumber(
              data?.portfolioProjection.at(-1)?.baseline
            )} ${currency}`}
          />
          <Card
            title="Median End Value"
            value={`${formatNumber(
              data?.portfolioProjection.at(-1)?.p50
            )} ${currency}`}
          />
          {data?.goalAchievement && (
            <Card
              title={`Probability of reaching target`}
              value={`${data.goalAchievement.successProbability}%`}
            />
          )}
        </DashboardGrid>
      )}

      {loading && <Loader text="Simulating future portfolio..." />}
      {alert && <Alert {...alert} />}

      {data?.portfolioProjection && (
        <FlexWrapper>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data.portfolioProjection}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={colors.charts.grid}
              />
              <XAxis
                stroke={colors.charts.axis}
                dataKey="date"
                tickFormatter={(date) =>
                  `${date.slice(4, 6)}/${date.slice(6, 8)}`
                }
              />
              <YAxis
                domain={["auto", "auto"]}
                stroke={colors.charts.axis}
                label={{
                  value: "Value ($)",
                  angle: -90,
                  position: "insideLeft",
                  offset: 0,
                  fill: colors.charts.axis,
                  style: { fontSize: "0.8rem" },
                }}
                tickFormatter={(value) => `${formatNumber(value)}`}
              />
              <Tooltip
                formatter={(value: number) => `$${formatNumber(value)}`}
                contentStyle={{
                  backgroundColor: colors.charts.tooltipBg,
                  border: `1px solid ${colors.charts.tooltipBg}`,
                  borderRadius: radii.md,
                  padding: spacing.sm,
                  color: colors.charts.tooltipText,
                }}
                labelFormatter={(label) => `Date: ${formatDateReadable(label)}`}
              />
              <Legend
                wrapperStyle={{
                  color: colors.textPrimary,
                  marginTop: spacing.sm,
                }}
                iconType="circle"
              />
              <Line
                type="monotone"
                dataKey="p5"
                stroke={colors.charts.p5}
                dot={false}
                name="5th percentile"
              />
              <Line
                type="monotone"
                dataKey="p25"
                stroke={colors.charts.p25}
                dot={false}
                name="25th percentile"
              />
              <Line
                type="monotone"
                dataKey="p50"
                stroke={colors.charts.p50}
                dot={false}
                name="Median"
              />
              <Line
                type="monotone"
                dataKey="p75"
                stroke={colors.charts.p75}
                dot={false}
                name="75th percentile"
              />
              <Line
                type="monotone"
                dataKey="p95"
                stroke={colors.charts.p95}
                dot={false}
                name="95th percentile"
              />
              <Line
                type="monotone"
                dataKey="baseline"
                stroke={colors.charts.baseline}
                dot={false}
                name="Baseline"
              />
              {params.targetValue && (
                <ReferenceLine
                  y={params.targetValue}
                  label={{
                    value: "Goal",
                    style: {
                      color: colors.textPrimary,
                      fontWeight: typography.fontWeight.bold,
                      fontSize: typography.fontSize.lg,
                    },
                  }}
                  stroke={colors.charts.profit}
                  strokeDasharray="3 3"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </FlexWrapper>
      )}
    </>
  );
};

export default MonteCarloSimulation;
