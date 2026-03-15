import type { JSX } from "react";
import {
  BarWrapper,
  BarFill,
  TickLabel,
  Container,
} from "./ProgressBar.styled";
import { SubHeader } from "../Typography/Headings";

type ProgressBarProps = {
  progress: number;
  label?: string;
  goal?: number;
  current?: number;
  start?: number;
  etaDays?: number | null;
};

const ProgressBar = ({
  progress,
  label,
  goal,
  current,
  start,
  etaDays,
}: ProgressBarProps): JSX.Element => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const today = new Date();
  const estimatedDate = new Date(today);
  estimatedDate.setDate(today.getDate() + (etaDays ?? 0));
  const formattedDate = estimatedDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      {label && <SubHeader>{`${label} - ETA ${formattedDate}`}</SubHeader>}
      <Container>
        <BarWrapper>
          <BarFill progress={clampedProgress} />
          <TickLabel left={0}>
            <span className="tick" />
            {start}
          </TickLabel>
          <TickLabel left={clampedProgress}>
            <span className="tick" />
            {current}
          </TickLabel>
          <TickLabel left={100}>
            <span className="tick" />
            {goal}
          </TickLabel>
        </BarWrapper>
      </Container>
    </>
  );
};

export default ProgressBar;
