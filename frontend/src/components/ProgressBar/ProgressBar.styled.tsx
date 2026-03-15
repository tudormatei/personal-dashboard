import styled from "@emotion/styled";
import { colors, radii, typography, spacing } from "../../constants/styling";

export const Container = styled.div`
  padding-right: ${spacing.lg};
  padding-left: ${spacing.lg};
  padding-bottom: ${spacing.xl};
`;

export const BarWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 1rem;
  border-radius: ${radii.md};
  background-color: ${colors.surfaceAlt};
  overflow: visible;
`;

type BarFillProps = {
  progress: number;
};

export const BarFill = styled.div<BarFillProps>`
  width: ${(props) => Math.min(100, Math.max(0, props.progress))}%;
  height: 100%;
  background-color: ${colors.accent};
  border-radius: ${radii.md};
  transition: width 0.3s ease-in-out;
`;

export const TickLabel = styled.div<{ left: number }>`
  position: absolute;
  left: ${(props) => props.left}%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  white-space: nowrap;
  color: ${colors.textMuted};
  font-size: ${typography.fontSize.sm};

  span.tick {
    width: 2px;
    height: 0.5rem;
    background-color: ${colors.textMuted};
    margin-bottom: 0.25rem;
  }
`;
