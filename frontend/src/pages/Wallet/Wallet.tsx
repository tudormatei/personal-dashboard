import { useState } from "react";
import FilterBar from "../../components/FilterBar/FilterBar";
import { H1, SubHeader } from "../../components/Typography/Headings";
import type { AlertData } from "../../types/types";
import Loader from "../../components/Loader/Loader";
import Alert from "../../components/Alert/Alert";
import type { operations } from "../../types/api-routes";
import { DashboardGrid, FlexWrapper } from "../../components/Layout/Layout";
import Card from "../../components/Card/Card";
import {
  formatDate,
  formatDateDayMonth,
  formatDateTime,
  formatNumber,
} from "../../utils/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { colors, radii, spacing } from "../../constants/styling";
import Table from "../../components/Table/Table";
import Input from "../../components/Input/Input";

type TransactionsResponse =
  operations["get_transactions_api_bank_transactions_get"]["responses"][200]["content"]["application/json"];

const Wallet = () => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertData | null>(null);

  const [walletData, setWalletData] = useState<TransactionsResponse>(null);
  const currency = "EUR";

  const [descriptionFilter, setDescriptionFilter] = useState("");
  const [sourceBankFilter, setSourceBankFilter] = useState("");

  const fetchWallet = async (startDate: string, endDate: string) => {
    setLoading(true);
    setAlert(null);
    setWalletData(null);

    try {
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      });
      const walletResponse = await fetch(
        `/api/bank/transactions?${params.toString()}`
      );

      const walletJson = (await walletResponse.json()) as TransactionsResponse;

      setWalletData(walletJson);
    } catch {
      setAlert({ text: "Something went wrong", type: "error" });
      setWalletData(null);
    } finally {
      setLoading(false);
    }
  };

  const dailyFlows = walletData?.transactions?.reduce<
    Record<string, { date: string; inflow: number; outflow: number }>
  >((acc, tx) => {
    const amount = tx.amount ?? 0;
    if (!acc[tx.date]) acc[tx.date] = { date: tx.date, inflow: 0, outflow: 0 };
    if (amount >= 0) acc[tx.date].inflow += amount;
    else acc[tx.date].outflow += Math.abs(amount);
    return acc;
  }, {});

  const chartData = dailyFlows
    ? Object.values(dailyFlows).sort((a, b) => a.date.localeCompare(b.date))
    : [];

  const filteredTransactions =
    walletData?.transactions
      ?.filter((tx) =>
        descriptionFilter
          ? tx.description
              ?.toLowerCase()
              .includes(descriptionFilter.toLowerCase())
          : true
      )
      ?.filter((tx) =>
        sourceBankFilter ? tx.source_bank === sourceBankFilter : true
      ) ?? [];

  const availableBanks = Array.from(
    new Set(walletData?.transactions?.map((tx) => tx.source_bank) ?? [])
  );

  return (
    <>
      <H1>My Wallet</H1>
      <FilterBar onFilter={fetchWallet} runOnMount={false} />

      {loading && <Loader text="Loading transactions..." />}
      {alert && <Alert {...alert} />}

      {walletData && (
        <>
          <FlexWrapper>
            <SubHeader>Summary</SubHeader>
            <DashboardGrid>
              <Card
                title="Total In"
                value={`${formatNumber(
                  walletData.summary.total_in
                )} ${currency}`}
              />
              <Card
                title="Total Out"
                value={`${formatNumber(
                  walletData.summary.total_out
                )} ${currency}`}
              />
              <Card
                title="Net Balance"
                value={`${formatNumber(
                  walletData.summary.net_balance
                )} ${currency}`}
              />
            </DashboardGrid>
          </FlexWrapper>
          <FlexWrapper>
            <SubHeader>Total Balance Over Time</SubHeader>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={walletData.transactions}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={colors.charts.grid}
                />
                <XAxis
                  stroke={colors.charts.axis}
                  dataKey="date"
                  tickFormatter={(date) => `${formatDateDayMonth(date)}`}
                />
                <YAxis
                  stroke={colors.charts.axis}
                  label={{
                    value: "Value (€)",
                    angle: -90,
                    position: "insideLeft",
                    offset: 0,
                    fill: colors.charts.axis,
                    style: { fontSize: "0.8rem" },
                  }}
                  tickFormatter={(value) => `${formatNumber(value)}`}
                />
                <Tooltip
                  formatter={(value: number) => `$${formatNumber(value)}`}
                  contentStyle={{
                    backgroundColor: colors.charts.tooltipBg,
                    border: `1px solid ${colors.charts.tooltipBg}`,
                    borderRadius: radii.md,
                    padding: spacing.sm,
                    color: colors.charts.tooltipText,
                  }}
                  labelFormatter={(label) => `Date: ${formatDate(label)}`}
                />
                <Legend
                  wrapperStyle={{
                    color: colors.textPrimary,
                    marginTop: spacing.sm,
                  }}
                  iconType="circle"
                />
                <Line
                  type="monotone"
                  dataKey="unified_balance"
                  stroke={colors.charts.primary}
                  strokeWidth={2}
                  dot={false}
                  name="Total Value"
                />
              </LineChart>
            </ResponsiveContainer>
          </FlexWrapper>
          <FlexWrapper>
            <SubHeader>Daily Cash Flows</SubHeader>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={colors.charts.grid}
                />
                <XAxis
                  dataKey="date"
                  stroke={colors.charts.axis}
                  tickFormatter={(d) => formatDateDayMonth(d)}
                />
                <YAxis
                  stroke={colors.charts.axis}
                  tickFormatter={(v) => formatNumber(v)}
                />
                <Tooltip
                  formatter={(value: number) => formatNumber(value)}
                  contentStyle={{
                    backgroundColor: colors.charts.tooltipBg,
                    border: `1px solid ${colors.charts.tooltipBg}`,
                    borderRadius: radii.md,
                    padding: spacing.sm,
                    color: colors.charts.tooltipText,
                  }}
                />
                <Legend />
                <Bar
                  dataKey="inflow"
                  fill={colors.charts.profit}
                  name="Inflow"
                  stackId="flow"
                />
                <Bar
                  dataKey="outflow"
                  fill={colors.charts.loss}
                  name="Outflow"
                  stackId="flow"
                />
              </BarChart>
            </ResponsiveContainer>
          </FlexWrapper>

          <FlexWrapper>
            <SubHeader>Transactions</SubHeader>
            <div className="flex gap-4 mb-4 flex-wrap">
              <Input
                placeholder="Search description..."
                value={descriptionFilter}
                onChange={(e) => setDescriptionFilter(e.target.value)}
              />
              <select
                value={sourceBankFilter}
                onChange={(e) => setSourceBankFilter(e.target.value)}
                style={{
                  padding: "0.5rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  minWidth: "160px",
                }}
              >
                <option value="">All Banks</option>
                {availableBanks.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
            </div>

            <Table
              headers={[
                "Index",
                "Date",
                "Type",
                "Amount",
                "Balance",
                "Total Balance",
                "Description",
                "Bank",
              ]}
              scrollable
              minHeight="300px"
            >
              {filteredTransactions
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((tx, i) => (
                  <tr key={i}>
                    <td>{i}</td>
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
                    <td>{tx.description}</td>
                    <td>{tx.source_bank}</td>
                  </tr>
                ))}
            </Table>
          </FlexWrapper>
        </>
      )}
    </>
  );
};

export default Wallet;
