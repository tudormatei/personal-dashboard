import styled from "@emotion/styled";
import {
  colors,
  spacing,
  radii,
  shadows,
  typography,
  breakpoints,
} from "../../constants/styling";

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: ${spacing.xxl};

  ${breakpoints.phone} {
    gap: ${spacing.md};
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${spacing.md};
  margin-bottom: ${spacing.sm};
  width: 100%;
`;

export const SectionCard = styled.div`
  background: ${colors.surfaceAlt};
  border-radius: ${radii.lg};
  padding: ${spacing.xl};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition:
    box-shadow 0.2s,
    border 0.2s;
  border: 2px solid ${colors.surface};
  &:hover {
    box-shadow: ${shadows.medium};
    border: 2px solid ${colors.accent};
  }

  ${breakpoints.phone} {
    padding: ${spacing.lg};
  }
`;

export const IconWrapper = styled.div`
  font-size: 3rem;
  color: ${colors.accent};
  display: flex;
  align-items: center;

  ${breakpoints.phone} {
    font-size: 2rem;
  }
`;

export const SectionTitle = styled.h3`
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.textPrimary};
  margin: 0;

  ${breakpoints.phone} {
    font-size: ${typography.fontSize.lg};
  }
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

      ${breakpoints.phone} {
        font-size: ${typography.fontSize.base};
      }
    }
  }
`;
