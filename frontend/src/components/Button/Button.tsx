import type { ButtonHTMLAttributes, FC, ReactNode } from "react";
import {
  SpinnerWrapper,
  StyledButton,
  StyledSpinner,
  TextWrapper,
} from "./Button.styled";

type ButtonProps = {
  children: ReactNode;
  loading?: boolean;
  variant?: "primary" | "secondary";
} & Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick" | "type" | "disabled"
>;

const Button: FC<ButtonProps> = ({
  children,
  loading,
  disabled,
  variant = "primary",
  ...props
}) => {
  const isDisabled = loading || disabled;

  return (
    <StyledButton disabled={isDisabled} variant={variant} {...props}>
      <>
        {loading && (
          <SpinnerWrapper>
            <StyledSpinner />
          </SpinnerWrapper>
        )}
        <TextWrapper>{children}</TextWrapper>
      </>
    </StyledButton>
  );
};

export default Button;
