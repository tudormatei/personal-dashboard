import { useEffect, useState } from "react";
import { SubHeader } from "../../components/Typography/Headings";
import Loader from "../../components/Loader/Loader";
import Alert from "../../components/Alert/Alert";
import Card from "../../components/Card/Card";
import { FlexWrapper, DashboardGrid } from "../../components/Layout/Layout";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { colors, radii, spacing } from "../../constants/styling";
import { formatDateDayMonth, formatNumber } from "../../utils/utils";
import type { operations } from "../../types/api-routes";
import type { AlertData } from "../../types/types";
import Select from "../../components/Select/Select";

type SummaryData =
  operations["summary_api_bank_summary_get"]["responses"][200]["content"]["application/json"];

const Summary = () => {
  const [data, setData] = useState<SummaryData>(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertData | null>(null);
  const currency = "EUR";

  const [aggregateDays, setAggregateDays] = useState<string | null>(null);

  const fetchSummary = async (aggDays: string | null = null) => {
    setLoading(true);
    setAlert(null);

    try {
      const params = new URLSearchParams();
      if (aggDays !== null) {
        params.append("aggregate_days", aggDays);
      }

      const url = `/api/bank/summary?${params.toString()}`;
      const res = await fetch(url);
      const json = (await res.json()) as SummaryData;
      setData(json);
    } catch {
      setAlert({ text: "Failed to fetch summary", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary(aggregateDays);
  }, [aggregateDays]);

  return (
    <>
      {data?.summary && (
        <>
          <FlexWrapper>
            <SubHeader>Summary</SubHeader>
            <DashboardGrid>
              <Card
                title="Total In"
                value={`${formatNumber(data.summary.total_income)} ${currency}`}
              />
              <Card
                title="Total Out"
                value={`-${formatNumber(data.summary.total_spent)} ${currency}`}
              />
              <Card
                title="Net Savings"
                value={`${formatNumber(data.summary.net_savings)} ${currency}`}
              />
              <Card title="Currency" value={`${currency}`} />
            </DashboardGrid>
            <Select
              value={aggregateDays}
              onChange={setAggregateDays}
              options={[
                { label: "Default (Weekly)", value: null },
                { label: "Daily", value: "1" },
                { label: "Weekly", value: "7" },
                { label: "Monthly", value: "30" },
              ]}
            />
          </FlexWrapper>
        </>
      )}

      {loading && <Loader text="Loading summary..." />}
      {alert && <Alert {...alert} />}

      {data && (
        <>
          <FlexWrapper>
            <SubHeader>Cash Flow</SubHeader>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.chart_data}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={colors.charts.grid}
                />
                <XAxis
                  dataKey="date"
                  stroke={colors.charts.axis}
                  tickFormatter={(d) => formatDateDayMonth(d)}
                />
                <YAxis
                  stroke={colors.charts.axis}
                  label={{
                    value: "Value",
                    angle: -90,
                    position: "insideLeft",
                    fill: colors.charts.axis,
                    style: { fontSize: "0.8rem" },
                  }}
                  tickFormatter={(v) => formatNumber(v)}
                />
                <Tooltip
                  formatter={(value: number) => formatNumber(value)}
                  contentStyle={{
                    backgroundColor: colors.charts.tooltipBg,
                    border: `1px solid ${colors.charts.tooltipBg}`,
                    borderRadius: radii.md,
                    padding: spacing.sm,
                    color: colors.charts.tooltipText,
                  }}
                />
                <Legend />
                <Bar
                  dataKey="inflow"
                  fill={colors.charts.profit}
                  name="Inflow"
                  stackId="flow"
                />
                <Bar
                  dataKey="outflow"
                  fill={colors.charts.loss}
                  name="Outflow"
                  stackId="flow"
                />
                <Line
                  type="monotone"
                  dataKey="unified_balance"
                  stroke={colors.charts.primary}
                  strokeWidth={2}
                  dot={false}
                  name="Total Value"
                />
              </BarChart>
            </ResponsiveContainer>
          </FlexWrapper>
        </>
      )}
    </>
  );
};

export default Summary;
