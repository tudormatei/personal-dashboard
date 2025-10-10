import styled from "@emotion/styled";
import { spacing } from "../../constants/styling";

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${spacing.lg};
`;

type FlexWrapperProps = {
  row?: boolean;
};

export const FlexWrapper = styled.div<FlexWrapperProps>`
  display: flex;
  flex-direction: ${({ row }) => (row ? "row" : "column")};
  width: 100%;
  gap: ${spacing.lg};
`;
