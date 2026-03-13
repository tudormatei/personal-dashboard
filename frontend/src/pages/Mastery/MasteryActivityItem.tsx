import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";

import {
  ActivityCard,
  CardTop,
  ActivityTitle,
  ActivityMeta,
  StreakPill,
  MainGrid,
  RingWrap,
  RingCenter,
  RingValue,
  RingSubtext,
  StatsPanel,
  StatsGrid,
  StatBox,
  StatLabel,
  StatValue,
  ProgressBlock,
  ProgressHeader,
  ProgressLabel,
  ProgressValue,
  ProgressBar,
  AddCustomHoursForm,
  NextMilestoneCard,
  MilestoneMeta,
  MilestoneBadge,
  CompletedMilestonesRow,
  CompletedMilestonesLabel,
  CompletedMilestonesCount,
  CompletedMilestonesChips,
  CompletedMilestoneChip,
  CompletedMilestoneMore,
} from "./Mastery.styled";
import { colors } from "../../constants/styling";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import type { operations } from "../../types/api-routes";

type MasteryActivityResponse =
  operations["get_mastery_activity_api_mastery__activity_id__get"]["responses"][200]["content"]["application/json"];

type Props = {
  activity: MasteryActivityResponse;
  quickAddValue: string;
  onQuickAddChange: (activityId: number, value: string) => void;
  onSubmitQuickAdd: (activityId: number) => void;
  onAddHours: (activityId: number, hours: number) => void;
};

const prettyHours = (hours: number) =>
  new Intl.NumberFormat().format(Math.round(hours * 10) / 10);

const MasteryActivityItem = ({
  activity,
  quickAddValue,
  onQuickAddChange,
  onSubmitQuickAdd,
  onAddHours,
}: Props) => {
  const pct = activity.stats.progress_pct / 100;
  const circumference = 2 * Math.PI * 54;
  const progress = pct * circumference;

  const reachedMilestones = activity.completed_milestones;
  const visibleReached = reachedMilestones.slice(-3);
  const extraReached = Math.max(
    0,
    reachedMilestones.length - visibleReached.length,
  );

  return (
    <ActivityCard
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <CardTop>
        <div>
          <ActivityTitle>{activity.name}</ActivityTitle>
          <ActivityMeta>
            <span>Current rank: {activity.current_level}</span>
            <span>
              {prettyHours(activity.total_hours)} /{" "}
              {prettyHours(activity.max_hours)}h
            </span>
          </ActivityMeta>
        </div>

        <StreakPill $active={activity.stats.streak_days > 0}>
          🔥{" "}
          {activity.stats.streak_days > 0
            ? `${activity.stats.streak_days} day streak`
            : "No streak yet"}
        </StreakPill>
      </CardTop>

      <MainGrid>
        <RingWrap>
          <svg width="132" height="132" viewBox="0 0 132 132">
            <defs>
              <linearGradient
                id={`mastery-ring-${activity.id}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor={colors.accent} />
                <stop offset="100%" stopColor={colors.warning} />
              </linearGradient>
            </defs>

            <circle
              cx="66"
              cy="66"
              r="54"
              stroke={colors.border}
              strokeWidth="10"
              fill="none"
            />

            <motion.circle
              cx="66"
              cy="66"
              r="54"
              stroke={`url(#mastery-ring-${activity.id})`}
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              transform="rotate(-90 66 66)"
              initial={false}
              animate={{
                strokeDasharray: `${progress} ${circumference}`,
              }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </svg>

          <RingCenter>
            <RingValue>{activity.stats.progress_pct}%</RingValue>
            <RingSubtext>mastery</RingSubtext>
          </RingCenter>
        </RingWrap>

        <StatsPanel>
          <StatsGrid>
            <StatBox>
              <StatLabel>Today</StatLabel>
              <StatValue>{prettyHours(activity.stats.today_hours)}h</StatValue>
            </StatBox>

            <StatBox>
              <StatLabel>Last 7 days</StatLabel>
              <StatValue>{prettyHours(activity.stats.weekly_hours)}h</StatValue>
            </StatBox>

            <StatBox>
              <StatLabel>Last 30 days</StatLabel>
              <StatValue>
                {prettyHours(activity.stats.monthly_hours)}h
              </StatValue>
            </StatBox>

            <StatBox>
              <StatLabel>Remaining</StatLabel>
              <StatValue>
                {prettyHours(activity.stats.remaining_hours)}h
              </StatValue>
            </StatBox>
          </StatsGrid>

          {activity.next_milestone ? (
            <NextMilestoneCard>
              <div>
                <MilestoneBadge>{activity.next_milestone.label}</MilestoneBadge>
                <MilestoneMeta>
                  {prettyHours(activity.next_milestone.distance_hours)}h until
                  next milestone
                </MilestoneMeta>
              </div>

              <ProgressBlock>
                <ProgressHeader>
                  <ProgressLabel>Milestone progress</ProgressLabel>
                  <ProgressValue>
                    {activity.next_milestone.progress_pct}%
                  </ProgressValue>
                </ProgressHeader>
                <ProgressBar>
                  <motion.div
                    initial={false}
                    animate={{
                      width: `${activity.next_milestone.progress_pct}%`,
                    }}
                    transition={{ duration: 0.6 }}
                  />
                </ProgressBar>
              </ProgressBlock>
            </NextMilestoneCard>
          ) : (
            <NextMilestoneCard>
              <div>
                <MilestoneBadge>Master reached</MilestoneBadge>
                <MilestoneMeta>
                  You hit the final milestone for this activity.
                </MilestoneMeta>
              </div>
            </NextMilestoneCard>
          )}
        </StatsPanel>
      </MainGrid>

      {reachedMilestones.length > 0 && (
        <CompletedMilestonesRow>
          <CompletedMilestonesLabel>
            <FiCheck size={14} />
            <span>Completed</span>
            <CompletedMilestonesCount>
              {reachedMilestones.length}
            </CompletedMilestonesCount>
          </CompletedMilestonesLabel>

          <CompletedMilestonesChips>
            {visibleReached.map((milestone) => (
              <CompletedMilestoneChip key={milestone.hours}>
                {milestone.label}
              </CompletedMilestoneChip>
            ))}

            {extraReached > 0 && (
              <CompletedMilestoneMore>
                +{extraReached} more
              </CompletedMilestoneMore>
            )}
          </CompletedMilestonesChips>
        </CompletedMilestonesRow>
      )}

      <AddCustomHoursForm>
        <Input
          type="number"
          min="0"
          step="0.5"
          placeholder="Custom hours"
          value={quickAddValue}
          onChange={(e) => onQuickAddChange(activity.id, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSubmitQuickAdd(activity.id);
            }
          }}
        />

        <Button
          variant="secondary"
          onClick={() => onAddHours(activity.id, 0.5)}
        >
          +0.5h
        </Button>
        <Button variant="secondary" onClick={() => onAddHours(activity.id, 1)}>
          +1h
        </Button>
        <Button variant="secondary" onClick={() => onAddHours(activity.id, 2)}>
          +2h
        </Button>
        <Button variant="secondary" onClick={() => onAddHours(activity.id, 5)}>
          +5h
        </Button>

        <Button onClick={() => onSubmitQuickAdd(activity.id)}>Log time</Button>
      </AddCustomHoursForm>
    </ActivityCard>
  );
};

export default MasteryActivityItem;
