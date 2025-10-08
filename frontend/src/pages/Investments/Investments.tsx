import { useState, type JSX } from "react";
import FilterBar from "../../components/FilterBar/FilterBar";
import Loader from "../../components/Loader/Loader";
import Alert from "../../components/Alert/Alert";
import Card from "../../components/Card/Card";
import Table from "../../components/Table/Table";
import {
  Header,
  DashboardGrid,
  InfoContainer,
  PositionsContainer,
  CashContainer,
} from "./Investments.styled";

import {
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  XAxis,
  BarChart,
  YAxis,
  Bar,
  Cell,
  Line,
  LineChart,
  CartesianGrid,
} from "recharts";
import type { InvestmentsData } from "../../types/types";
import { colors, radii, spacing } from "../../constants/styling";
import {
  formatDate,
  formatDateDayMonth,
  formatDateReadable,
  formatNumber,
} from "../../utils/utils";
import MonteCarloSimulation from "./MonteCarloSimulation";

type Fund = {
  date: string;
  amount: number;
};

type DailyFundSummary = {
  date: string;
  inflow: number;
  outflow: number;
};

const Investments = (): JSX.Element => {
  const [data, setData] = useState<InvestmentsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pieData = data?.openPositions.map((pos) => ({
    name: pos.symbol,
    value: pos.percentOfNAV,
  }));

  const fetchInvestments = async (startDate: string, endDate: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      });
      const response = await fetch(`/api/investments?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch data");
      const json = await response.json();
      setData(json);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fundsData: DailyFundSummary[] = data?.statementFunds
    ? Object.values(
        data.statementFunds.reduce<Record<string, DailyFundSummary>>(
          (acc, fund: Fund) => {
            const amountInBase = fund.amount;

            if (Math.abs(amountInBase) < 10) return acc;

            if (!acc[fund.date]) {
              acc[fund.date] = { date: fund.date, inflow: 0, outflow: 0 };
            }

            if (amountInBase >= 0) {
              acc[fund.date].inflow += amountInBase;
            } else {
              acc[fund.date].outflow += Math.abs(amountInBase);
            }

            return acc;
          },
          {}
        )
      )
    : [];

  const latestValue = data?.valueOverTime.at(-1)?.total ?? 0;
  const startValue = data?.valueOverTime.at(0)?.total ?? 0;
  const totalPL = data?.openPositions.reduce(
    (acc, pos) => acc + (pos.positionValue - pos.costBasisMoney),
    0
  );

  return (
    <>
      <Header>Investment Dashboard</Header>
      <FilterBar onFilter={fetchInvestments} runOnMount={false} />
      {loading && <Loader text="Loading investment data..." />}
      {error && <Alert text={error} type="error" />}

      {data && (
        <>
          <PositionsContainer>
            <InfoContainer width="65%">
              <h2>Open Positions</h2>
              <Table
                headers={[
                  "Symbol",
                  "Description",
                  "Currency",
                  "Qty",
                  "Mark Price",
                  "Value",
                  "Cost Basis",
                  "P/L",
                  "% of NAV",
                ]}
                minHeight="300px"
              >
                {data.openPositions.map((pos, i) => {
                  const pl = pos.positionValue - pos.costBasisMoney;
                  return (
                    <tr key={i}>
                      <td>{pos.symbol}</td>
                      <td>{pos.description}</td>
                      <td>{pos.currency}</td>
                      <td>{pos.position}</td>
                      <td>{pos.markPrice}</td>
                      <td>{pos.positionValue}</td>
                      <td>{pos.costBasisMoney}</td>
                      <td
                        style={{
                          color:
                            pl >= 0 ? colors.charts.profit : colors.charts.loss,
                        }}
                      >
                        {pl.toFixed(2)}
                      </td>
                      <td>{pos.percentOfNAV}%</td>
                    </tr>
                  );
                })}
              </Table>
            </InfoContainer>

            <InfoContainer width="35%">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    innerRadius={60}
                    labelLine={false}
                    stroke="none"
                  >
                    {pieData?.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          colors.charts.pie[index % colors.charts.pie.length]
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
                    formatter={(value: number, name: string) => [
                      <span style={{ color: colors.charts.tooltipText }}>
                        {value}%
                      </span>,
                      <span style={{ color: colors.charts.tooltipText }}>
                        {name}
                      </span>,
                    ]}
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
            </InfoContainer>
          </PositionsContainer>

          <InfoContainer>
            <h2>Current Stats</h2>
            <DashboardGrid>
              <Card
                title="Total P/L"
                value={`${formatNumber(totalPL)} ${data.account.currency}`}
              />
              <Card
                title="Total Value"
                value={`${formatNumber(latestValue)} ${data.account.currency}`}
              />
              {totalPL && latestValue && (
                <Card
                  title="Total % Return"
                  value={`${formatNumber(
                    (totalPL / (latestValue - totalPL)) * 100,
                    true
                  )}%`}
                />
              )}
              <Card
                title="Buying Power"
                value={`${data.cashReport.ending} ${data.account.currency}`}
              />
            </DashboardGrid>
          </InfoContainer>

          <InfoContainer>
            <h2>Period Stats</h2>
            <DashboardGrid>
              <Card
                title="Date Range"
                value={`${formatDateReadable(
                  data.fromDate
                )} → ${formatDateReadable(data.toDate)}`}
              />
              <Card
                title="Period % Growth"
                value={`${data.timeWeightedReturn.total}%`}
              />
              {latestValue && (
                <Card
                  title="Period Value Growth"
                  value={`${formatNumber(
                    latestValue -
                      (data.valueOverTime[0].total +
                        data.cashReport.deposits -
                        data.cashReport.withdrawals)
                  )} ${data.account.currency}`}
                />
              )}

              <Card
                title="Amount Deposited During Period"
                value={`${data.cashReport.deposits} ${data.account.currency}`}
              />
              <Card
                title="Amount Withdrew During Period"
                value={`${data.cashReport.withdrawals} ${data.account.currency}`}
              />
            </DashboardGrid>
          </InfoContainer>

          <InfoContainer width="100%">
            <h2>Portfolio Growth % Over Time</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data.timeWeightedReturn.series}>
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
                    value: "Growth (%)",
                    angle: -90,
                    position: "insideLeft",
                    offset: 0,
                    fill: colors.charts.axis,
                    style: { fontSize: "0.8rem" },
                  }}
                />
                <Tooltip
                  formatter={(value: number) => `${value}%`}
                  contentStyle={{
                    backgroundColor: colors.charts.tooltipBg,
                    border: `1px solid ${colors.charts.tooltipBg}`,
                    borderRadius: radii.md,
                    padding: spacing.sm,
                    color: colors.charts.tooltipText,
                  }}
                  labelFormatter={(label) => `Date: ${formatDate(label)}`}
                />
                <defs>
                  <linearGradient
                    id="lineGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    {(() => {
                      const series = data.timeWeightedReturn.series;
                      const min = Math.min(...series.map((d) => d.twr));
                      const max = Math.max(...series.map((d) => d.twr));
                      const zeroOffset =
                        max === min ? 50 : ((max - 0) / (max - min)) * 100;

                      return (
                        <>
                          <stop offset="0%" stopColor={colors.charts.profit} />
                          <stop
                            offset={`${zeroOffset}%`}
                            stopColor={colors.charts.profit}
                          />
                          <stop
                            offset={`${zeroOffset}%`}
                            stopColor={colors.charts.loss}
                          />
                          <stop offset="100%" stopColor={colors.charts.loss} />
                        </>
                      );
                    })()}
                  </linearGradient>
                </defs>

                <Line
                  type="monotone"
                  dataKey="twr"
                  stroke="url(#lineGradient)"
                  strokeWidth={2}
                  dot={false}
                  name="Growth"
                />
              </LineChart>
            </ResponsiveContainer>
          </InfoContainer>

          <InfoContainer width="100%">
            <h2>Portfolio Value Over Time</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data.valueOverTime}>
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
                    value: "Value ($)",
                    angle: -90,
                    position: "insideLeft",
                    offset: 0,
                    fill: colors.charts.axis,
                    style: { fontSize: "0.8rem" },
                  }}
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
                  dataKey="total"
                  stroke={colors.charts.primary}
                  strokeWidth={2}
                  dot={false}
                  name="Total Value"
                />
                <Line
                  type="monotone"
                  dataKey="cash"
                  stroke={colors.charts.secondary}
                  strokeWidth={2}
                  dot={false}
                  name="Cash"
                />
              </LineChart>
            </ResponsiveContainer>
          </InfoContainer>

          {data && (
            <>
              <MonteCarloSimulation
                startValue={startValue}
                twrSeries={data.timeWeightedReturn.series}
              />
            </>
          )}

          <CashContainer>
            <InfoContainer width="35%">
              <h2>Cash Transactions</h2>
              <Table
                headers={["Date", "Type", "Amount", "FX Rate"]}
                scrollable
                minHeight="300px"
              >
                {data.cashTransactions
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .map((t, i) => (
                    <tr key={i}>
                      <td>{formatDate(t.date)}</td>
                      <td>{t.type}</td>
                      <td
                        style={{
                          color:
                            t.amount >= 0
                              ? colors.charts.profit
                              : colors.charts.loss,
                        }}
                      >
                        {t.amount}
                      </td>
                      <td>{t.fxRateToBase}</td>
                    </tr>
                  ))}
              </Table>
            </InfoContainer>

            <InfoContainer width="65%">
              <h2>Trades</h2>
              <Table
                headers={[
                  "Date",
                  "Side",
                  "Symbol",
                  "Quantity",
                  "Trade Price",
                  "Commission",
                  "Net Value",
                ]}
                scrollable
              >
                {data.trades
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .map((trade, i) => (
                    <tr key={i}>
                      <td>{formatDate(trade.date)}</td>
                      <td
                        style={{
                          color:
                            trade.buySell === "BUY"
                              ? colors.charts.profit
                              : colors.charts.loss,
                        }}
                      >
                        {trade.buySell}
                      </td>
                      <td>{trade.symbol}</td>
                      <td>{trade.quantity}</td>
                      <td>{trade.tradePrice}</td>
                      <td>{trade.ibCommission}</td>
                      <td>{trade.netCash}</td>
                    </tr>
                  ))}
              </Table>
            </InfoContainer>
          </CashContainer>
          <InfoContainer width="100%">
            <h2>Daily Cash Flows</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={fundsData}>
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
                    value: "Value ($)",
                    angle: -90,
                    position: "insideLeft",
                    offset: 0,
                    fill: colors.charts.axis,
                    style: { fontSize: "0.8rem" },
                  }}
                />
                <Tooltip
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                  contentStyle={{
                    backgroundColor: colors.charts.tooltipBg,
                    border: `1px solid ${colors.charts.tooltipBg}`,
                    borderRadius: radii.md,
                    padding: spacing.sm,
                    color: colors.charts.tooltipText,
                  }}
                  labelFormatter={(label) => `Date: ${formatDate(label)}`}
                />
                <Legend iconType="circle" />
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
          </InfoContainer>
        </>
      )}
    </>
  );
};

export default Investments;
