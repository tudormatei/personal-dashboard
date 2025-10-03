import styled from "@emotion/styled";
import {
  colors,
  spacing,
  radii,
  shadows,
  typography,
  transitions,
} from "../../constants/styling";

type AlertContainerProps = {
  type?: "error" | "info" | "success" | "warning";
};

const alertStyles = {
  error: {
    bg: `rgba(${parseInt(colors.error.slice(1, 3), 16)}, ${parseInt(
      colors.error.slice(3, 5),
      16
    )}, ${parseInt(colors.error.slice(5, 7), 16)}, 0.15)`,
    border: colors.error,
    text: colors.error,
    glow: `0 0 8px ${colors.error}`,
  },
  success: {
    bg: `rgba(${parseInt(colors.success.slice(1, 3), 16)}, ${parseInt(
      colors.success.slice(3, 5),
      16
    )}, ${parseInt(colors.success.slice(5, 7), 16)}, 0.15)`,
    border: colors.success,
    text: colors.success,
    glow: `0 0 8px ${colors.success}`,
  },
  info: {
    bg: `rgba(${parseInt(colors.info.slice(1, 3), 16)}, ${parseInt(
      colors.info.slice(3, 5),
      16
    )}, ${parseInt(colors.info.slice(5, 7), 16)}, 0.15)`,
    border: colors.info,
    text: colors.info,
    glow: `0 0 8px ${colors.info}`,
  },
  warning: {
    bg: `rgba(${parseInt(colors.warning.slice(1, 3), 16)}, ${parseInt(
      colors.warning.slice(3, 5),
      16
    )}, ${parseInt(colors.warning.slice(5, 7), 16)}, 0.15)`,
    border: colors.warning,
    text: colors.warning,
    glow: `0 0 8px ${colors.warning}`,
  },
};

export const AlertContainer = styled.div<AlertContainerProps>`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  padding: ${spacing.md} ${spacing.lg};
  border-radius: ${radii.md};
  backdrop-filter: blur(12px);
  box-shadow: ${({ type }) => (type ? alertStyles[type].glow : shadows.soft)};
  background: ${({ type }) =>
    type ? alertStyles[type].bg : alertStyles.info.bg};
  border: 1px solid
    ${({ type }) => (type ? alertStyles[type].border : alertStyles.info.border)};
  color: ${({ type }) =>
    type ? alertStyles[type].text : alertStyles.info.text};
  font-weight: ${typography.fontWeight.medium};
  font-size: ${typography.fontSize.sm};
  transition: ${transitions.base};
`;
