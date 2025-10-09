import { useState, type JSX } from "react";
import { Header, DashboardGrid } from "./Weight.styled";
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
import type { MaintenanceData, WeightRecord } from "../../types/types";
import Loader from "../../components/Loader/Loader";
import Alert from "../../components/Alert/Alert";
import { formatDate } from "../../utils/utils";

const Weight = (): JSX.Element => {
  const [weightData, setWeightData] = useState<WeightRecord[] | null>(null);
  const [maintenanceData, setMaintenanceData] =
    useState<MaintenanceData | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeight = async (startDate: string, endDate: string) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      });

      const url = `/api/health/weight?${params.toString()}`;
      const res = await fetch(url);
      const maintenanceRes = await fetch(
        `/api/health/maintenance?${params.toString()}`
      );

      const json: WeightRecord[] = await res.json();
      const maintenanceJson: MaintenanceData = await maintenanceRes.json();

      setWeightData(json);
      setMaintenanceData(maintenanceJson);
    } catch {
      setError("Something went wrong");
      setWeightData(null);
      setMaintenanceData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header>Weight Dashboard</Header>

      <FilterBar onFilter={fetchWeight} />

      {loading && <Loader text="Loading weight data..." />}

      {error && <Alert text={error} type="error" />}

      {weightData && weightData.length > 0 && (
        <>
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
                  !weightData.some((d) => d[ma as keyof WeightRecord] !== null)
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
        </>
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
        </>
      )}
    </>
  );
};

export default Weight;
