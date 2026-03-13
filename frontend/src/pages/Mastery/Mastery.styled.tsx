import styled from "@emotion/styled";
import { motion } from "framer-motion";
import {
  colors,
  spacing,
  radii,
  typography,
  breakpoints,
} from "../../constants/styling";

export const Stat = styled.span`
  background: rgba(255, 140, 0, 0.08);
  color: ${colors.textPrimary};
  border: 1px solid rgba(255, 140, 0, 0.18);
  padding: 0.65rem 0.9rem;
  border-radius: ${radii.full};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
`;

export const FormCard = styled.section`
  background-color: ${colors.surface};
  border-radius: ${radii.xl};
  padding: ${spacing.lg};
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: ${spacing.md};
  align-items: end;

  @media (max-width: ${breakpoints.laptop}) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
  min-width: 0;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
`;

export const EmptyState = styled(motion.div)`
  text-align: center;
  background: linear-gradient(180deg, ${colors.surface}, ${colors.surfaceAlt});
  border: 1px dashed ${colors.border};
  border-radius: ${radii.xl};
  padding: ${spacing.xxl};

  h3 {
    margin: 0 0 ${spacing.sm};
    font-size: ${typography.fontSize.xl};
  }

  p {
    margin: 0;
    color: ${colors.textMuted};
  }
`;

export const ActivityCard = styled(motion.article)`
  background: linear-gradient(
    180deg,
    rgba(17, 17, 17, 0.96),
    rgba(12, 12, 12, 0.98)
  );
  border-radius: ${radii.xl};
  padding: ${spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};

  @media (max-width: ${breakpoints.tablet}) {
    padding: ${spacing.md};
    gap: ${spacing.md};
  }
`;

export const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${spacing.md};

  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: column;
  }
`;

export const ActivityTitle = styled.h2`
  margin: 0;
  font-size: clamp(1.2rem, 2vw, 1.7rem);
  line-height: 1.1;
`;

export const ActivityMeta = styled.div`
  margin-top: ${spacing.xs};
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.sm};
  color: ${colors.textMuted};
  font-size: ${typography.fontSize.sm};

  span {
    position: relative;
  }
`;

export const CompletedMilestonesRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${spacing.sm};
  flex-wrap: wrap;
  padding-top: ${spacing.xs};
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

export const CompletedMilestonesLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: ${colors.textMuted};
  font-size: ${typography.fontSize.sm};
  white-space: nowrap;
`;

export const CompletedMilestonesCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 0.45rem;
  border-radius: ${radii.full};
  background: rgba(0, 255, 136, 0.1);
  color: ${colors.success};
  border: 1px solid rgba(0, 255, 136, 0.2);
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.bold};
`;

export const CompletedMilestonesChips = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  flex-wrap: wrap;
  min-width: 0;
`;

export const CompletedMilestoneChip = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.6rem;
  border-radius: ${radii.full};
  background: rgba(0, 255, 136, 0.08);
  color: ${colors.textPrimary};
  border: 1px solid rgba(0, 255, 136, 0.18);
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.medium};
  line-height: 1;
`;

export const CompletedMilestoneMore = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.6rem;
  border-radius: ${radii.full};
  background: rgba(255, 255, 255, 0.03);
  color: ${colors.textMuted};
  border: 1px solid ${colors.border};
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.medium};
  line-height: 1;
`;

export const StreakPill = styled.div<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.7rem 0.95rem;
  border-radius: ${radii.full};
  white-space: nowrap;
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.bold};
  background: ${({ $active }) =>
    $active ? "rgba(255, 140, 0, 0.14)" : "rgba(255,255,255,0.03)"};
  color: ${({ $active }) => ($active ? colors.warning : colors.textMuted)};
  border: 1px solid
    ${({ $active }) => ($active ? "rgba(255, 140, 0, 0.28)" : colors.border)};
`;

export const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 170px 1fr;
  gap: ${spacing.lg};
  align-items: stretch;

  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const RingWrap = styled.div`
  position: relative;
  width: 132px;
  height: 132px;
  margin: 0 auto;
`;

export const RingCenter = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const RingValue = styled.div`
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.black};
`;

export const RingSubtext = styled.div`
  color: ${colors.textMuted};
  font-size: ${typography.fontSize.xs};
  text-transform: uppercase;
  letter-spacing: 0.12em;
`;

export const StatsPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${spacing.sm};

  @media (max-width: ${breakpoints.laptop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

export const StatBox = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid ${colors.border};
  border-radius: ${radii.lg};
  padding: ${spacing.md};
`;

export const StatLabel = styled.div`
  color: ${colors.textMuted};
  font-size: ${typography.fontSize.xs};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.35rem;
`;

export const StatValue = styled.div`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.bold};
`;

export const ProgressBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
`;

export const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${spacing.sm};
  font-size: ${typography.fontSize.sm};
`;

export const ProgressLabel = styled.span`
  color: ${colors.textMuted};
`;

export const ProgressValue = styled.span`
  color: ${colors.textPrimary};
  font-weight: ${typography.fontWeight.bold};
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  overflow: hidden;
  background: #0b0b0b;
  border: 1px solid ${colors.border};
  border-radius: ${radii.full};

  > div {
    height: 100%;
    width: 0%;
    border-radius: inherit;
    background: linear-gradient(90deg, ${colors.accent}, #ffb347);
    box-shadow: 0 0 16px rgba(255, 140, 0, 0.4);
  }
`;

export const NextMilestoneCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  border: 1px solid rgba(255, 140, 0, 0.18);
  background: linear-gradient(
    180deg,
    rgba(255, 140, 0, 0.06),
    rgba(255, 140, 0, 0.02)
  );
  border-radius: ${radii.lg};
  padding: ${spacing.md};
`;

export const MilestoneBadge = styled.div`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  border-radius: ${radii.full};
  background: rgba(255, 140, 0, 0.14);
  color: ${colors.accent};
  border: 1px solid rgba(255, 140, 0, 0.25);
  padding: 0.45rem 0.8rem;
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.bold};
`;

export const MilestoneMeta = styled.div`
  margin-top: 0.55rem;
  color: ${colors.textMuted};
  font-size: ${typography.fontSize.sm};
`;

export const AddCustomHoursForm = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: ${spacing.sm};
`;
