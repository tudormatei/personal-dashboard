import { useEffect, useState } from "react";
import { FiltersWrapper, QuickButtons } from "./FilterBar.styled";
import Button from "../../components/Button/Button";

interface FilterBarProps {
  onFilter: (startDate: string, endDate: string) => void;
  defaultRange?: number;
}

const FilterBar = ({ onFilter, defaultRange = 30 }: FilterBarProps) => {
  const today = new Date();
  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState<string>(
    formatDate(new Date(today.getTime() - defaultRange * 24 * 60 * 60 * 1000))
  );
  const [endDate, setEndDate] = useState<string>(formatDate(today));

  useEffect(() => {
    onFilter(startDate, endDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFilter = () => {
    onFilter(startDate, endDate);
  };

  const quickSet = (days: number) => {
    const newStart = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
    setStartDate(formatDate(newStart));
    setEndDate(formatDate(today));
    onFilter(formatDate(newStart), formatDate(today));
  };

  return (
    <FiltersWrapper>
      <label>Start:</label>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      <label>End:</label>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />

      <Button onClick={applyFilter}>Apply</Button>

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
      </QuickButtons>
    </FiltersWrapper>
  );
};

export default FilterBar;
