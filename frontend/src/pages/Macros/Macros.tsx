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
import type { components, operations } from "../../types/api-routes";
import type { AlertData } from "../../types/types";
import { H1 } from "../../components/Typography/Headings";
import { DashboardGrid, FlexWrapper } from "../../components/Layout/Layout";
import { useIsPhone } from "../../hooks/useIsPhone";

const nutrients = [
  { key: "calories", label: "Calories (kcal)" },
  { key: "protein", label: "Protein (g)" },
  { key: "carbs", label: "Carbs (g)" },
  { key: "fat", label: "Fat (g)" },
  { key: "fiber", label: "Fiber (g)" },
];

type MacrosData =
  operations["macros_history_api_health_macros_get"]["responses"][200]["content"]["application/json"];
type DailyNutrient = components["schemas"]["DailyNutrient"];

const Macros = (): JSX.Element => {
  const isPhone = useIsPhone();

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertData | null>(null);

  const [macrosData, setMacrosData] = useState<MacrosData>(null);

  const fetchData = async (startDate: string, endDate: string) => {
    setLoading(true);
    setAlert(null);
    setMacrosData(null);

    try {
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      });
      const macrosRes = await fetch(`/api/health/macros?${params.toString()}`);
      const macrosJson = (await macrosRes.json()) as MacrosData;
      if (macrosJson === null)
        setAlert({
          text: "No macros data found for this period",
          type: "info",
        });

      setMacrosData(macrosJson);
    } catch {
      setAlert({ text: "Something went wrong", type: "error" });
      setMacrosData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <H1>Macros Dashboard</H1>

      <FilterBar onFilter={fetchData} />

      {loading && <Loader text="Loading macros data..." />}
      {alert && <Alert {...alert} />}

      {macrosData &&
        nutrients.map((nutrient) => {
          const data =
            macrosData[nutrient.key as keyof MacrosData]?.daily ?? [];
          const summary = macrosData[nutrient.key as keyof MacrosData]?.summary;
          if (!data || data.length === 0) return null;

          return (
            <FlexWrapper key={nutrient.key}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={data}
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
                    stroke={colors.charts.axis}
                    tickFormatter={(d) => formatDate(d)}
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
                            value: nutrient.label,
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
                    stroke={
                      colors.charts[
                        nutrient.key as keyof typeof colors.charts
                      ] as string
                    }
                    strokeWidth={isPhone ? 1.8 : 2}
                    dot={{ r: isPhone ? 2 : 4 }}
                    activeDot={{ r: isPhone ? 4 : 6 }}
                    name={nutrient.label}
                  />

                  {["ma7", "ma30", "ma90"].map((ma) => {
                    if (
                      !data.some((d) => d[ma as keyof DailyNutrient] !== null)
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
                        strokeWidth={isPhone ? 1.2 : 1.5}
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
            </FlexWrapper>
          );
        })}
    </>
  );
};

export default Macros;
