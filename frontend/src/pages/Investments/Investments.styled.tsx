import styled from "@emotion/styled";
import { spacing } from "../../constants/styling";

export const FormContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${spacing.md};
  align-items: end;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;
