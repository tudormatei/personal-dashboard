import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { colors, spacing, typography, shadows } from "../constants/styling";

export const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: ${colors.background};
  color: ${colors.textPrimary};
  font-family: ${typography.fontFamily};
  overflow: hidden;
`;

export const Sidebar = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 72px;
  background-color: ${colors.surface};
  border-right: 1px solid ${colors.border};
  padding: ${spacing.md} 0;
  gap: ${spacing.lg};
`;

export const Separator = styled.div`
  height: 1px;
  width: 50%;
  background-color: ${colors.charts.grid};
  margin: 0;
`;

export const Logo = styled.div`
  font-size: 1.25rem;
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.accent};
  text-shadow: ${shadows.accent};
`;

type SidebarItemProps = {
  active: boolean;
};

export const SidebarItem = styled(Link, {
  shouldForwardProp: (prop) => prop !== "active",
})<SidebarItemProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  color: ${({ active }) => (active ? colors.accent : colors.textMuted)};
  background-color: ${({ active }) =>
    active ? colors.surfaceAlt : "transparent"};
  transition: 0.25s ease;
  cursor: pointer;

  &:hover {
    color: ${colors.accent};
    background-color: ${colors.surfaceAlt};
    box-shadow: ${shadows.soft};
  }
`;

export const ContentArea = styled.main`
  background-color: ${colors.background};
  background: ${colors.background};
  color: ${colors.textPrimary};
  padding: ${spacing.xxl};
  height: 100%;
  width: 100%;
  font-family: ${typography.fontFamily};
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
  overflow-x: hidden;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;
