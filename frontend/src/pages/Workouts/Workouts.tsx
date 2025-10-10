import { useState } from "react";
import FilterBar from "../../components/FilterBar/FilterBar";
import Loader from "../../components/Loader/Loader";
import Alert from "../../components/Alert/Alert";
import Card from "../../components/Card/Card";
import {
  CalendarDay,
  CalendarTimeline,
  MonthContainer,
  CalendarGrid,
  MonthLabel,
  WeekdayHeader,
} from "./Workouts.styled";
import { colors, radii, spacing } from "../../constants/styling";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { AlertData } from "../../types/types";
import type { operations } from "../../types/api-routes";
import { H2, SubHeader } from "../../components/Typography/Headings";
import { DashboardGrid, FlexWrapper } from "../../components/Layout/Layout";

type WorkoutStats =
  operations["workout_history_api_health_workouts_get"]["responses"][200]["content"]["application/json"];

const groupByMonth = (dailyStats: { date: string; duration: number }[]) => {
  return dailyStats.reduce((acc, stat) => {
    const date = new Date(stat.date);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(stat);
    return acc;
  }, {} as Record<string, { date: string; duration: number }[]>);
};

const generateCalendarRange = (
  dailyStats: { date: string; duration: number }[]
) => {
  if (!dailyStats.length) return [];

  const firstDate = new Date(dailyStats[0].date);
  const lastDate = new Date(dailyStats[dailyStats.length - 1].date);

  const calendar: {
    date?: Date;
    hasWorkout?: boolean;
    duration?: number;
    isPlaceholder?: boolean;
  }[] = [];
  const workouts = new Map(
    dailyStats.map((d) => [new Date(d.date).toDateString(), d.duration])
  );

  const current = new Date(firstDate);

  const dayOfWeek = current.getDay();
  const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  for (let i = 0; i < offset; i++) {
    calendar.push({
      isPlaceholder: true,
    });
  }

  while (current <= lastDate) {
    const duration = workouts.get(current.toDateString());
    calendar.push({
      date: new Date(current),
      hasWorkout: !!duration,
      duration,
    });
    current.setDate(current.getDate() + 1);
  }

  return calendar;
};

