import { useState, type JSX } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Card from "../../components/Card/Card";
import FilterBar from "../../components/FilterBar/FilterBar";
import { colors, radii, spacing } from "../../constants/styling";
import Loader from "../../components/Loader/Loader";
import Alert from "../../components/Alert/Alert";
import { formatDate } from "../../utils/utils";
import type { operations } from "../../types/api-routes";
import type { AlertData } from "../../types/types";
import { H2 } from "../../components/Typography/Headings";
import { DashboardGrid, FlexWrapper } from "../../components/Layout/Layout";
import ProgressBar from "../../components/ProgressBar/ProgressBar";

type WeightResponse =
  operations["weight_history_api_health_weight_get"]["responses"][200]["content"]["application/json"];

type MaintenanceEstimate =
  operations["maintenance_calories_api_health_maintenance_get"]["responses"][200]["content"]["application/json"];

const Weight = (): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertData | null>(null);

  const [weightData, setWeightData] = useState<WeightResponse>(null);
  const [maintenanceData, setMaintenanceData] =
    useState<MaintenanceEstimate>(null);

  const fetchWeight = async (startDate: string, endDate: string) => {
    setLoading(true);
    setAlert(null);
    setWeightData(null);
    setMaintenanceData(null);

    try {
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      });
      const weightResponse = await fetch(
        `/api/health/weight?${params.toString()}`
      );
      const maintenanceResponse = await fetch(
        `/api/health/maintenance?${params.toString()}`
      );

      const weightJson = (await weightResponse.json()) as WeightResponse;
      const maintenanceJson =
        (await maintenanceResponse.json()) as MaintenanceEstimate;

      setWeightData(weightJson);
      setMaintenanceData(maintenanceJson);
    } catch {
      setAlert({ text: "Something went wrong", type: "error" });
      setWeightData(null);
      setMaintenanceData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <H2>Weight Dashboard</H2>

      <FilterBar onFilter={fetchWeight} />

      {loading && <Loader text="Loading weight data..." />}
      {alert && <Alert {...alert} />}

      {weightData && weightData.length > 0 && (
        <FlexWrapper>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weightData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={colors.charts.grid}
              />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => formatDate(d)}
                stroke={colors.charts.axis}
              />
              <YAxis
                stroke={colors.charts.axis}
                domain={["auto", "auto"]}
                label={{
                  value: "Weight (kg)",
                  angle: -90,
                  position: "insideLeft",
                  offset: 0,
                  fill: colors.charts.axis,
                  style: { fontSize: "0.8rem" },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: colors.charts.tooltipBg,
                  border: `1px solid ${colors.charts.tooltipBg}`,
                  borderRadius: radii.md,
                  padding: spacing.sm,
                  color: colors.charts.tooltipText,
                }}
                labelFormatter={(label) => `Date: ${formatDate(label)}`}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={colors.charts.weightLine}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Weight (kg)"
              />
              {["ma7", "ma30", "ma90"].map((ma) => {
                if (
                  !weightData.some(
                    (d) => d[ma as keyof WeightResponse] !== null
                  )
                )
                  return null;

                return (
                  <Line
                    key={ma}
                    type="monotone"
                    dataKey={ma}
                    stroke={
                      colors.charts[ma as keyof typeof colors.charts] as string
                    }
                    strokeWidth={1.5}
                    dot={false}
                    name={`Weight (kg) ${ma.replace("ma", "")}d MA`}
                  />
                );
              })}
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </FlexWrapper>
      )}

      {maintenanceData && (
        <>
          <DashboardGrid>
            <Card
              title="Actual Start Weight (kg)"
              value={maintenanceData.pred_start_weight}
            />
            <Card
              title="Actual End Weight (kg)"
              value={maintenanceData.pred_end_weight}
            />

            <Card
              title="Total Weight Change (kg)"
              value={maintenanceData.total_weight_change}
            />
          </DashboardGrid>
          <DashboardGrid>
            <Card
              title="Maintenance Calories"
              value={maintenanceData.estimated_maintenance_calories}
            />
            <Card
              title="Avg Daily Calories"
              value={maintenanceData.avg_daily_calories}
            />
            <Card title="Kg/Day" value={maintenanceData.kg_per_day} />
            <Card title="Kg/Week" value={maintenanceData.kg_per_week} />
            <Card title="Kg/Month" value={maintenanceData.kg_per_month} />
          </DashboardGrid>
          <FlexWrapper>
            <ProgressBar
              label="Weight Progress"
              start={maintenanceData.pred_start_weight}
              progress={maintenanceData.progress_pct ?? 0}
              current={maintenanceData.pred_end_weight}
              goal={maintenanceData.goal_weight ?? 0}
              etaDays={maintenanceData.estimated_days_to_goal}
            />
          </FlexWrapper>
        </>
      )}
    </>
  );
};

export default Weight;
