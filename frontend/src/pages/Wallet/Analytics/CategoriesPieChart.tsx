import { useMemo } from "react";
import type { operations } from "../../../types/api-routes";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { colors, radii, spacing } from "../../../constants/styling";
import { AnalyiticsTitle } from "./Analytics.styled";

type CategoriesPieResponse =
  operations["get_categories_pie_api_bank_categories_pie_get"]["responses"][200]["content"]["application/json"];

type CategoriesPieChartProps = {
  pieData: CategoriesPieResponse;
};

const CategoriesPieChart: React.FC<CategoriesPieChartProps> = ({ pieData }) => {
  const totalSpent = useMemo(() => {
    if (!pieData) return 0;
    return pieData.categories.reduce((s, c) => s + c.value, 0);
  }, [pieData]);

  return (
    <>
      {pieData && (
        <>
          <AnalyiticsTitle>
            Total spent: {totalSpent.toFixed(2)}
          </AnalyiticsTitle>
          <ResponsiveContainer height={350}>
            <PieChart>
              <Pie
                dataKey="value"
                data={pieData?.categories || []}
                nameKey={(d) =>
                  `${d.category}${d.subcategory ? ` - ${d.subcategory}` : ""}`
                }
                outerRadius={100}
                innerRadius={60}
                stroke="none"
                label={(entry) =>
                  `${entry.category}${
                    entry.subcategory ? ` / ${entry.subcategory}` : ""
                  }`
                }
              >
                {(pieData?.categories || []).map((val, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      colors.categories[
                        val.category as keyof typeof colors.categories
                      ]
                    }
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: colors.charts.tooltipBg,
                  border: `1px solid ${colors.charts.tooltipBg}`,
                  borderRadius: radii.md,
                  padding: spacing.sm,
                }}
                itemStyle={{ color: colors.charts.tooltipText }}
                formatter={(value: number, name: string) => {
                  const percentage = ((value / totalSpent) * 100).toFixed(2);
                  return [`${value} (${percentage}%)`, name];
                }}
              />
              <Legend
                wrapperStyle={{
                  color: colors.textPrimary,
                  marginTop: spacing.sm,
                }}
                iconType="circle"
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        </>
      )}
    </>
  );
};

export default CategoriesPieChart;
