import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FlexWrapper } from "../../../../components/Layout/Layout";
import type { operations } from "../../../../types/api-routes";
import { AnalyiticsTitle } from "../Analytics.styled";
import {
  CategoryCard,
  CategoryName,
  CategoryRow,
  CategoryValues,
  CurrentAmount,
  PercentChange,
} from "./TopCategories.styled";
import { chartStyles } from "../../../../constants/styling";

type TopCategoriesReponse =
  operations["get_top_categories_api_bank_top_categories_get"]["responses"][200]["content"]["application/json"];

type TopCategoriesProps = {
  topCategories: TopCategoriesReponse;
  endDate: string;
};

const TopCategories: React.FC<TopCategoriesProps> = ({
  topCategories,
  endDate,
}) => {
  return (
    <>
      {topCategories && (
        <AnalyiticsTitle>
          {`Top 5 Spending Categories (${new Date(endDate).toLocaleDateString(
            "en-US",
            {
              month: "long",
              year: "numeric",
            }
          )})`}
        </AnalyiticsTitle>
      )}
      <FlexWrapper row>
        <FlexWrapper style={{ width: "50%" }}>
          {topCategories && (
            <ResponsiveContainer>
              <BarChart
                data={topCategories?.top_categories || []}
                layout="vertical"
                margin={{ left: 20, right: 20 }}
              >
                <CartesianGrid
                  stroke={chartStyles.grid.stroke}
                  strokeDasharray={chartStyles.grid.strokeDasharray}
                />

                <XAxis type="number" stroke={chartStyles.axis.stroke} />

                <YAxis
                  dataKey="category"
                  type="category"
                  width={140}
                  stroke={chartStyles.axis.stroke}
                  label={{
                    angle: chartStyles.axis.label.angle,
                    position: chartStyles.axis.label.position,
                    dx: chartStyles.axis.label.offset,
                    fill: chartStyles.axis.label.fill,
                    fontSize: chartStyles.axis.label.style.fontSize,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: chartStyles.tooltip.backgroundColor,
                    border: chartStyles.tooltip.border,
                    borderRadius: chartStyles.tooltip.borderRadius,
                    padding: chartStyles.tooltip.padding,
                    color: chartStyles.tooltip.color,
                  }}
                />

                <Bar
                  dataKey="amount_current"
                  name="This period"
                  fill={chartStyles.bar.fill}
                  stroke={chartStyles.line.stroke}
                  strokeWidth={chartStyles.line.strokeWidth}
                >
                  <LabelList dataKey="amount_current" position="right" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </FlexWrapper>
        <FlexWrapper style={{ width: "50%" }}>
          {topCategories &&
            (topCategories.top_categories || []).map((t) => (
              <CategoryCard key={t.category}>
                <CategoryRow>
                  <CategoryName>{t.category}</CategoryName>
                  <CategoryValues>
                    <CurrentAmount>{t.amount_current.toFixed(2)}</CurrentAmount>
                    <PercentChange change={t.percent_change}>
                      {t.percent_change === null
                        ? "n/a"
                        : `${t.percent_change.toFixed(1)}% vs prev`}
                    </PercentChange>
                  </CategoryValues>
                </CategoryRow>
              </CategoryCard>
            ))}
        </FlexWrapper>
      </FlexWrapper>
    </>
  );
};

export default TopCategories;
