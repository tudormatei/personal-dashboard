import styled from "@emotion/styled";
import { colors, spacing, radii, breakpoints } from "../../constants/styling";

export const FiltersWrapper = styled.div`
  width: 100%;
  padding: ${spacing.sm} ${spacing.md};
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: ${radii.lg};
  box-sizing: border-box;

  @media (max-width: 640px) {
    padding: ${spacing.sm};
  }
`;

export const MainRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${spacing.sm};

  ${breakpoints.phone} {
    .apply-button {
      width: 100%;
    }
  }
`;

export const RangeIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  font-size: 18px;
  margin: 0 4px;
  align-self: center;

  svg {
    display: block;
  }

  ${breakpoints.phone} {
    display: none;
  }
`;

export const HiddenLabel = styled.label`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export const FieldGroup = styled.div`
  position: relative;
  flex: 0 0 auto;

  input {
    width: 148px;
    min-width: 148px;
  }

  ${breakpoints.phone} {
    flex: 1 1 100%;

    input {
      width: 100%;
      min-width: 0;
    }
  }
`;

export const QuickButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${spacing.xs};
  margin-left: auto;

  & > button {
    flex: 0 0 auto;
    white-space: nowrap;
  }

  ${breakpoints.phone} {
    margin-left: 0;
    width: 100%;
  }

  ${breakpoints.phone} {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: ${spacing.xs};
    width: 100%;

    & > button {
      width: 100%;
      min-width: 0;
    }
  }
`;
