import styled from "@emotion/styled";
import { colors, radii, spacing, typography } from "../../constants/styling";

export const TableScroll = styled.div<{
  scrollable?: boolean;
}>`
  overflow-y: ${({ scrollable }) => (scrollable ? "auto" : "hidden")};
  max-height: ${({ scrollable }) => (scrollable ? "400px" : "none")};

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${colors.background};
    border-radius: ${radii.md};
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${colors.surfaceAlt};
    border-radius: ${radii.md};
    border: 2px solid ${colors.background};
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: ${colors.surfaceAlt};
    opacity: 0.8;
  }

  scrollbar-width: thin;
  scrollbar-color: ${colors.surfaceAlt} ${colors.background};
`;

export const StyledTable = styled.table<{ minHeight: string | undefined }>`
  min-height: ${({ minHeight }) => (minHeight ? minHeight : "auto")};
  width: 100%;
  border-collapse: collapse;
  color: ${colors.textPrimary};
  font-family: ${typography.fontFamily};
  font-size: ${typography.fontSize.base};

  th,
  td {
    padding: ${spacing.xs} ${spacing.sm};
    text-align: left;
    border-bottom: 1px solid ${colors.border};
  }

  th {
    color: ${colors.textMuted};
    font-weight: ${typography.fontWeight.medium};
  }

  tbody tr:hover {
    background-color: ${colors.surface};
  }
`;
