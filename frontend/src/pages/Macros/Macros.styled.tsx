import styled from "@emotion/styled";
import { spacing, typography } from "../../constants/styling";

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
