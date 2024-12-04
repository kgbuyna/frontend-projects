"use client";
import React, { MouseEvent, useEffect, useState } from "react";
import PageContainer from "@/app/components/container/PageContainer";
import CustomTable from "@/components/table/table";
import TypoToolTip from "@/components/typography/typograpyToolTip";
import {
  Box,
  TableRow,
  TableCell,
  IconButton,
  Typography,
  Collapse,
  TableHead,
  Table,
  TableBody
} from "@mui/material";
import { TableListFieldType } from "../../types/tms/common";
import { postRequest } from "@/utils/network/handlers";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import TableLogFilter from "@/components/filters/tableLogFilter";

const ListFields: TableListFieldType[] = [
  { label: "", key: "", type: "", visible: true },
  { label: "Төсөл", key: "project", type: "text", visible: true },
  { label: "Огноо", key: "changeDate", type: "datetime-local", visible: true },
  {
    label: "Объектын нэр(Table Name)",
    key: "fieldGuiText",
    type: "text",
    visible: true
  },
  {
    label: "Объектын ID",
    key: "objectId",
    type: "text",
    visible: true
  },
  {
    label: "Өөрчлөлтийн төрөл",
    key: "changeType",
    type: "choice",
    choices: [
      { value: "CHANGE_TYPE_INSERT", label: "Шинээр нэмсэн" },
      { value: "CHANGE_TYPE_UPDATE", label: "Зассан" },
      { value: "CHANGE_TYPE_DELETE", label: "Устгасан" }
    ],
    visible: true
  },
  {
    label: "Хэрэглэгчийн нэр",
    key: "username",
    type: "text",
    visible: true
  },
  {
    label: "Хэрэглэгчийн ID",
    key: "userID",
    type: "text",
    visible: true
  },
  {
    label: "Тайлбар",
    key: "description",
    type: "text",
    visible: true
  },
  {
    label: "BRC",
    key: "brc",
    type: "text",
    visible: true
  }
];

interface Filter {
  field: string;
  value: string;
  empty: string[];
  op?: string;
}

interface ChangeLog {
  project: string;
  changeDate: string;
  fieldGuiText: string;
  objectName: string;
  objectId: string;
  changeType: string;
  username: string;
  userID: string;
  description: string;
  brc: string;
  detail: { fieldGuiText: string; oldValue: string; newValue: string }[];
}

