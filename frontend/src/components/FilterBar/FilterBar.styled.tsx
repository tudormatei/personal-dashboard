import styled from "@emotion/styled";
import { colors, spacing, radii } from "../../constants/styling";

export const FiltersWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${spacing.md};
  padding: ${spacing.md};
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: ${radii.lg};
`;

export const QuickButtons = styled.div`
  display: flex;
  gap: ${spacing.sm};
  margin-left: auto;
`;
