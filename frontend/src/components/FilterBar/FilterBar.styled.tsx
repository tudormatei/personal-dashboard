import styled from "@emotion/styled";
import {
  colors,
  spacing,
  typography,
  radii,
  shadows,
} from "../../constants/styling";

export const FiltersWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${spacing.md};
  margin-bottom: ${spacing.lg};
  padding: ${spacing.md};
  background: ${colors.surfaceAlt};
  border: 1px solid ${colors.border};
  border-radius: ${radii.lg};

  label {
    font-size: ${typography.fontSize.sm};
    color: ${colors.textMuted};
    margin-right: ${spacing.xs};
  }

  input[type="date"] {
    background: ${colors.surfaceAlt};
    border: 1px solid ${colors.border};
    color: ${colors.textPrimary};
    padding: ${spacing.sm} ${spacing.md};
    border-radius: ${radii.md};
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

    &:focus {
      outline: none;
      border-color: ${colors.accent};
      box-shadow: 0 0 0 2px ${shadows.soft};
    }

    &::placeholder {
      color: ${colors.textMuted};
    }
  }
`;

export const QuickButtons = styled.div`
  display: flex;
  gap: ${spacing.sm};
  margin-left: auto;
`;
