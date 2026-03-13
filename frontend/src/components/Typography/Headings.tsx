import styled from "@emotion/styled";
import { breakpoints, colors, typography } from "../../constants/styling";

type HeaderProps = {
  center?: boolean;
};

export const H1 = styled.h1<HeaderProps>`
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.textPrimary};
  text-align: ${({ center }) => (center ? "center" : "unset")};

  ${breakpoints.phone} {
    text-align: center;
  }
`;

export const H2 = styled.h2<HeaderProps>`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.textPrimary};
  text-align: ${({ center }) => (center ? "center" : "unset")};
`;

export const SubHeader = styled.h2<HeaderProps>`
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.textMuted};
  text-align: ${({ center }) => (center ? "center" : "unset")};
`;
