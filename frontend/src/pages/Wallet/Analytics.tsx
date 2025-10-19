import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SubHeader } from "../../components/Typography/Headings";
import { DashboardGrid, FlexWrapper } from "../../components/Layout/Layout";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Alert from "../../components/Alert/Alert";
import { colors, radii, spacing } from "../../constants/styling";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";
import { RecurringItem, RecurringList } from "./Wallet.styled";
import type { operations } from "../../types/api-routes";
import Loader from "../../components/Loader/Loader";
import type { AlertData } from "../../types/types";

type CategoriesPieResponse =
  operations["get_categories_pie_api_bank_categories_pie_get"]["responses"][200]["content"]["application/json"];

type TopCategoriesResponse =
  operations["get_top_categories_api_bank_top_categories_get"]["responses"][200]["content"]["application/json"];

type RecurringResponse =
  operations["get_recurring_transactions_api_bank_recurring_get"]["responses"][200]["content"]["application/json"];

const Analytics: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertData | null>(null);

  const today = new Date();
  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(
    formatDate(new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000))
  );
  const [endDate, setEndDate] = useState(formatDate(today));
  const [getAll, setGetAll] = useState(true);
  const [pieData, setPieData] = useState<CategoriesPieResponse>();
  const [topCategories, setTopCategories] = useState<TopCategoriesResponse>();
  const [recurring, setRecurring] = useState<RecurringResponse>();

  const fetchPie = useCallback(async () => {
    setLoading(true);
    setAlert(null);
    try {
      const params = new URLSearchParams();
      if (startDate && !getAll) params.set("start_date", startDate);
      if (endDate && !getAll) params.set("end_date", endDate);
      const res = await fetch(`/api/bank/categories-pie?${params.toString()}`);
      const json = (await res.json()) as CategoriesPieResponse;
      setPieData(json);
    } catch {
      setAlert({ text: "Failed to fetch pie data", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, getAll]);

  const fetchTop = useCallback(async () => {
    setLoading(true);
    setAlert(null);
    try {
      const params = new URLSearchParams();
      if (startDate && !getAll) params.set("start_date", startDate);
      if (endDate && !getAll) params.set("end_date", endDate);
      const res = await fetch(`/api/bank/top-categories?${params.toString()}`);
      const json = (await res.json()) as TopCategoriesResponse;
      setTopCategories(json);
    } catch {
      setAlert({ text: "Failed to fetch top categories", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, getAll]);

  const fetchRecurring = useCallback(async () => {
    setLoading(true);
    setAlert(null);
    try {
      const params = new URLSearchParams();
      if (startDate && !getAll) params.set("start_date", startDate);
      if (endDate && !getAll) params.set("end_date", endDate);
      const res = await fetch(`/api/bank/recurring?${params.toString()}`);
      const json = (await res.json()) as RecurringResponse;
      setRecurring(json);
    } catch {
      setAlert({
        text: "Failed to fetch recurring transactions",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, getAll]);

  useEffect(() => {
    fetchPie();
    fetchTop();
    fetchRecurring();
  }, [fetchPie, fetchTop, fetchRecurring]);

  const totalSpent = useMemo(() => {
    if (!pieData) return 0;
    return pieData.categories.reduce((s, c) => s + c.value, 0);
  }, [pieData]);

  return (
    <>
      <FlexWrapper>
        <SubHeader>Analytics</SubHeader>
        <DashboardGrid>
          <Button
            variant="secondary"
            onClick={() => setGetAll((prev) => !prev)}
          >
            {getAll ? "Custom Date" : "All"}
          </Button>
          <Input
            type="date"
            disabled={getAll}
            placeholder="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            type="date"
            disabled={getAll}
            placeholder="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </DashboardGrid>
      </FlexWrapper>

      {loading && <Loader text="Loading analytics..." />}
      {alert && <Alert {...alert} />}

      <FlexWrapper row>
        <FlexWrapper style={{ width: "40%" }}>
          <span style={{ textAlign: "center" }}>
            Total spent: {totalSpent.toFixed(2)}
          </span>
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
        </FlexWrapper>
        <FlexWrapper style={{ width: "60%" }}>
          <span
            style={{
              textAlign: "center",
            }}
          >
            {`Top 5 Spending Categories (${new Date(endDate).toLocaleDateString(
              "en-US",
              { month: "long", year: "numeric" }
            )})`}
          </span>

          <ResponsiveContainer height={350}>
            <BarChart
              data={topCategories?.top_categories || []}
              layout="vertical"
              margin={{ left: 20, right: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="category" type="category" width={140} />
              <Tooltip />
              <Bar dataKey="amount_current" name="This period" fill="#3b82f6">
                <LabelList dataKey="amount_current" position="right" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </FlexWrapper>
      </FlexWrapper>
      <FlexWrapper row>
        <FlexWrapper style={{ width: "50%" }}>
          <span style={{ textAlign: "center" }}>Recurring Transactions</span>
          <RecurringList>
            {recurring && recurring.recurring.length > 0 ? (
              recurring.recurring.map((r) => (
                <RecurringItem key={r.description}>
                  <div>
                    <strong>{r.description}</strong>
                    <div style={{ fontSize: 12, color: "#666" }}>
                      {r.frequency} • {r.occurrences.length} occurrences
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div>{r.avg_amount.toFixed(2)}</div>
                  </div>
                </RecurringItem>
              ))
            ) : (
              <div>No recurring transactions detected</div>
            )}
          </RecurringList>
        </FlexWrapper>
        <FlexWrapper style={{ width: "50%" }}>
          {(topCategories?.top_categories || []).map((t) => (
            <div
              key={t.category}
              style={{
                marginTop: 12,
                padding: "10px 12px",
                border: "1px solid #e0e0e0",
                borderRadius: 8,
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ fontWeight: "bold" }}>{t.category}</div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 15 }}>
                    {t.amount_current.toFixed(2)}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color:
                        t.percent_change === null
                          ? "#666"
                          : t.percent_change >= 0
                          ? colors.charts.loss
                          : colors.charts.profit,
                    }}
                  >
                    {t.percent_change === null
                      ? "n/a"
                      : `${t.percent_change.toFixed(1)}% vs prev`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </FlexWrapper>
      </FlexWrapper>
    </>
  );
};

export default Analytics;
