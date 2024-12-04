"use client";
import React, { MouseEvent, useEffect, useState } from "react";
import PageContainer from "@/app/components/container/PageContainer";
import CustomTable from "@/components/table/table";
import TypoToolTip from "@/components/typography/typograpyToolTip";
import {
  Box,
  TableRow,
  TableCell,
  Grid,
  IconButton,
  Typography,
  Collapse
} from "@mui/material";
import { TableListFieldType } from "../../types/tms/common";
import { postRequest } from "@/utils/network/handlers";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import TableLogFilter from "@/components/filters/tableLogFilter";

const ListFields: TableListFieldType[] = [
  { label: "", key: "", type: "", visible: true },
  { label: "Төсөл", key: "project", type: "text", visible: true },
  { label: "Түлхүүр утга", key: "eventKey", type: "text", visible: true },
  { label: "Огноо", key: "eventTime", type: "datetime-local", visible: true },
  {
    label: "Түвшин",
    key: "msgLvl",
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
    label: "Хэрэглэгчийн ID",
    key: "userID",
    type: "text",
    visible: true
  },
  {
    label: "Хэрэглэгчийн нэр",
    key: "username",
    type: "text",
    visible: true
  },
  {
    label: "Модуль код",
    key: "moduleCode",
    type: "text",
    visible: false
  },
  {
    label: "Компаний ID",
    key: "companyID",
    type: "text",
    visible: false
  },
  {
    label: "BRC",
    key: "brc",
    type: "text",
    visible: false
  }
];

interface Filter {
  field: string;
  value: string;
  empty: string[];
  op?: string;
}

interface EventLog {
  project: string;
  eventTime: string;
  eventKey: string;
  msgLvl: string;
  userID: string;
  username: string;
  description: string;
  moduleCode: string;
  companyID: string;
  brc: string;
}

function EventLog() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState<{
    eventLogs: EventLog[];
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
  const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      let filter: { [key: string]: string } = {};
      let f = filters.filter((item) => item.value != "" && item.field != "");
      f.map((item: Filter) => {
        let key: string = item.field;
        const date = new Date(item.value);
        if (!isNaN(date.getTime())) {
          console.log("date");
          console.log(item.field + item.op);
          item.value = date.toISOString();
          key = item.field + item?.op?.split(" ")[1];
        }
        filter[key] = item.value;
      });
      let filterString = JSON.stringify(filter).replace(/"([^"]+)":/g, "$1:");
      try {
        const query = `query EventLogs {
                eventLogs(orderBy: "-eventTime", filter: ${filterString}, first: ${rowsPerPage}, offset: ${rowsPerPage * page}) {
                  totalCount
                  eventLogs {
                    project
                    eventTime
                    eventKey
                    msgLvl
                    userID
                    username
                    description
                    moduleCode
                    companyID
                    brc
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
            eventLogs: { eventLogs: EventLog[]; totalCount: number };
          };
        }>("/event_log/list/", data);
        return response.ret.data;
        // Process the response data here
      } catch (error) {
        console.error("Error making POST request:", error);
        throw new Error();
      }
    };

    setCollapseOpen(null);
    setLoading(true);
    fetchData().then((data) => {
      setData(data.eventLogs);
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
    <PageContainer
      title="Хийсэн үйлдлийн түүх"
      description="Хийсэн үйлдлийн түүх"
    >
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
          parentTitle="Хийсэн үйлдлийн түүх"
          page={page}
          isLoading={loading}
          onClickFilter={onClickFilter}
          onPageChange={handleChangePage}
          fields={ListFields}
          rowsPerPage={rowsPerPage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        >
          {data?.eventLogs?.map((row: EventLog, index: number) => {
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
                          {row[item.key as keyof EventLog] != undefined
                            ? String(row[item.key as keyof EventLog])
                            : ""}
                        </TypoToolTip>
                      </TableCell>
                    ) : null
                  )}
                </TableRow>

                <TableRow hover>
                  <TableCell
                    colSpan={12}
                    sx={{ paddingBottom: 0, paddingTop: 0 }}
                  >
                    <Collapse
                      in={collapseOpen == index}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Box>
                            <Typography
                              variant="body1"
                              fontWeight="600"
                              color="text.secondary"
                              textAlign={"center"}
                            >
                              Модуль код
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              sx={{ wordWrap: "break-word" }}
                              textAlign={"center"}
                            >
                              {row?.moduleCode || "-"}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={4}>
                          <Box>
                            <Typography
                              variant="body1"
                              fontWeight="600"
                              color="text.secondary"
                              textAlign={"center"}
                            >
                              Компаний ID
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              sx={{ wordWrap: "break-word" }}
                              textAlign={"center"}
                            >
                              {row?.companyID || "-"}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={4}>
                          <Box>
                            <Typography
                              variant="body1"
                              fontWeight="600"
                              color="text.secondary"
                              textAlign={"center"}
                            >
                              BRC
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              sx={{ wordWrap: "break-word" }}
                              textAlign={"center"}
                            >
                              {row?.brc || "-"}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
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

export default EventLog;
