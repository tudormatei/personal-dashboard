import type { FC } from "react";
import { AlertContainer } from "./Alert.styled";
import type { AlertData } from "../../types/types";

const Alert: FC<AlertData> = ({ text, type }) => {
  return (
    <AlertContainer type={type}>
      <div>{text}</div>
    </AlertContainer>
  );
};

export default Alert;
