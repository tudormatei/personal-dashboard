import React, { useCallback, useEffect, useState } from "react";
import { SubHeader } from "../../../components/Typography/Headings";
import { DashboardGrid, FlexWrapper } from "../../../components/Layout/Layout";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import Alert from "../../../components/Alert/Alert";

import type { operations } from "../../../types/api-routes";
import Loader from "../../../components/Loader/Loader";
import type { AlertData } from "../../../types/types";
import TopCategories from "./TopCategories/TopCategories";
import CategoriesPieChart from "./CategoriesPieChart";
import RecurringTransactions from "./RecurringTransactions/RecurringTransactions";

type CategoriesPieResponse =
  operations["get_categories_pie_api_bank_categories_pie_get"]["responses"][200]["content"]["application/json"];

type TopCategoriesResponse =
  operations["get_top_categories_api_bank_top_categories_get"]["responses"][200]["content"]["application/json"];

type RecurringResponse =
  operations["get_recurring_transactions_api_bank_recurring_get"]["responses"][200]["content"]["application/json"];

const Analytics: React.FC = () => {
  const [loadingPie, setLoadingPie] = useState(false);
  const [loadingTop, setLoadingTop] = useState(false);
  const [loadingRecurring, setLoadingRecurring] = useState(false);
  const [alert, setAlert] = useState<AlertData | null>(null);

  const today = new Date();
  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(
    formatDate(new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000))
  );
  const [endDate, setEndDate] = useState(formatDate(today));
  const [getAll, setGetAll] = useState(true);
  const [pieData, setPieData] = useState<CategoriesPieResponse>(null);
  const [topCategories, setTopCategories] =
    useState<TopCategoriesResponse>(null);
  const [recurring, setRecurring] = useState<RecurringResponse>(null);

  const fetchPie = useCallback(async () => {
    setLoadingPie(true);
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
      setLoadingPie(false);
    }
  }, [startDate, endDate, getAll]);

  const fetchTop = useCallback(async () => {
    setLoadingTop(true);
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
      setLoadingTop(false);
    }
  }, [startDate, endDate, getAll]);

  const fetchRecurring = useCallback(async () => {
    setLoadingRecurring(true);
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
      setLoadingRecurring(false);
    }
  }, [startDate, endDate, getAll]);

  useEffect(() => {
    fetchPie();
    fetchTop();
    fetchRecurring();
  }, [fetchPie, fetchTop, fetchRecurring]);

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

      {alert && <Alert {...alert} />}

      {loadingTop && <Loader text="Loading top categories..." />}
      <TopCategories topCategories={topCategories} endDate={endDate} />
      <FlexWrapper row>
        <FlexWrapper style={{ width: "50%" }}>
          {loadingPie && <Loader text="Loading pie chart..." />}
          <CategoriesPieChart pieData={pieData} />
        </FlexWrapper>

        <FlexWrapper style={{ width: "50%" }}>
          {loadingRecurring && (
            <Loader text="Loading recurring transactions..." />
          )}
          <RecurringTransactions recurring={recurring} />
        </FlexWrapper>
      </FlexWrapper>
    </>
  );
};

export default Analytics;
