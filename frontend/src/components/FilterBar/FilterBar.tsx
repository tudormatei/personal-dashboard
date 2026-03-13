import { useEffect, useState } from "react";
import {
  FiltersWrapper,
  MainRow,
  FieldGroup,
  QuickButtons,
  HiddenLabel,
  RangeIcon,
} from "./FilterBar.styled";
import Button from "../Button/Button";
import { FiArrowRight } from "react-icons/fi";

import Input from "../Input/Input";

type FilterBarProps = {
  onFilter: (startDate: string, endDate: string) => void | Promise<void>;
  defaultRange?: number;
  runOnMount?: boolean;
};

const DAY_MS = 24 * 60 * 60 * 1000;

const formatDate = (d: Date) => {
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getToday = () => new Date();

const FilterBar = ({
  onFilter,
  defaultRange = 30,
  runOnMount = true,
}: FilterBarProps) => {
  const today = getToday();

  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<string>(
    formatDate(new Date(today.getTime() - defaultRange * DAY_MS)),
  );
  const [endDate, setEndDate] = useState<string>(formatDate(today));

  useEffect(() => {
    if (runOnMount) void onFilter(startDate, endDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const invalidRange = startDate > endDate;

  const applyFilter = async () => {
    if (loading || invalidRange) return;

    try {
      setLoading(true);
      await onFilter(startDate, endDate);
    } finally {
      setLoading(false);
    }
  };

  const quickSet = async (daysOrDate: number | string) => {
    const now = getToday();

    const newStart =
      typeof daysOrDate === "number"
        ? new Date(now.getTime() - daysOrDate * DAY_MS)
        : new Date(daysOrDate);

    const nextStart = formatDate(newStart);
    const nextEnd = formatDate(now);

    setStartDate(nextStart);
    setEndDate(nextEnd);

    try {
      setLoading(true);
      await onFilter(nextStart, nextEnd);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FiltersWrapper>
      <MainRow>
        <FieldGroup>
          <HiddenLabel htmlFor="start-date">Start date</HiddenLabel>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            max={endDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </FieldGroup>

        <RangeIcon>
          <FiArrowRight />
        </RangeIcon>

        <FieldGroup>
          <HiddenLabel htmlFor="end-date">End date</HiddenLabel>
          <Input
            id="end-date"
            type="date"
            value={endDate}
            min={startDate}
            max={formatDate(getToday())}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </FieldGroup>

        <Button
          className="apply-button"
          onClick={applyFilter}
          disabled={loading || invalidRange}
        >
          {loading ? "Loading..." : "Apply"}
        </Button>

        <QuickButtons>
          <Button
            variant="secondary"
            onClick={() => quickSet(30)}
            disabled={loading}
          >
            1M
          </Button>
          <Button
            variant="secondary"
            onClick={() => quickSet(90)}
            disabled={loading}
          >
            3M
          </Button>
          <Button
            variant="secondary"
            onClick={() => quickSet(180)}
            disabled={loading}
          >
            6M
          </Button>
          <Button
            variant="secondary"
            onClick={() => quickSet(365)}
            disabled={loading}
          >
            1Y
          </Button>
          <Button
            variant="secondary"
            onClick={() => quickSet("2005-05-01")}
            disabled={loading}
          >
            All
          </Button>
        </QuickButtons>
      </MainRow>
    </FiltersWrapper>
  );
};

export default FilterBar;
