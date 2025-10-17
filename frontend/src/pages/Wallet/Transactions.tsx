import { useCallback, useEffect, useState } from "react";
import { SubHeader } from "../../components/Typography/Headings";
import type { AlertData } from "../../types/types";
import Loader from "../../components/Loader/Loader";
import Alert from "../../components/Alert/Alert";
import type { operations } from "../../types/api-routes";
import {
  DashboardGrid,
  FlexWrapper,
  GappedDiv,
} from "../../components/Layout/Layout";
import { formatDateTime, formatNumber } from "../../utils/utils";
import Table from "../../components/Table/Table";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Select from "../../components/Select/Select";
import { colors } from "../../constants/styling";
import {
  CategoryCell,
  DescriptionCell,
  PagesContainer,
  SortButton,
  SubcategoryCell,
} from "./Wallet.styled";

type TransactionsResponse =
  operations["get_transactions_api_bank_transactions_get"]["responses"][200]["content"]["application/json"];

type BanksResponse =
  operations["get_available_api_bank__get"]["responses"][200]["content"]["application/json"];

const Transactions = () => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertData | null>(null);

  const today = new Date();
  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  const [walletData, setWalletData] = useState<TransactionsResponse>(null);
  const [availableBanks, setAvailableBanks] = useState<string[]>();

  const [descriptionFilter, setDescriptionFilter] = useState("");
  const [sourceBankFilter, setSourceBankFilter] = useState("");
  const [walletStartDate, setWalletStartDate] = useState(
    formatDate(new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000))
  );
  const [walletEndDate, setWalletEndDate] = useState(formatDate(today));
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [getAll, setGetAll] = useState(true);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  useEffect(() => {
    const fetchBanks = async () => {
      setAlert(null);
      try {
        const res = await fetch("/api/bank");
        const data = (await res.json()) as BanksResponse;
        setAvailableBanks(data.banks);
      } catch {
        setAlert({ text: "Failed to fetch bank names", type: "error" });
      }
    };

    fetchBanks();
  }, []);

  const fetchWallet = useCallback(
    async (pageNumber = 1) => {
      setLoading(true);
      setAlert(null);
      setWalletData(null);

      const params = new URLSearchParams();
      if (walletStartDate && !getAll) params.set("start_date", walletStartDate);
      if (walletEndDate && !getAll) params.set("end_date", walletEndDate);
      if (descriptionFilter) params.set("description", descriptionFilter);
      if (sourceBankFilter) params.set("bank", sourceBankFilter);
      params.set("order", sortOrder);
      params.set("page", pageNumber.toString());

      try {
        const res = await fetch(`/api/bank/transactions?${params.toString()}`);
        const json = await res.json();
        setWalletData(json);
        setPage(pageNumber);
      } catch {
        setAlert({ text: "Something went wrong", type: "error" });
        setWalletData(null);
      } finally {
        setLoading(false);
      }
    },
    [
      walletStartDate,
      walletEndDate,
      descriptionFilter,
      sourceBankFilter,
      getAll,
      sortOrder,
    ]
  );

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  return (
    <>
      <FlexWrapper>
        <SubHeader>Transactions</SubHeader>
        <FlexWrapper>
          <DashboardGrid>
            <Button
              variant="secondary"
              onClick={() => setGetAll((prev) => !prev)}
            >
              {getAll ? "Custom Date" : "All"}
            </Button>
            {!getAll && (
              <>
                <Input
                  type="date"
                  disabled={getAll}
                  placeholder="Start Date"
                  value={walletStartDate}
                  onChange={(e) => setWalletStartDate(e.target.value)}
                />
                <Input
                  type="date"
                  disabled={getAll}
                  placeholder="End Date"
                  value={walletEndDate}
                  onChange={(e) => setWalletEndDate(e.target.value)}
                />
              </>
            )}
            <Select
              value={sourceBankFilter}
              onChange={(val) => setSourceBankFilter(val ?? "")}
              options={[
                { label: "All Banks", value: "" },
                ...(availableBanks?.map((bank) => ({
                  label: bank,
                  value: bank,
                })) || []),
              ]}
            />
            <Input
              placeholder="Search description..."
              value={descriptionFilter}
              onChange={(e) => setDescriptionFilter(e.target.value)}
            />
            <SortButton active={sortOrder === "desc"} onClick={toggleSortOrder}>
              {sortOrder === "asc" ? "Ascending" : "Descending"}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 4V20M12 20L5 13M12 20L19 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </SortButton>
          </DashboardGrid>
        </FlexWrapper>

        {loading && <Loader text="Loading transactions..." />}
        {alert && <Alert {...alert} />}

        {walletData && (
          <>
            <Table
              headers={[
                "No.",
                "Date",
                "Type",
                "Amount",
                "Balance",
                "Total Balance",
                "Category",
                "Subcategory",
                "Description",
                "Bank",
              ]}
              scrollable
            >
              {walletData.transactions.map((tx, i) => (
                <tr key={i}>
                  <td>
                    {i + 1 + (page - 1) * walletData.pagination.page_size}
                  </td>
                  <td>{formatDateTime(tx.date)}</td>
                  <td>{tx.type ?? "-"}</td>
                  <td
                    style={{
                      color:
                        tx.amount >= 0
                          ? colors.charts.profit
                          : colors.charts.loss,
                    }}
                  >
                    {formatNumber(tx.amount)}
                  </td>
                  <td>
                    {tx.balance !== null ? formatNumber(tx.balance) : "-"}
                  </td>
                  <td>
                    {tx.unified_balance !== null
                      ? formatNumber(tx.unified_balance)
                      : "-"}
                  </td>
                  <td>
                    {tx.category && (
                      <CategoryCell category={tx.category}>
                        {tx.category}
                      </CategoryCell>
                    )}
                  </td>
                  <td>
                    {tx.subcategory ? (
                      <SubcategoryCell>{tx.subcategory}</SubcategoryCell>
                    ) : (
                      tx.type && <SubcategoryCell>{tx.type}</SubcategoryCell>
                    )}
                  </td>
                  <DescriptionCell>{tx.description}</DescriptionCell>
                  <td>{tx.source_bank}</td>
                </tr>
              ))}
            </Table>
            <GappedDiv>
              <Button
                variant="secondary"
                disabled={page <= 1}
                onClick={() => fetchWallet(page - 1)}
              >
                Previous
              </Button>
              <PagesContainer>
                Page {page} of {walletData.pagination.total_pages}
              </PagesContainer>
              <Button
                variant="secondary"
                disabled={page >= walletData.pagination.total_pages}
                onClick={() => fetchWallet(page + 1)}
              >
                Next
              </Button>
            </GappedDiv>
          </>
        )}
      </FlexWrapper>
    </>
  );
};

export default Transactions;
