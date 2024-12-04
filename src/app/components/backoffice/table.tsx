import React from "react";

import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TableFooter,
  TablePagination,
  TableCell,
  Typography,
  Tooltip
} from "@mui/material";

import { TableListFieldType } from "@/app/(DashboardLayout)/types/tms/common";

import BlankCard from "../shared/BlankCard";
import TableCard from "@/components/filters/tableCard";

type Props = {
  fields: TableListFieldType[];
  handleChangeRowsPerPage?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number
  ) => void;
  rowsPerPage: number;
  page: number;
  // tableHead: React.JSX.Element | React.JSX.Element[];
  children: React.JSX.Element | React.JSX.Element[];
  onClickFilter?: () => void;
  onClickCreate?: () => void;
};

const TableBf = ({
  fields,
  handleChangeRowsPerPage,
  onPageChange,
  rowsPerPage,
  page,
  children,
  onClickFilter,
  onClickCreate
}: Props) => {
  return (
    <TableCard onClickFilter={onClickFilter} onClickCreate={onClickCreate}>
      <BlankCard>
        <TableContainer>
          <Table
            sx={{
              tableLayout: "auto"
            }}
          >
            <TableHead>
              <TableRow>
                {/* <TableCell>
                  <Typography variant="body1">#</Typography>
                </TableCell> */}
                {fields.map((field: TableListFieldType, i) =>
                  field.visible ? (
                    <TableCell key={i} align={"justify"}>
                      <Tooltip title={field.label} arrow>
                        <Typography
                          sx={{
                            display: "-webkit-box",
                            overflow: "hidden",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 1
                          }}
                          variant="subtitle1"
                          fontWeight="500"
                        >
                          {field.label}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                  ) : null
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {children}
              {/* {items &&
                items.map((row: object, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography>{index + 1}</Typography>
                    </TableCell>
                    {fields.map((field: TableListFieldType, i: number) =>
                      field.visible ? (
                        <TableCell key={50 * index + i}>
                          {field?.type === "actions" ? (
                            <>
                              {field?.actions?.includes("detail") && (
                                <IconButton>
                                  <IconEye
                                    width={20}
                                    onClick={() => {
                                      router.push(
                                        `${pathname}/details/${row.pk}`
                                      );
                                    }}
                                  />
                                </IconButton>
                              )}
                            </>
                          ) : field?.type === "edit" ? (
                            <TableCell>
                              <IconButton
                                id="basic-button"
                                aria-controls={open ? "basic-menu" : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? "true" : undefined}
                                onClick={handleClick}
                              >
                                <IconDots width={18} />
                              </IconButton>
                              <Menu
                                id="basic-menu"
                                anchorEl={anchorElEdit}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                  "aria-labelledby": "basic-button"
                                }}
                              >
                                <MenuItem onClick={() => setAdd(true)}>
                                  <ListItemIcon>
                                    <IconPlus width={18} />
                                  </ListItemIcon>
                                  Add
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                  <ListItemIcon>
                                    <IconEdit width={18} />
                                  </ListItemIcon>
                                  Edit
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                  <ListItemIcon>
                                    <IconTrash width={18} />
                                  </ListItemIcon>
                                  Delete
                                </MenuItem>
                              </Menu>
                            </TableCell>
                          ) : (
                            <Typography>
                              {toString(row?.[field.key])}
                            </Typography>
                          )}
                        </TableCell>
                      ) : null
                    )}
                  </TableRow>
                ))} */}
            </TableBody>
          </Table>
        </TableContainer>
        <TableFooter>
          <TableRow>
            <TablePagination
              colSpan={Object.keys(fields).length + 1}
              rowsPerPageOptions={[1, 5, 10, 50]}
              page={page}
              count={8888}
              rowsPerPage={rowsPerPage}
              onPageChange={onPageChange}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </BlankCard>
    </TableCard>
  );
};

export default TableBf;
