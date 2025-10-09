import { type FC, type LabelHTMLAttributes } from "react";
import { StyledLabel } from "./Label.styled";

const Label: FC<LabelHTMLAttributes<HTMLLabelElement>> = (props) => {
  return <StyledLabel {...props} />;
};

export default Label;
