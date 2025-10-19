import styled from "@emotion/styled";
import {
  colors,
  radii,
  shadows,
  spacing,
  transitions,
  typography,
} from "../../constants/styling";

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
  max-width: 500px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  cursor: help;
`;

export const SortButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.xs};
  background: ${colors.surfaceAlt};
  color: ${colors.textPrimary};
  border: 1px solid ${colors.border};
  border-radius: ${radii.md};
  padding: ${spacing.sm} ${spacing.md};
  font-family: ${typography.fontFamily};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  cursor: pointer;
  transition: ${transitions.base};
  box-shadow: ${({ active }) => (active ? shadows.soft : shadows.none)};

  &:hover {
    color: ${colors.accent};
    box-shadow: ${shadows.soft};
  }

  &:active {
    transform: scale(0.97);
  }

  svg {
    width: 16px;
    height: 16px;
    transition: transform 0.2s ease;
    transform: ${({ active }) => (active ? "rotate(180deg)" : "none")};
  }
`;

export const RecurringList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const RecurringItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  border-radius: 8px;
`;
