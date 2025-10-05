import styled from "@emotion/styled";
import { colors, spacing, typography } from "../../constants/styling";

export const Header = styled.h1`
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.bold};
  margin-bottom: ${spacing.lg};
`;

export const DashboardGrid = styled.div`
  margin-top: ${spacing.xl};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${spacing.lg};
`;

export const PositionsContainer = styled.div`
  display: flex;
  width: 100%;
  gap: ${spacing.md};
`;

export const CashContainer = styled.div`
  display: flex;
  width: 100%;
  gap: ${spacing.md};
`;

export const InfoContainer = styled.div<{
  width?: string;
  noMarginTop?: boolean;
}>`
  width: ${({ width }) => (width ? width : "100%")};

  h2 {
    color: ${colors.textPrimary};
    margin-top: ${({ noMarginTop }) => (noMarginTop ? 0 : spacing.xl)};
    margin-bottom: ${spacing.md};
  }
`;
