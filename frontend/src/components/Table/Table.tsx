import type { ReactNode } from "react";
import { StyledTable, TableScroll } from "./Table.styled";

type TableProps = {
  headers: string[];
  children: ReactNode;
  scrollable?: boolean;
  minHeight?: string;
};

const Table = ({
  headers,
  children,
  scrollable = false,
  minHeight,
}: TableProps) => {
  return (
    <TableScroll scrollable={scrollable}>
      <StyledTable minHeight={minHeight}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </StyledTable>
    </TableScroll>
  );
};

export default Table;
