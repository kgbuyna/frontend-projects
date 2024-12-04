import { TableCell } from "@mui/material";

const StyledTableCell = ({ children }: { children?: JSX.Element }) => (
  <TableCell sx={{ maxWidth: 200, overflow: "inherit", textOverflow: "clip" }}>
    {children}
  </TableCell>
);

export default StyledTableCell;
