import { Box, Skeleton, TableBody, TableCell, TableRow } from "@mui/material";
import React from "react";
import TypoToolTip from "../typography/typograpyToolTip";

interface Props {
  count: number;
  rowsPerPage: number;
}

export const TableLoader = ({ count, rowsPerPage }: Props) => {
  const rows = Array.from(new Array(rowsPerPage)); // Create an array with 10 elements
  const columns = Array.from(new Array(count)); // Create an array with 5 elements

  return (
    <TableBody>
      {rows.map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {columns.map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Box display="flex" flexDirection="row" width="100%">
                <Skeleton variant="text" width="90%"></Skeleton>
                <TypoToolTip
                  color="textSecondary"
                  fontSize={13}
                  fontWeight="500"
                  style={{ visibility: "hidden" }}
                >
                  T
                </TypoToolTip>
              </Box>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
};
