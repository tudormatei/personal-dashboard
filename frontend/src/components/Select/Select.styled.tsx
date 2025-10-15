import styled from "@emotion/styled";
import {
  colors,
  spacing,
  radii,
  shadows,
  transitions,
  typography,
} from "../../constants/styling";

export const Dropdown = styled.div<{ disabled?: boolean }>`
  position: relative;
  user-select: none;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;

export const Selected = styled.div<{ disabled?: boolean }>`
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${radii.full};
  border: 1px solid ${colors.border};
  background: ${({ disabled }) =>
    disabled ? colors.surface : colors.surfaceAlt};
  color: ${({ disabled }) =>
    disabled ? colors.textMuted : colors.textPrimary};
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: ${typography.fontWeight.medium};
  transition: ${transitions.base};

  &:hover {
    background: ${({ disabled }) =>
      disabled ? colors.surfaceAlt : colors.accent + "20"};
    box-shadow: ${({ disabled }) => (disabled ? "none" : shadows.soft)};
  }
`;

export const Arrow = styled.span<{ open: boolean }>`
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: ${({ open }) =>
    open ? "none" : `5px solid ${colors.textPrimary}`};
  border-bottom: ${({ open }) =>
    open ? `5px solid ${colors.textPrimary}` : "none"};
  transition: transform 0.2s;
`;

export const OptionsList = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  width: 100%;
  border-radius: ${radii.md};
  background: ${colors.surface};
  box-shadow: ${shadows.soft};
  max-height: 200px;
  overflow-y: auto;
  z-index: 100;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${colors.surface};
    border-radius: ${radii.md};
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${colors.background};
    border-radius: ${radii.md};
    border: 2px solid ${colors.surface};
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: ${colors.background};
    opacity: 0.8;
  }

  scrollbar-width: thin;
  scrollbar-color: ${colors.background} ${colors.surface};
`;

export const OptionItem = styled.div<{ selected?: boolean }>`
  padding: ${spacing.sm} ${spacing.md};
  cursor: pointer;
  background: ${({ selected }) =>
    selected ? colors.accent + "30" : "transparent"};
  color: ${colors.textPrimary};
  font-weight: ${typography.fontWeight.medium};

  &:hover {
    background: ${colors.accent + "20"};
  }
`;
