"use client";

import React, { useEffect } from "react";

import { alpha } from "@mui/material/styles";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  IconButton,
  Tooltip,
  FormControlLabel,
  Typography,
  Avatar,
  AvatarGroup,
  Badge
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import CustomCheckbox from "@/app/components/forms/theme-elements/CustomCheckbox";
import CustomSwitch from "@/app/components/forms/theme-elements/CustomSwitch";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import ParentCard from "@/app/components/shared/ParentCard";
import { IconTrash, IconFilter } from "@tabler/icons-react";
import { Stack } from "@mui/system";
import {
  EnhancedTableData,
  EnTableType
} from "@/app/components/tables/tableData";
import BlankCard from "@/app/components/shared/BlankCard";

const BCrumb = [
  {
    to: "/",
    title: "Home"
  },
  {
    title: "Enhanced Table"
  }
];

const rows: EnTableType[] = EnhancedTableData;

type Order = "asc" | "desc";

interface HeadCell {
  disablePadding: boolean;
  id: any;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Team Lead"
  },
  {
    id: "pname",
    numeric: false,
    disablePadding: false,
    label: "Project Name"
  },
  {
    id: "team",
    numeric: false,
    disablePadding: false,
    label: "Team"
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status"
  },
  {
    id: "weeks",
    numeric: false,
    disablePadding: false,
    label: "Weeks"
  },
  {
    id: "budget",
    numeric: false,
    disablePadding: false,
    label: "Budget"
  }
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof []) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  orderTable: any;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, numSelected, rowCount, onRequestSort, orderTable } =
    props;
  const createSortHandler =
    (property: keyof []) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <CustomCheckbox
            checked={rowCount > 0 && numSelected === rowCount}
            tabIndex={-1}
            inputProps={{
              "aria-labelledby": "select all desserts"
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderTable[headCell.id].order !== "none"}
              direction={
                orderTable[headCell.id].order === "none"
                  ? "asc"
                  : orderTable[headCell.id].order
              }
              onClick={createSortHandler(headCell.id)}
            >
              <Typography variant="subtitle1" fontWeight="500">
                {headCell.label}
              </Typography>
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const EnhanceTable = () => {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<any>("calories");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [orderTable, setOrderTable] = React.useState<any>({
    name: {
      order: "none"
    },
    pname: {
      order: "none"
    },
    team: {
      order: "none"
    },
    status: {
      order: "none"
    },
    weeks: {
      order: "none"
    },
    budget: {
      order: "none"
    }
  });

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof []
  ) => {
    setOrderTable((prev: any) => {
      let newOrder = "asc";
      if (prev[property].order === "asc") {
        newOrder = "desc";
      } else if (prev[property].order === "desc") {
        newOrder = "none";
      }
      return {
        ...prev,
        [property]: {
          order: newOrder
        }
      };
    });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  useEffect(() => {
    console.log(orderTable);
  }, [orderTable]);

  return (
    <PageContainer title="Enhanced Table" description="this is Enhanced Table">
      {/* breadcrumb */}
      <Breadcrumb title="Enhanced Table" items={BCrumb} />
      <ParentCard title="Enhanced Table">
        <BlankCard>
          <Box mb={2} sx={{ mb: 2 }}>
            <TableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={dense ? "small" : "medium"}
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  orderTable={orderTable}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
                <TableBody>
                  {/* <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.name)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                >
                    <TableCell padding="checkbox">
                    <CustomCheckbox
                        checked={isItemSelected}
                        inputProps={{
                        'aria-labelledby': labelId,
                        }}
                    />
                    </TableCell>
                    <TableCell>
                    <Stack spacing={2} direction="row">
                        <Avatar
                        alt="text"
                        src={row.imgsrc}
                        sx={{
                            width: '35px',
                            height: '35px',
                        }}
                        />
                        <Box>
                        <Typography variant="h6" fontWeight="600">
                            {row.name}
                        </Typography>
                        <Typography color="textSecondary" variant="subtitle2">
                            {row.email}
                        </Typography>
                        </Box>
                    </Stack>
                    </TableCell>
                    <TableCell>
                    <Typography color="textSecondary" variant="subtitle2" fontWeight="400">
                        {row.pname}
                    </Typography>
                    </TableCell>
                    <TableCell>
                    <Stack direction="row">
                        <AvatarGroup>
                        {row.teams.map((team: any) => (
                            <Avatar
                            key={team.id}
                            sx={{
                                width: '35px',
                                height: '35px',
                                bgcolor: team.color,
                            }}
                            >
                            {team.text}
                            </Avatar>
                        ))}
                        </AvatarGroup>
                    </Stack>
                    </TableCell>
                    <TableCell>
                    <Stack spacing={1} direction="row" alignItems="center">
                        <Typography color="textSecondary" variant="body1">
                        {row.status}
                        </Typography>
                    </Stack>
                    </TableCell>
                    <TableCell>
                    <Typography color="textSecondary" variant="body1">
                        {row.weeks}
                    </Typography>
                    </TableCell>
                    <TableCell>
                    <Typography variant="h6">${row.budget}k</Typography>
                    </TableCell>
                </TableRow> */}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
          <Box p={2}>
            <FormControlLabel
              control={
                <CustomSwitch checked={dense} onChange={handleChangeDense} />
              }
              label="Dense padding"
            />
          </Box>
        </BlankCard>
      </ParentCard>
    </PageContainer>
  );
};

export default EnhanceTable;