const Workouts = () => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertData | null>(null);

  const [data, setData] = useState<WorkoutStats | null>(null);

  const fetchData = async (startDate: string, endDate: string) => {
    setLoading(true);
    setAlert(null);
    setData(null);

    try {
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      });
      const url = `/api/health/workouts?${params.toString()}`;
      const res = await fetch(url);
      const json = (await res.json()) as WorkoutStats;
      setData(json);
    } catch {
      setAlert({ text: "Something went wrong", type: "error" });
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const weekdayData = Object.entries(data?.sessions_per_weekday ?? {}).map(
    ([day, count]) => ({ day, count })
  );

  const monthlyStats = groupByMonth(data?.daily_stats ?? []);

  return (
    <>
      <H2>Workout Dashboard</H2>

      <FilterBar onFilter={fetchData} />

      {loading && <Loader text="Loading workouts data..." />}
      {alert && <Alert {...alert} />}

      {data && (
        <>
          <DashboardGrid>
            <Card title="Total Sessions" value={data.total_sessions} />
            <Card
              title="Total Duration (min)"
              value={data.total_duration_min}
            />
            <Card
              title="Avg Duration (min)"
              value={data.avg_session_duration_min}
            />
            <Card
              title="Longest Session (min)"
              value={data.longest_session_min}
            />
            <Card
              title="Longest Streak (days)"
              value={data.longest_streak_days}
            />
          </DashboardGrid>

          <CalendarTimeline>
            {Object.entries(monthlyStats).map(([monthKey, monthStats]) => {
              const firstDate = new Date(monthStats[0].date);
              const monthLabel = firstDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              });

              const calendar = generateCalendarRange(monthStats);

              return (
                <MonthContainer key={monthKey}>
                  <MonthLabel>{monthLabel}</MonthLabel>
                  <WeekdayHeader>
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (d) => (
                        <div key={d}>{d}</div>
                      )
                    )}
                  </WeekdayHeader>
                  <CalendarGrid>
                    {calendar.map((d, i) =>
                      d.isPlaceholder ? (
                        <CalendarDay
                          key={i}
                          hasWorkout={false}
                          style={{ visibility: "hidden" }}
                        >
                          &nbsp;
                        </CalendarDay>
                      ) : (
                        <CalendarDay
                          key={i}
                          hasWorkout={d.hasWorkout}
                          title={
                            d.hasWorkout
                              ? `${d.date!.toDateString()} - ${d.duration} min`
                              : undefined
                          }
                        >
                          {d.date!.getDate()}
                        </CalendarDay>
                      )
                    )}
                  </CalendarGrid>
                </MonthContainer>
              );
            })}
          </CalendarTimeline>

          <FlexWrapper>
            <SubHeader>Sessions by Weekday</SubHeader>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weekdayData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={colors.charts.grid}
                />
                <XAxis dataKey="day" stroke={colors.charts.axis} />
                <YAxis
                  stroke={colors.charts.axis}
                  label={{
                    value: "No. Sessions",
                    angle: -90,
                    position: "insideLeft",
                    offset: 0,
                    fill: colors.charts.axis,
                    style: { fontSize: "0.8rem" },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: colors.charts.tooltipBg,
                    border: `1px solid ${colors.charts.tooltipBg}`,
                    borderRadius: radii.md,
                    padding: spacing.sm,
                    color: colors.charts.tooltipText,
                  }}
                />
                <Bar dataKey="count" fill={colors.accent} name="Sessions" />
              </BarChart>
            </ResponsiveContainer>
          </FlexWrapper>

          <FlexWrapper>
            {Object.keys(data.sessions_per_week || {}).length >= 2 && (
              <>
                <SubHeader>Sessions per Week</SubHeader>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart
                    data={Object.entries(data.sessions_per_week).map(
                      ([week, count]) => ({ week, count })
                    )}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={colors.charts.grid}
                    />
                    <XAxis dataKey="week" stroke={colors.charts.axis} />
                    <YAxis
                      stroke={colors.charts.axis}
                      label={{
                        value: "No. Sessions",
                        angle: -90,
                        position: "insideLeft",
                        offset: 0,
                        fill: colors.charts.axis,
                        style: { fontSize: "0.8rem" },
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: colors.charts.tooltipBg,
                        border: `1px solid ${colors.charts.tooltipBg}`,
                        borderRadius: radii.md,
                        padding: spacing.sm,
                        color: colors.charts.tooltipText,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke={colors.accent}
                      strokeWidth={2}
                      name="Sessions"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </>
            )}
          </FlexWrapper>

          <FlexWrapper>
            {Object.keys(data.sessions_per_month || {}).length >= 2 && (
              <>
                <SubHeader>Sessions per Month</SubHeader>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart
                    data={Object.entries(data.sessions_per_month).map(
                      ([month, count]) => ({ month, count })
                    )}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={colors.charts.grid}
                    />
                    <XAxis dataKey="month" stroke={colors.charts.axis} />
                    <YAxis
                      stroke={colors.charts.axis}
                      label={{
                        value: "No. Sessions",
                        angle: -90,
                        position: "insideLeft",
                        offset: 0,
                        fill: colors.charts.axis,
                        style: { fontSize: "0.8rem" },
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: colors.charts.tooltipBg,
                        border: `1px solid ${colors.charts.tooltipBg}`,
                        borderRadius: radii.md,
                        padding: spacing.sm,
                        color: colors.charts.tooltipText,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke={colors.accent}
                      strokeWidth={2}
                      name="Sessions"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </>
            )}
          </FlexWrapper>
        </>
      )}
    </>
  );
};

export default Workouts;
