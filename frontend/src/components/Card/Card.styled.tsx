import styled from "@emotion/styled";
import {
  colors,
  spacing,
  radii,
  shadows,
  typography,
  breakpoints,
} from "../../constants/styling";

export const CardContainer = styled.div`
  background: ${colors.surface};
  padding: ${spacing.md};
  border-radius: ${radii.lg};
  box-shadow: ${shadows.none};
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};

  ${breakpoints.phone} {
    gap: ${spacing.xs};
  }
`;

export const CardTitle = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.textMuted};

  ${breakpoints.phone} {
    font-size: (${typography.fontSize.xs});
  }
`;

export const CardValue = styled.div`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.bold};

  ${breakpoints.phone} {
    font-size: ${typography.fontSize.base};
  }
`;
