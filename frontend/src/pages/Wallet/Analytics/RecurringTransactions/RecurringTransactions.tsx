import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { components, operations } from "../../../../types/api-routes";
import {
  CategoryCard,
  CategoryHeader,
  ChartContainer,
  ExpandButton,
  TransactionAmount,
  TransactionInfo,
  TransactionItem,
  TransactionItemContainer,
  TransactionMeta,
  TransactionRow,
  TransactionTitle,
} from "./RecurringTransactions.styled";
import { useState } from "react";
import { AnalyiticsTitle } from "../Analytics.styled";
import { formatDate, formatDateDayMonth } from "../../../../utils/utils";
import { FlexWrapper } from "../../../../components/Layout/Layout";
import { chartStyles } from "../../../../constants/styling";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

type RecurringResponse =
  operations["get_recurring_transactions_api_bank_recurring_get"]["responses"][200]["content"]["application/json"];

type RecurringTransactionsProps = {
  recurring: RecurringResponse;
};

const RecurringTransactions: React.FC<RecurringTransactionsProps> = ({
  recurring,
}) => {
  return (
    <>
      {recurring && (
        <>
          <AnalyiticsTitle>Recurring Transactions</AnalyiticsTitle>
          <FlexWrapper>
            {recurring && recurring.recurring.length > 0 ? (
              recurring.recurring.map((r) => (
                <Category key={r.category || "uncategorized"} category={r} />
              ))
            ) : (
              <div>No recurring transactions</div>
            )}
          </FlexWrapper>
        </>
      )}
    </>
  );
};

export default RecurringTransactions;

type RecurringCategoryGroup =
  components["schemas"]["RecurringCategoryGroup-Output"];

type CategoryProps = {
  category: RecurringCategoryGroup;
};

const Category: React.FC<CategoryProps> = ({ category }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <CategoryCard>
      <CategoryHeader
        onClick={() => setExpanded(!expanded)}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>{category.category || "Uncategorized"}</span>
        {expanded ? <FiChevronUp /> : <FiChevronDown />}
      </CategoryHeader>
      <TransactionItemContainer isActive={expanded}>
        {expanded &&
          category.transactions.map((t) => (
            <Transaction key={t.description} transaction={t} />
          ))}
      </TransactionItemContainer>
    </CategoryCard>
  );
};

type RecurringTransactionPoint =
  components["schemas"]["RecurringTransactionPoint"];

type OccurenceChartProps = {
  occurrences: RecurringTransactionPoint[];
};

const OccurrenceChart: React.FC<OccurenceChartProps> = ({ occurrences }) => (
  <ChartContainer>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={occurrences}>
        <CartesianGrid
          stroke={chartStyles.grid.stroke}
          strokeDasharray={chartStyles.grid.strokeDasharray}
        />

        <XAxis
          dataKey="date"
          stroke={chartStyles.axis.stroke}
          tickFormatter={(d) => formatDateDayMonth(d)}
          tick={{ fill: chartStyles.axis.stroke, fontSize: 12 }}
        />

        <YAxis
          stroke={chartStyles.axis.stroke}
          tick={{ fill: chartStyles.axis.stroke, fontSize: 12 }}
        />

        <Tooltip
          contentStyle={{
            backgroundColor: chartStyles.tooltip.backgroundColor,
            border: chartStyles.tooltip.border,
            borderRadius: chartStyles.tooltip.borderRadius,
            padding: chartStyles.tooltip.padding,
            color: chartStyles.tooltip.color,
          }}
          labelFormatter={(label) => `Date: ${formatDate(label)}`}
        />

        <Line
          type="monotone"
          dataKey="amount"
          name="Amount"
          stroke={chartStyles.line.stroke}
          strokeWidth={chartStyles.line.strokeWidth}
          dot={true}
        />
      </LineChart>
    </ResponsiveContainer>
  </ChartContainer>
);

type RecurringTransaction = components["schemas"]["RecurringTransaction"];

type TransactionProps = {
  transaction: RecurringTransaction;
};

const Transaction: React.FC<TransactionProps> = ({ transaction }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <TransactionItem>
      <TransactionRow>
        <TransactionInfo>
          <TransactionTitle title={transaction.description}>
            {transaction.description}
          </TransactionTitle>
          <TransactionMeta>
            {transaction.frequency || "—"} • {transaction.occurrences.length}{" "}
            occurrences
          </TransactionMeta>
        </TransactionInfo>
        <TransactionAmount profit={transaction.avg_amount > 0}>
          {transaction.avg_amount}
        </TransactionAmount>
      </TransactionRow>

      <ExpandButton onClick={() => setExpanded(!expanded)}>
        {expanded ? "Hide details" : "Show details"}
      </ExpandButton>

      {expanded && <OccurrenceChart occurrences={transaction.occurrences} />}
    </TransactionItem>
  );
};
