import styled from "@emotion/styled";
import {
  colors,
  spacing,
  radii,
  typography,
} from "../../../../constants/styling";

export const Wrapper = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  gap: ${spacing.xl};
`;

export const CategoryCard = styled.div`
  border: 1px solid ${colors.border};
  border-radius: ${radii.lg};
  padding: ${spacing.md};
  background: ${colors.surfaceAlt};
`;

export const CategoryHeader = styled.h2`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.textPrimary};
`;

export const TransactionItem = styled.div`
  padding: ${spacing.sm} ${spacing.md};
  margin-bottom: ${spacing.xs};
`;

export const TransactionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TransactionInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TransactionTitle = styled.strong`
  font-size: ${typography.fontSize.base};
  color: ${colors.textPrimary};
`;

export const TransactionMeta = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.textMuted};
`;

export const TransactionAmount = styled.div`
  font-weight: ${typography.fontWeight.medium};
  text-align: right;
  color: ${colors.accent};
`;

export const ExpandButton = styled.button`
  border: none;
  background: none;
  color: ${colors.accent};
  cursor: pointer;
  font-size: ${typography.fontSize.sm};
  margin-top: ${spacing.xs};
  text-align: right;
  &:hover {
    text-decoration: underline;
  }
`;

export const ChartContainer = styled.div`
  margin-top: ${spacing.sm};
  height: 80px;
`;

export const EmptyState = styled.div`
  text-align: center;
  color: ${colors.textMuted};
  padding: ${spacing.md};
  font-size: ${typography.fontSize.base};
`;
