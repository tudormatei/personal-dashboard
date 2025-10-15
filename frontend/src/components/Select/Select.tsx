import { useEffect, useRef, useState, type FC } from "react";
import {
  Arrow,
  Dropdown,
  OptionItem,
  OptionsList,
  Selected,
} from "./Select.styled";

type Option = { label: string; value: string | null };

type CustomSelectProps = {
  options: Option[];
  value?: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
};

const CustomSelect: FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  disabled,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val: string | null) => {
    onChange(val);
    setOpen(false);
  };

  const selectedLabel =
    options.find((o) => o.value === value)?.label ?? "Select...";

  return (
    <Dropdown
      ref={ref}
      disabled={disabled}
      onClick={() => !disabled && setOpen(!open)}
    >
      <Selected disabled={disabled}>
        {selectedLabel} <Arrow open={open} />
      </Selected>
      {open && (
        <OptionsList>
          {options.map((option) => (
            <OptionItem
              key={option.value}
              selected={option.value === value}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </OptionItem>
          ))}
        </OptionsList>
      )}
    </Dropdown>
  );
};

export default CustomSelect;
