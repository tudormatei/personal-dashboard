import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SubHeader } from "../../components/Typography/Headings";
import { DashboardGrid, FlexWrapper } from "../../components/Layout/Layout";
import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import Button from "../../components/Button/Button";
import Skeleton from "../../components/Skeleton/Skeleton";
import Alert from "../../components/Alert/Alert";
import { colors } from "../../constants/styling";

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
import {
  ChartCard,
  ChartsRow,
  LeftColumn,
  RecurringItem,
  RecurringList,
  RightColumn,
} from "./Wallet.styled";

type PieResponse = {
  categories: {
    category: string;
    subcategory?: string;
    value: number;
  }[];
};

type TopCategory = {
  category: string;
  amount_current: number;
  amount_prev: number;
  percent_change: number | null;
};

type RecurringTx = {
  description: string;
  avg_amount: number;
  occurrences: number;
  frequency: string; // monthly, weekly, biweekly
  sample_dates: string[];
};

const COLORS = [
  "#4e79a7",
  "#f28e2b",
  "#e15759",
  "#76b7b2",
  "#59a14f",
  "#edc949",
  "#af7aa1",
  "#ff9da7",
  "#9c755f",
  "#bab0ab",
];

const Analytics: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    text: string;
    type: "error" | "info";
  } | null>(null);

  const today = new Date();
  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(
    formatDate(new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000))
  );
  const [endDate, setEndDate] = useState(formatDate(today));
  const [bankFilter, setBankFilter] = useState("");

  const [pieData, setPieData] = useState<PieResponse | null>(null);
  const [topCategories, setTopCategories] = useState<TopCategory[] | null>(
    null
  );
  const [recurring, setRecurring] = useState<RecurringTx[] | null>(null);

  const fetchPie = useCallback(async () => {
    setLoading(true);
    setAlert(null);
    try {
      const params = new URLSearchParams();
      if (startDate) params.set("start_date", startDate);
      if (endDate) params.set("end_date", endDate);
      if (bankFilter) params.set("bank", bankFilter);
      const res = await fetch(
        `/api/analytics/categories-pie?${params.toString()}`
      );
      const json = await res.json();
      setPieData(json);
    } catch {
      setAlert({ text: "Failed to fetch pie data", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, bankFilter]);

  const fetchTop = useCallback(async () => {
    setLoading(true);
    setAlert(null);
    try {
      const params = new URLSearchParams();
      if (startDate) params.set("start_date", startDate);
      if (endDate) params.set("end_date", endDate);
      if (bankFilter) params.set("bank", bankFilter);
      const res = await fetch(
        `/api/analytics/top-categories?${params.toString()}`
      );
      const json = await res.json();
      setTopCategories(json.top);
    } catch {
      setAlert({ text: "Failed to fetch top categories", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, bankFilter]);

  const fetchRecurring = useCallback(async () => {
    setLoading(true);
    setAlert(null);
    try {
      const params = new URLSearchParams();
      if (startDate) params.set("start_date", startDate);
      if (endDate) params.set("end_date", endDate);
      if (bankFilter) params.set("bank", bankFilter);
      const res = await fetch(`/api/analytics/recurring?${params.toString()}`);
      const json = await res.json();
      setRecurring(json.recurring);
    } catch {
      setAlert({
        text: "Failed to fetch recurring transactions",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, bankFilter]);

  useEffect(() => {
    fetchPie();
    fetchTop();
    fetchRecurring();
  }, [fetchPie, fetchTop, fetchRecurring]);

  // const totalSpent = useMemo(() => {
  //   if (!pieData) return 0;
  //   return pieData.categories.reduce((s, c) => s + c.value, 0);
  // }, [pieData]);

  const totalSpent = 2;

  return (
    <div>
      <FlexWrapper>
        <SubHeader>Analytics</SubHeader>
        <DashboardGrid>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <Select
            value={bankFilter}
            onChange={(val) => setBankFilter(val ?? "")}
            options={[{ label: "All Banks", value: "" }]}
            // extend the select to fetch banks from /api/bank if you like
          />
          <Button
            onClick={() => {
              fetchPie();
              fetchTop();
              fetchRecurring();
            }}
          >
            Refresh
          </Button>
        </DashboardGrid>
      </FlexWrapper>

      {loading && <Skeleton width="100%" height="380px" />}
      {alert && <Alert {...alert} />}

      <ChartsRow>
        <LeftColumn>
          <ChartCard>
            <h3>Spending by Category</h3>
            <p style={{ marginTop: 4, marginBottom: 12 }}>
              Total spent: {totalSpent.toFixed(2)}
            </p>
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={pieData?.categories || []}
                    nameKey={(d) =>
                      `${d.category}${
                        d.subcategory ? ` - ${d.subcategory}` : ""
                      }`
                    }
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={2}
                    label={(entry) =>
                      `${entry.category}${
                        entry.subcategory ? ` / ${entry.subcategory}` : ""
                      }`
                    }
                  >
                    {(pieData?.categories || []).map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${value.toFixed(2)}`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard style={{ marginTop: 18 }}>
            <h3>Top 5 Spending Categories</h3>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <BarChart
                  data={topCategories || []}
                  layout="vertical"
                  margin={{ left: 20, right: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" width={140} />
                  <Tooltip />
                  <Bar dataKey="amount_current" name="This period">
                    <LabelList dataKey="amount_current" position="right" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div style={{ marginTop: 8 }}>
                {(topCategories || []).map((t) => (
                  <div
                    key={t.category}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 6,
                    }}
                  >
                    <div>{t.category}</div>
                    <div style={{ textAlign: "right" }}>
                      <div>{t.amount_current.toFixed(2)}</div>
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
                ))}
              </div>
            </div>
          </ChartCard>
        </LeftColumn>

        <RightColumn>
          <ChartCard>
            <h3>Recurring Transactions</h3>
            <p style={{ marginTop: 4, marginBottom: 12 }}>
              Detected recurring transactions (based on description + frequency)
            </p>
            <RecurringList>
              {recurring && recurring.length > 0 ? (
                recurring.map((r) => (
                  <RecurringItem key={r.description}>
                    <div>
                      <strong>{r.description}</strong>
                      <div style={{ fontSize: 12, color: "#666" }}>
                        {r.frequency} • {r.occurrences} occurrences
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div>{r.avg_amount.toFixed(2)}</div>
                      <div style={{ fontSize: 12, color: "#666" }}>
                        {r.sample_dates.slice(0, 3).join(", ")}
                      </div>
                    </div>
                  </RecurringItem>
                ))
              ) : (
                <div>No recurring transactions detected</div>
              )}
            </RecurringList>
          </ChartCard>
        </RightColumn>
      </ChartsRow>
    </div>
  );
};

export default Analytics;
