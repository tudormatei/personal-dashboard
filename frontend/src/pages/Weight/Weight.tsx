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
import { H1 } from "../../components/Typography/Headings";
import { DashboardGrid, FlexWrapper } from "../../components/Layout/Layout";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import { useIsPhone } from "../../hooks/useIsPhone";

type WeightResponse =
  operations["weight_history_api_health_weight_get"]["responses"][200]["content"]["application/json"];

type MaintenanceEstimate =
  operations["maintenance_calories_api_health_maintenance_get"]["responses"][200]["content"]["application/json"];

const Weight = (): JSX.Element => {
  const isPhone = useIsPhone();

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
        `/api/health/weight?${params.toString()}`,
      );
      const maintenanceResponse = await fetch(
        `/api/health/maintenance?${params.toString()}`,
      );

      const weightJson = (await weightResponse.json()) as WeightResponse;
      const maintenanceJson =
        (await maintenanceResponse.json()) as MaintenanceEstimate;

      if (maintenanceJson === null)
        setAlert({
          text: "No maintenance data found for this period",
          type: "info",
        });
      if (weightJson === null)
        setAlert({
          text: "No weight data found for this period",
          type: "info",
        });

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

  const weightMetrics = maintenanceData?.weight_metrics;
  const calorieMetrics = maintenanceData?.calorie_metrics;

  return (
    <>
      <H1>Weight Dashboard</H1>

      <FilterBar onFilter={fetchWeight} />

      {loading && <Loader text="Loading weight data..." />}
      {alert && <Alert {...alert} />}

      {weightData && weightData.length > 0 && (
        <FlexWrapper>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={weightData}
              margin={{
                top: 8,
                right: isPhone ? 8 : 16,
                left: isPhone ? 0 : 8,
                bottom: isPhone ? 0 : 8,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={colors.charts.grid}
              />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => formatDate(d)}
                stroke={colors.charts.axis}
                minTickGap={isPhone ? 24 : 12}
                tick={{ fontSize: isPhone ? 11 : 12 }}
              />
              <YAxis
                stroke={colors.charts.axis}
                domain={["auto", "auto"]}
                width={isPhone ? 36 : 52}
                tick={{ fontSize: isPhone ? 11 : 12 }}
                tickCount={isPhone ? 4 : 6}
                label={
                  isPhone
                    ? undefined
                    : {
                        value: "Weight (kg)",
                        angle: -90,
                        position: "insideLeft",
                        offset: 0,
                        fill: colors.charts.axis,
                        style: { fontSize: "0.8rem" },
                      }
                }
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
                strokeWidth={isPhone ? 1.8 : 2}
                dot={{ r: isPhone ? 2 : 4 }}
                activeDot={{ r: isPhone ? 4 : 6 }}
                name="Weight (kg)"
              />
              {["ma7", "ma30", "ma90"].map((ma) => {
                if (
                  !weightData.some(
                    (d) => d[ma as keyof WeightResponse] !== null,
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
                    strokeWidth={isPhone ? 1.2 : 1.5}
                    dot={false}
                    name={
                      isPhone
                        ? `${ma.replace("ma", "")}d`
                        : `Weight (kg) ${ma.replace("ma", "")}d MA`
                    }
                  />
                );
              })}
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </FlexWrapper>
      )}

      {weightMetrics && (
        <>
          <DashboardGrid>
            <Card
              title="Actual Start Weight (kg)"
              value={weightMetrics.pred_start_weight}
            />
            <Card
              title="Actual End Weight (kg)"
              value={weightMetrics.pred_end_weight}
            />
            <Card
              title="Total Weight Change (kg)"
              value={weightMetrics.total_weight_change}
            />
          </DashboardGrid>

          <DashboardGrid>
            <Card title="Kg/Day" value={weightMetrics.kg_per_day} />
            <Card title="Kg/Week" value={weightMetrics.kg_per_week} />
            <Card title="Kg/Month" value={weightMetrics.kg_per_month} />
          </DashboardGrid>

          {weightMetrics.goal_weight > weightMetrics.pred_start_weight && (
            <FlexWrapper>
              <ProgressBar
                label="Weight Progress"
                start={Number(weightMetrics.pred_start_weight?.toFixed(1))}
                progress={Number(weightMetrics.progress_pct?.toFixed(1) ?? 0)}
                current={Number(weightMetrics.pred_end_weight?.toFixed(1))}
                goal={weightMetrics.goal_weight}
                etaDays={weightMetrics.estimated_days_to_goal}
              />
            </FlexWrapper>
          )}
        </>
      )}

      {calorieMetrics && (
        <DashboardGrid>
          <Card
            title="Maintenance Calories"
            value={calorieMetrics.estimated_maintenance_calories}
          />
          <Card
            title="Avg Daily Calories"
            value={calorieMetrics.avg_daily_calories}
          />
        </DashboardGrid>
      )}
    </>
  );
};

export default Weight;
