import styled from "@emotion/styled";
import { colors, radii, spacing, typography } from "../../constants/styling";

export const Header = styled.h1`
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.bold};
  margin-bottom: ${spacing.lg};
`;

export const DashboardGrid = styled.div`
  margin-top: ${spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${spacing.lg};
`;

export const CalendarTimeline = styled.div`
  display: flex;
  gap: ${spacing.xl};
  overflow-x: auto;
  margin-top: ${spacing.lg};
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${colors.accent};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background: ${colors.surfaceAlt};
  }
`;

export const MonthContainer = styled.div`
  min-width: 280px;
  display: flex;
  flex-direction: column;
  margin-bottom: ${spacing.md};
`;

export const MonthLabel = styled.h3`
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.bold};
  margin-bottom: ${spacing.sm};
  text-align: center;
`;

export const WeekdayHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: ${spacing.xs};
  text-align: center;
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.textMuted};
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${spacing.sm};
`;

export const CalendarDay = styled.div<{
  hasWorkout?: boolean;
}>`
  width: 100%;
  aspect-ratio: 1;
  background-color: ${({ hasWorkout }) =>
    hasWorkout ? colors.accent : colors.surfaceAlt};
  color: ${({ hasWorkout }) =>
    hasWorkout ? colors.textPrimary : colors.textMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.bold};
  border-radius: ${radii.md};
  cursor: ${({ hasWorkout }) => (hasWorkout ? "pointer" : "default")};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ hasWorkout }) =>
      hasWorkout ? colors.accent : colors.surface};
  }
`;
