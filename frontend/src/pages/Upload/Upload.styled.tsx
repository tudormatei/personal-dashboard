import styled from "@emotion/styled";
import {
  colors,
  spacing,
  radii,
  shadows,
  typography,
  transitions,
  breakpoints,
} from "../../constants/styling";

export const PageContainer = styled.div`
  width: 100%;
  color: ${colors.textPrimary};
  display: flex;
  flex-direction: row;
  justify-content: center;
  text-align: center;
  align-items: center;
  font-family: ${typography.fontFamily};
  gap: ${spacing.lg};

  ${breakpoints.phone} {
    flex-direction: column;
  }
`;

export const UploadBox = styled.div`
  border-radius: ${radii.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing.lg};
  width: 100%;
  max-width: 450px;
  transition: ${transitions.base};
`;

export const FileInput = styled.input`
  appearance: none;
  width: 100%;
  padding: ${spacing.md};
  border-radius: ${radii.lg};
  background: ${colors.surface};
  color: ${colors.textPrimary};
  border: 2px dashed ${colors.textMuted};
  font-size: ${typography.fontSize.base};
  cursor: pointer;
  transition: ${transitions.base};

  &:hover,
  &:focus {
    border-color: ${colors.accent};
    box-shadow:
      inset 0 0 0 2px rgba(255, 140, 0, 0.1),
      0 0 10px rgba(255, 140, 0, 0.2);
    outline: none;
  }

  &::file-selector-button {
    background: ${colors.accent};
    color: ${colors.background};
    border: none;
    padding: ${spacing.sm} ${spacing.md};
    border-radius: ${radii.full};
    cursor: pointer;
    font-size: ${typography.fontSize.sm};
    font-weight: ${typography.fontWeight.medium};
    transition: ${transitions.base};
    margin-right: ${spacing.md};

    &:hover {
      background: ${colors.accent};
      opacity: 0.9;
      box-shadow: ${shadows.soft};
    }

    &:active {
      transform: scale(0.98);
      box-shadow: ${shadows.none};
    }

    &:focus {
      outline: none;
      box-shadow:
        0 0 0 2px ${colors.background},
        0 0 0 4px ${colors.accent};
    }
  }
`;

export const HelperText = styled.p`
  font-size: ${typography.fontSize.sm};
  color: ${colors.textMuted};
  text-align: center;
  margin-top: -${spacing.md};
`;
