import styled from "@emotion/styled";
import {
  colors,
  radii,
  spacing,
  transitions,
  typography,
} from "../../../../constants/styling";

export const CategoryCard = styled.div`
  padding: ${spacing.sm} ${spacing.md};
  border: 1px solid ${colors.border};
  border-radius: ${radii.md};
  background-color: ${colors.surfaceAlt};
  transition: ${transitions.base};

  &:hover {
    border-color: ${colors.accent};
    transform: translateY(-2px);
  }
`;

export const CategoryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CategoryName = styled.div`
  font-weight: ${typography.fontWeight.bold};
  font-family: ${typography.fontFamily};
  color: ${colors.textPrimary};
`;

export const CategoryValues = styled.div`
  text-align: right;
`;

export const CurrentAmount = styled.div`
  font-size: ${typography.fontSize.base};
  color: ${colors.textPrimary};
`;

type PercentChangeProps = {
  change: number | null;
};

export const PercentChange = styled.div<PercentChangeProps>`
  font-size: ${typography.fontSize.sm};
  color: ${({ change }) =>
    change === null
      ? colors.textMuted
      : change >= 0
      ? colors.charts.loss
      : colors.charts.profit};
`;
