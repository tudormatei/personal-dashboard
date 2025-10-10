import styled from "@emotion/styled";
import {
  colors,
  spacing,
  radii,
  shadows,
  transitions,
} from "../../constants/styling";

type StyledButtonProps = {
  disabled?: boolean;
  variant: "primary" | "secondary";
};

export const StyledButton = styled.button<StyledButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${spacing.sm};
  padding: ${spacing.sm} ${spacing.xl};
  font-weight: 600;
  border-radius: ${radii.full};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: ${transitions.base};
  backdrop-filter: blur(12px);
  text-align: center;
  border: 1px solid
    ${({ variant }) => (variant === "primary" ? colors.border : colors.accent)};

  background: ${({ variant, disabled }) => {
    if (disabled) return colors.surfaceAlt;
    return variant === "primary" ? colors.accent : "transparent";
  }};

  color: ${({ variant, disabled }) => {
    if (disabled) return colors.textMuted;
    return variant === "primary" ? colors.textPrimary : colors.textPrimary;
  }};

  &:hover {
    background: ${({ variant, disabled }) => {
      if (disabled) return colors.surface;
      return variant === "primary" ? colors.accent : colors.accent + "20";
    }};
    box-shadow: ${({ disabled }) => (disabled ? shadows.none : shadows.soft)};
    transform: ${({ disabled }) => (disabled ? "none" : "scale(1.05)")};
  }

  &:active {
    transform: ${({ disabled }) => (disabled ? "none" : "scale(0.97)")};
  }

  &:focus {
    outline: none;
  }
`;

export const SpinnerWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledSpinner = styled.span`
  width: 16px;
  height: 16px;
  border: 3px solid ${colors.textMuted};
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const TextWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;
