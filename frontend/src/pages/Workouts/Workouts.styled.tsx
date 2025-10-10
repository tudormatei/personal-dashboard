import styled from "@emotion/styled";
import { colors, radii, spacing, typography } from "../../constants/styling";

export const CalendarTimeline = styled.div`
  display: flex;
  gap: ${spacing.xl};
  overflow-x: auto;
  scroll-behavior: smooth;
  min-height: 300px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${colors.background};
    border-radius: ${radii.md};
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${colors.surfaceAlt};
    border-radius: ${radii.md};
    border: 2px solid ${colors.background};
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: ${colors.surfaceAlt};
    opacity: 0.8;
  }

  scrollbar-width: thin;
  scrollbar-color: ${colors.surfaceAlt} ${colors.background};
`;

export const MonthContainer = styled.div`
  min-width: 280px;
  display: flex;
  flex-direction: column;
`;

export const MonthLabel = styled.h3`
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.bold};
  text-align: center;
`;

export const WeekdayHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
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
