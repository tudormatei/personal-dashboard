import { type InputHTMLAttributes, type FC } from "react";
import { StyledInputWrapper, StyledInput } from "./Input.styled";

type InputProps = {
  minWidth?: number;
  maxWidth?: number;
} & Pick<
  InputHTMLAttributes<HTMLInputElement>,
  | "onChange"
  | "onKeyDown"
  | "name"
  | "id"
  | "autoFocus"
  | "defaultValue"
  | "value"
  | "disabled"
  | "type"
  | "placeholder"
  | "onClick"
  | "onFocus"
>;

const Input: FC<InputProps> = ({ ...props }) => {
  return (
    <>
      <StyledInputWrapper>
        <StyledInput {...props} />
      </StyledInputWrapper>
    </>
  );
};

export default Input;
