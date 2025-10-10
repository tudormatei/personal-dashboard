import styled from "@emotion/styled";
import {
  colors,
  radii,
  shadows,
  spacing,
  typography,
} from "../../constants/styling";

export const StyledInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const StyledInput = styled.input<{
  minWidth?: number;
  maxWidth?: number;
}>`
  flex: 1;
  width: 100%;
  padding: ${spacing.sm} ${spacing.md};
  font-family: ${typography.fontFamily};
  font-size: ${typography.fontSize.base};
  min-width: ${({ minWidth }) => (minWidth ? `${minWidth}px` : undefined)};
  max-width: ${({ maxWidth }) => (maxWidth ? `${maxWidth}px` : undefined)};
  border: 1px solid ${colors.border};
  border-radius: ${radii.md};
  transition: border 0.3s, box-shadow 0.3s;
  background-color: ${colors.surfaceAlt};
  color: ${colors.textPrimary};

  &:focus {
    border-color: ${colors.accent};
    box-shadow: 0 0 4px ${shadows.soft};
    outline: none;
  }

  &:disabled {
    background-color: ${colors.surface};
    color: ${colors.textMuted};
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${colors.textMuted};
    opacity: 1;
  }

  &:not(:disabled):hover {
    border-color: ${colors.accent};
  }

  &[type="date"] {
    font-size: ${typography.fontSize.sm};
    min-width: 140px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &::-webkit-calendar-picker-indicator {
      filter: invert(1);
      cursor: pointer;
      opacity: 0.8;
      transition: opacity 0.2s ease;
    }
    &::-webkit-calendar-picker-indicator:hover {
      opacity: 1;
    }
  }
`;
