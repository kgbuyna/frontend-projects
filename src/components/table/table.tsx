import React, { ReactNode } from "react";

import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TableFooter,
  TablePagination,
  TableCell
} from "@mui/material";

import { TableListFieldType } from "@/app/(DashboardLayout)/types/tms/common";

import BlankCard from "../../app/components/shared/BlankCard";
import TypoToolTip from "../typography/typograpyToolTip";
import { TableLoader } from "./tableLoader";
import TableCard from "../filters/tableCard";

type Props = {
  fields: TableListFieldType[];
  handleChangeRowsPerPage?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number
  ) => void;
  rowsPerPage: number;
  page: number;
  leftSection?: ReactNode;
  isLoading?: boolean;
  onClickFilter?: () => void;
  onClickCreate?: () => void;
  children: React.JSX.Element | React.JSX.Element[] | undefined;
  totalCount: number;
};

const CustomTable = ({
  fields,
  handleChangeRowsPerPage,
  onPageChange,
  rowsPerPage,
  page,
  isLoading,
  onClickFilter,
  onClickCreate,
  children,
  totalCount,
  leftSection
}: Props) => {
  const visibleItems = fields.filter((item) => item.visible);

  return (
    <TableCard
      leftSection={leftSection}
      onClickFilter={onClickFilter}
      onClickCreate={onClickCreate}
    >
      <BlankCard>
        <TableContainer>
          <Table
            sx={{
              tableLayout: "auto"
            }}
          >
            <TableHead>
              <TableRow>
                {fields.map((field: TableListFieldType, i) =>
                  field.visible ? (
                    <TableCell key={i} align={"justify"}>
                      <TypoToolTip fontWeight={600} fontSize={14}>
                        {field.label}
                      </TypoToolTip>
                    </TableCell>
                  ) : null
                )}
              </TableRow>
            </TableHead>
            {isLoading ? (
              <TableLoader
                rowsPerPage={rowsPerPage}
                count={visibleItems.length}
              />
            ) : (
              <TableBody>{children}</TableBody>
            )}
            <TableFooter>
              <TableRow>
                <TablePagination
                  labelRowsPerPage="Нэг хуудсанд харуулах мөрийн тоо"
                  colSpan={Object.keys(fields).length + 1}
                  rowsPerPageOptions={[1, 5, 10, 50]}
                  page={page}
                  count={totalCount}
                  rowsPerPage={rowsPerPage}
                  onPageChange={onPageChange}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{
                    "& .MuiTablePagination-spacer": {
                      flex: "none !important"
                    }
                  }}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </BlankCard>
    </TableCard>
  );
};

export default CustomTable;
