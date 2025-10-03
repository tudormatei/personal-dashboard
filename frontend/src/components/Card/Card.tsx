import { type ReactNode } from "react";
import { CardContainer, CardTitle, CardValue } from "./Card.styled";

interface CardProps {
  title?: string;
  value?: string | number | ReactNode;
  children?: ReactNode;
}

export const Card = ({ title, value, children }: CardProps) => {
  return (
    <CardContainer>
      {title && <CardTitle>{title}</CardTitle>}
      {value !== undefined && <CardValue>{value}</CardValue>}
      {children}
    </CardContainer>
  );
};

export default Card;
