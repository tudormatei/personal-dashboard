import { colors, radii, spacing, typography } from "../../constants/styling";
import { formatDate, formatNumber } from "../../utils/utils";
import type { DailyFundSummary } from "./Investments";

type CashFlowTooltipProps = {
  active?: boolean;
  payload?: Array<{
    payload: DailyFundSummary;
    value: number;
    name: string;
  }>;
  label?: string;
};

const CashFlowTooltip = ({ active, payload, label }: CashFlowTooltipProps) => {
  if (!active || !payload?.length) return null;

  const dayData = payload[0]?.payload as DailyFundSummary | undefined;
  if (!dayData) return null;

  return (
    <div
      style={{
        backgroundColor: colors.surfaceAlt,
        border: `1px solid ${colors.border}`,
        borderRadius: radii.md,
        padding: spacing.md,
        color: colors.textPrimary,
        minWidth: 240,
        maxWidth: 320,
        fontFamily: typography.fontFamily,
      }}
    >
      <div
        style={{
          fontWeight: typography.fontWeight.bold,
          fontSize: typography.fontSize.sm,
          marginBottom: spacing.sm,
          color: colors.textMuted,
        }}
      >
        {formatDate(label as string)}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: spacing.xs,
          fontSize: typography.fontSize.sm,
        }}
      >
        <span style={{ color: colors.textMuted }}>Inflow</span>
        <span style={{ color: colors.charts.profit, fontWeight: 500 }}>
          +${formatNumber(dayData.inflow)}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: spacing.sm,
          fontSize: typography.fontSize.sm,
        }}
      >
        <span style={{ color: colors.textMuted }}>Outflow</span>
        <span style={{ color: colors.charts.loss, fontWeight: 500 }}>
          -${formatNumber(dayData.outflow)}
        </span>
      </div>

      {!!dayData.activities?.length && (
        <div
          style={{
            borderTop: `1px solid ${colors.border}`,
            margin: `${spacing.sm} 0`,
          }}
        />
      )}

      {!!dayData.activities?.length && (
        <div
          style={{ display: "flex", flexDirection: "column", gap: spacing.xs }}
        >
          <div
            style={{
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeight.medium,
              color: colors.textMuted,
              marginBottom: spacing.xs,
            }}
          >
            Activities
          </div>

          {dayData.activities.slice(0, 5).map((activity) => {
            const positive = activity.total >= 0;

            return (
              <div
                key={`${activity.activityCode}-${activity.activityDescription}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                }}
              >
                <div
                  style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    color: colors.textPrimary,
                  }}
                >
                  {activity.activityDescription}
                </div>

                <div
                  style={{
                    fontSize: typography.fontSize.xs,
                    color: colors.textMuted,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>
                    {activity.activityCode} • {activity.count} item
                    {activity.count > 1 ? "s" : ""}
                  </span>

                  <span
                    style={{
                      color: positive
                        ? colors.charts.profit
                        : colors.charts.loss,
                      fontWeight: typography.fontWeight.medium,
                    }}
                  >
                    {positive ? "+" : "-"}$
                    {formatNumber(Math.abs(activity.total))}
                  </span>
                </div>
              </div>
            );
          })}

          {dayData.activities.length > 5 && (
            <div
              style={{
                fontSize: typography.fontSize.xs,
                color: colors.textMuted,
                marginTop: spacing.xs,
              }}
            >
              +{dayData.activities.length - 5} more activities
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CashFlowTooltip;