const changeType: Record<string, string> = {
  CHANGE_TYPE_INSERT: "Шинээр нэмсэн",
  CHANGE_TYPE_UPDATE: "Зассан",
  CHANGE_TYPE_DELETE: "Устгасан"
};
function ChangeLog() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState<{
    changeLogs: ChangeLog[];
    totalCount: number;
  } | null>(null);
  const [filters, setFilters] = useState<Filter[]>([
    {
      field: "",
      value: "",
      op: "",
      empty: []
    }
  ]);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [collapseOpen, setCollapseOpen] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>();
  useEffect(() => {
    const fetchData = async () => {
      let filter: { [key: string]: string } = {};
      let f = filters.filter((item) => item.value != "" && item.field != "");
      f.map((item: Filter) => {
        let key: string = item.field;
        const date = new Date(item.value);
        if (!isNaN(date.getTime())) {
          item.value = date.toISOString();
          key = item.field + item?.op?.split(" ")[1];
        }
        filter[key] = item.value;
      });
      let filterString = JSON.stringify(filter).replace(/"([^"]+)":/g, "$1:");
      try {
        const query = `query ChangeLogs {
                changeLogs(orderBy: "-changeDate", filter: ${filterString}, first: ${rowsPerPage}, offset: ${rowsPerPage * page}) {
                  totalCount
                  changeLogs {
                    project 
                    changeDate 
                    fieldGuiText  
                    objectName  
                    objectId  
                    changeType  
                    username  
                    userID  
                    description 
                    brc 
                    detail { fieldGuiText oldValue newValue }
                  }
                }
              }`;
        const data = {
          hdr: {
            query: query
          }
        };
        const response = await postRequest<{
          data: {
            changeLogs: { changeLogs: ChangeLog[]; totalCount: number };
          };
        }>("/event_log/list/", data);
        return response.ret.data;
      } catch (error) {
        console.error("Error making POST request:", error);
        throw new Error();
      }
    };
    setCollapseOpen(null);
    setLoading(true);
    fetchData().then((data) => {
      setData(data.changeLogs);
      setLoading(false);
    });
  }, [rowsPerPage, page, filters]);

  useEffect(() => {
    setPage(0);
  }, [filters]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rpp = parseInt(event.target.value);
    setPage(0);
    setRowsPerPage(rpp);
  };
  const onClickFilter = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterOpen(true);
    setAnchorEl(event.currentTarget);
  };

  return (
    <PageContainer title="Өөрчлөлтийн түүх" description="Өөрчлөлтийн түүх">
      <Box>
        <TableLogFilter
          open={filterOpen}
          setOpen={setFilterOpen}
          anchorEl={anchorEl}
          fields={ListFields}
          filters={filters}
          setFilters={setFilters}
        />
        <CustomTable
          totalCount={data?.totalCount ?? 0}
          parentTitle="Өөрчлөлтийн түүх"
          page={page}
          isLoading={loading}
          onClickFilter={onClickFilter}
          onPageChange={handleChangePage}
          fields={ListFields}
          rowsPerPage={rowsPerPage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        >
          {data?.changeLogs?.map((row: ChangeLog, index: number) => {
            return (
              <React.Fragment key={index}>
                <TableRow hover>
                  <TableCell>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => {
                        if (index == collapseOpen) setCollapseOpen(null);
                        else setCollapseOpen(index);
                      }}
                    >
                      {collapseOpen == index ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  {ListFields.map((item: TableListFieldType, key: number) =>
                    item.visible && item.key ? (
                      <TableCell key={key}>
                        <TypoToolTip
                          color="textSecondary"
                          fontSize={13}
                          fontWeight="500"
                        >
                          {(() => {
                            switch (item.key) {
                              case "fieldGuiText":
                                return `${String(row["fieldGuiText"])} (${row["objectName"]})`;
                              case "changeType":
                                return changeType[row.changeType];
                              default:
                                return row[item.key as keyof ChangeLog] !=
                                  undefined
                                  ? String(row[item.key as keyof ChangeLog])
                                  : "";
                            }
                          })()}
                        </TypoToolTip>
                      </TableCell>
                    ) : null
                  )}
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={12}
                  >
                    <Collapse
                      in={collapseOpen == index}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box margin={1}>
                        <Typography
                          gutterBottom
                          variant="h5"
                          sx={{
                            mt: 2,
                            backgroundColor: (theme) => theme.palette.grey.A200,
                            p: "5px 15px",
                            color: (theme) =>
                              `${
                                theme.palette.mode === "dark"
                                  ? theme.palette.grey.A200
                                  : "rgba(0, 0, 0, 0.87)"
                              }`
                          }}
                        >
                          Дэлгэрэнгүй
                        </Typography>
                        <Table size="small" aria-label="changes detail">
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                <Typography variant="h6">
                                  Талбарын нэр
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="h6">
                                  Хуучин утга
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="h6">Шинэ утга</Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {row.detail.map((item: any, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <Typography
                                    color="textSecondary"
                                    fontWeight="400"
                                  >
                                    {item.fieldGuiText}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    color="textSecondary"
                                    fontWeight="400"
                                  >
                                    {item.oldValue}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    color="textSecondary"
                                    fontWeight="400"
                                  >
                                    {item.newValue}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            );
          })}
        </CustomTable>
      </Box>
    </PageContainer>
  );
}

export default ChangeLog;
