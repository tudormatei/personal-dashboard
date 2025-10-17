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
  max-width: 700px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const SortButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.xs};
  background: ${({ active }) => (active ? colors.accent : colors.surfaceAlt)};
  color: ${({ active }) => (active ? colors.background : colors.textPrimary)};
  border: 1px solid ${({ active }) => (active ? colors.accent : colors.border)};
  border-radius: ${radii.md};
  padding: ${spacing.sm} ${spacing.md};
  font-family: ${typography.fontFamily};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  cursor: pointer;
  transition: ${transitions.base};
  box-shadow: ${({ active }) => (active ? shadows.soft : shadows.none)};

  &:hover {
    background: ${colors.accent};
    color: ${colors.background};
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
