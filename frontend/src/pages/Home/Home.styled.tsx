import styled from "@emotion/styled";
import {
  colors,
  spacing,
  radii,
  shadows,
  typography,
} from "../../constants/styling";

export const Header = styled.h1`
  font-size: ${typography.fontSize.xxl};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.textPrimary};
  text-shadow: ${shadows.soft};
  text-align: center;
`;

export const SubHeader = styled.h2`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.textMuted};
  text-align: center;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: ${spacing.xxl};
`;

export const SectionCard = styled.div`
  background: ${colors.surfaceAlt};
  border-radius: ${radii.lg};
  box-shadow: ${shadows.soft};
  padding: ${spacing.xl};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: box-shadow 0.2s, border 0.2s;
  border: 2px solid transparent;
  &:hover {
    box-shadow: ${shadows.medium};
    border: 2px solid ${colors.accent};
  }
`;

export const IconWrapper = styled.div`
  font-size: 3rem;
  color: ${colors.accent};
  margin-bottom: ${spacing.lg};
`;

export const SectionTitle = styled.h3`
  font-size: ${typography.fontSize.xxl};
  font-weight: ${typography.fontWeight.bold};
  margin-bottom: ${spacing.sm};
  color: ${colors.textPrimary};
`;

export const SectionDesc = styled.div`
  color: ${colors.textMuted};
  ul {
    margin: 0;
    padding-left: ${spacing.lg};
    list-style: disc;
    li {
      margin-bottom: ${spacing.sm};
      font-size: ${typography.fontSize.lg};
      line-height: ${typography.lineHeight.relaxed};
    }
  }
`;
