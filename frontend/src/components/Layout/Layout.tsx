import styled from "@emotion/styled";
import { spacing, breakpoints } from "../../constants/styling";

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${spacing.lg};

  ${breakpoints.phone} {
    grid-template-columns: 1fr;
    gap: ${spacing.md};
  }
`;

type FlexWrapperProps = {
  row?: boolean;
};

export const FlexWrapper = styled.div<FlexWrapperProps>`
  display: flex;
  flex-direction: ${({ row }) => (row ? "row" : "column")};
  width: 100%;
  gap: ${spacing.lg};

  ${breakpoints.phone} {
    flex-direction: column;
    gap: ${spacing.md};
    width: 100% !important;
  }
`;

export const GappedDiv = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${spacing.md};

  ${breakpoints.phone} {
    flex-wrap: wrap;
    gap: ${spacing.sm};
  }
`;
