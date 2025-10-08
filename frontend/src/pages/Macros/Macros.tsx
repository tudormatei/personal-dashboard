import { useState, type JSX } from "react";
import { Header, DashboardGrid, NutrientContainer } from "./Macros.styled";
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
import type { MacrosData, NutrientRecord } from "../../types/types";
import Loader from "../../components/Loader/Loader";
import Alert from "../../components/Alert/Alert";
import { formatDate } from "../../utils/utils";

const nutrients = [
  { key: "calories", label: "Calories (kcal)" },
  { key: "protein", label: "Protein (g)" },
  { key: "carbs", label: "Carbs (g)" },
  { key: "fat", label: "Fat (g)" },
  { key: "fiber", label: "Fiber (g)" },
];

const Macros = (): JSX.Element => {
  const [macrosData, setMacrosData] = useState<MacrosData | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (startDate: string, endDate: string) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      });
      const macrosRes = await fetch(`/api/macros?${params.toString()}`);
      const macrosJson: MacrosData = await macrosRes.json();
      setMacrosData(macrosJson);
    } catch {
      setError("Something went wrong");
      setMacrosData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header>Macros Dashboard</Header>

      <FilterBar onFilter={fetchData} />

      {loading && <Loader text="Loading macros data..." />}

      {error && <Alert text={error} type="error" />}

      {macrosData &&
        nutrients.map((nutrient) => {
          const data =
            macrosData[nutrient.key as keyof MacrosData]?.daily ?? [];
          const summary = macrosData[nutrient.key as keyof MacrosData]?.summary;
          if (!data || data.length === 0) return null;

          return (
            <NutrientContainer key={nutrient.key}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={colors.charts.grid}
                  />
                  <XAxis
                    dataKey="date"
                    stroke={colors.charts.axis}
                    tickFormatter={(d) => formatDate(d)}
                  />
                  <YAxis
                    stroke={colors.charts.axis}
                    domain={["auto", "auto"]}
                    label={{
                      value: nutrient.label,
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
                    stroke={
                      colors.charts[
                        nutrient.key as keyof typeof colors.charts
                      ] as string
                    }
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                    name={nutrient.label}
                  />

                  {["ma7", "ma30", "ma90"].map((ma) => {
                    if (
                      !data.some((d) => d[ma as keyof NutrientRecord] !== null)
                    )
                      return null;

                    return (
                      <Line
                        key={ma}
                        type="monotone"
                        dataKey={ma}
                        stroke={
                          colors.charts[
                            ma as keyof typeof colors.charts
                          ] as string
                        }
                        strokeWidth={1.5}
                        dot={false}
                        name={`${nutrient.label} ${ma.replace("ma", "")}d MA`}
                      />
                    );
                  })}
                  <Legend />
                </LineChart>
              </ResponsiveContainer>

              {summary && (
                <DashboardGrid>
                  <Card
                    title={`Total ${nutrient.label}`}
                    value={summary.total}
                  />
                  <Card title="Average/Day" value={summary.average_per_day} />
                  <Card title="Min/Day" value={summary.min_per_day} />
                  <Card title="Max/Day" value={summary.max_per_day} />
                  <Card title="Std Dev" value={summary.std_dev} />
                </DashboardGrid>
              )}
            </NutrientContainer>
          );
        })}
    </>
  );
};

export default Macros;
