import styled from "@emotion/styled";
import { colors, radii, typography } from "../../constants/styling";

type CategoryCellProps = {
  category?: string;
};

type CategoryName =
  | "Food"
  | "Health & Fitness"
  | "Travel"
  | "Transport"
  | "Shopping"
  | "Entertainment"
  | "Career"
  | "Bills";

export const CategoryCell = styled.span<CategoryCellProps>`
  display: inline-block;
  padding: 4px 8px;
  align-items: center;
  justify-content: center;
  border-radius: ${radii.md};
  background-color: ${({ category }) =>
    (category && colors.categories[category as CategoryName]) ||
    colors.surfaceAlt};
  color: ${colors.textPrimary};
  font-size: ${typography.fontSize.sm};
  border: 1px solid ${colors.border};
  white-space: nowrap;
`;

export const PagesContainer = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
`;

export const SubcategoryCell = styled.span`
  display: inline-block;
  padding: 4px 8px;
  align-items: center;
  justify-content: center;
  border-radius: ${radii.md};
  color: ${colors.textMuted};
  font-size: ${typography.fontSize.sm};
  border: 1px dashed ${colors.border};
  white-space: nowrap;
`;

export const DescriptionCell = styled.td`
  max-width: 700px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
