import { useEffect, useState } from "react";
import { FiltersWrapper, QuickButtons } from "./FilterBar.styled";
import Button from "../../components/Button/Button";
import Label from "../Label/Label";
import Input from "../Input/Input";

type FilterBarProps = {
  onFilter: (startDate: string, endDate: string) => void;
  defaultRange?: number;
  runOnMount?: boolean;
};

const FilterBar = ({
  onFilter,
  defaultRange = 30,
  runOnMount = true,
}: FilterBarProps) => {
  const [loading, setLoading] = useState(false);

  const today = new Date();
  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState<string>(
    formatDate(new Date(today.getTime() - defaultRange * 24 * 60 * 60 * 1000))
  );
  const [endDate, setEndDate] = useState<string>(formatDate(today));

  useEffect(() => {
    if (runOnMount) onFilter(startDate, endDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFilter = async () => {
    setLoading(true);
    await onFilter(startDate, endDate);
    setLoading(false);
  };

  const quickSet = (daysOrDate: number | string) => {
    let newStart: Date;

    if (typeof daysOrDate === "number") {
      newStart = new Date(today.getTime() - daysOrDate * 24 * 60 * 60 * 1000);
    } else {
      newStart = new Date(daysOrDate);
    }

    setStartDate(formatDate(newStart));
    setEndDate(formatDate(today));
    onFilter(formatDate(newStart), formatDate(today));
  };

  return (
    <FiltersWrapper>
      <Label>Start:</Label>
      <Input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      <Label>End:</Label>
      <Input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />

      <Button onClick={applyFilter} disabled={loading}>
        Apply
      </Button>

      <QuickButtons>
        <Button variant="secondary" onClick={() => quickSet(30)}>
          1M
        </Button>
        <Button variant="secondary" onClick={() => quickSet(90)}>
          3M
        </Button>
        <Button variant="secondary" onClick={() => quickSet(180)}>
          6M
        </Button>
        <Button variant="secondary" onClick={() => quickSet(365)}>
          1Y
        </Button>
        <Button variant="secondary" onClick={() => quickSet("2005-05-01")}>
          All
        </Button>
      </QuickButtons>
    </FiltersWrapper>
  );
};

export default FilterBar;
