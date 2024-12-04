"use client";
import React, { useEffect, useState } from "react";
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
  {
    label: "Sent/Recieved datetime",
    key: "requestDate",
    type: "datetime-local",
    visible: true
  },
  { label: "Action", key: "requestAction", type: "text", visible: true },
  {
    label: "Request URL",
    key: "requestUrl",
    type: "text",
    visible: true
  },
  {
    label: "Method",
    key: "requestMethod",
    type: "text",
    visible: true
  },
  {
    label: "Response Code",
    key: "responseCode",
    type: "text",
    visible: true
  },
  {
    label: "Response Status",
    key: "responseStatusCode",
    type: "text",
    visible: true
  },
  {
    label: "Duration",
    key: "duration",
    type: "text",
    visible: true
  },
  {
    label: "Remote Address",
    key: "remoteAddress",
    type: "text",
    visible: false
  },
  {
    label: "Response Date",
    key: "responseDate",
    type: "datetime-local",
    visible: false
  },
  {
    label: "Request Data",
    key: "requestData",
    type: "text",
    visible: false
  },
  {
    label: "Response Data",
    key: "responseData",
    type: "text",
    visible: false
  },
  {
    label: "Return Data",
    key: "returnData",
    type: "text",
    visible: false
  },
  {
    label: "Client Request Data",
    key: "clientRequestData",
    type: "text",
    visible: false
  },
  {
    label: "Exception",
    key: "exception",
    type: "text",
    visible: false
  },
  {
    label: "Created Date",
    key: "createdDate",
    type: "datetime-local",
    visible: false
  },
  {
    label: "Remote Backend ProviderId",
    key: "remoteBackendProviderId",
    type: "text",
    visible: false
  },
  {
    label: "Terminal Id",
    key: "terminalId",
    type: "text",
    visible: false
  },
  {
    label: "Card ProfileId",
    key: "cardProfileId",
    type: "text",
    visible: false
  },
  {
    label: "Card Profile Phone",
    key: "cardProfilePhone",
    type: "text",
    visible: false
  },
  {
    label: "Terminal Application",
    key: "terminalApplication",
    type: "text",
    visible: false
  },
  {
    label: "Operation Index",
    key: "operationIndex",
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

interface RequestLog {
  project: string;
  requestDate: Date;
  requestAction: string;
  requestUrl: string;
  requestMethod: string;
  responseCode: string;
  responseStatusCode: string;
  duration: string;
  remoteAddress: string;
  responseDate: Date;
  requestData: string;
  responseData: string;
  returnData: string;
  clientRequestData: string;
  exception: string;
  createdDate: Date;
  remoteBackendProviderId: string;
  terminalId: string;
  cardProfileId: string;
  cardProfilePhone: string;
  terminalApplication: string;
  operationIndex: string;
  [key: string]: string | Date;
}

const detailFields = [
  { label: "Remote address", key: "remoteAddress" },
  { label: "Response Date", key: "responseDate" },
  { label: "Request Data", key: "requestData" },
  { label: "Response Data", key: "responseData" },
  { label: "Return Data", key: "returnData" },
  { label: "Client request data", key: "clientRequestData" },
  { label: "Exception", key: "exception" },
  { label: "CreatedDate", key: "createdDate" },
  { label: "Remote Backend ProviderId", key: "remoteBackendProviderId" },
  { label: "TerminalId", key: "terminalId" },
  { label: "Card ProfileId", key: "cardProfileId" },
  { label: "Card Profile Phone", key: "cardProfilePhone" },
  { label: "Terminal Application", key: "terminalApplication" },
  { label: "Operation Index", key: "operationIndex" }
];

function RequestLog() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState<{
    requestLogs: RequestLog[];
    totalCount: number;
  } | null>(null);
  const [filters, setFilters] = useState<Filter[]>([
    {
      field: "",
      value: "",
      op: "1",
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

      let nonEmptyFilters = filters.filter(
        (item) => item.value != "" && item.field != ""
      );
      nonEmptyFilters.map((item: Filter) => {
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
        const query = `query RequestLogs {
                requestLogs(orderBy: "-requestDate", filter: ${filterString}, first: ${rowsPerPage}, offset: ${rowsPerPage * page}) {
                  totalCount
                  requestLogs {
                      project
                      requestDate
                      requestAction
                      requestUrl
                      requestMethod
                      responseCode
                      responseStatusCode
                      duration
                      remoteAddress
                      responseDate
                      requestData
                      responseData
                      returnData
                      clientRequestData
                      exception
                      createdDate
                      remoteBackendProviderId
                      terminalId
                      cardProfileId
                      cardProfilePhone
                      terminalApplication
                      operationIndex
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
            requestLogs: { requestLogs: RequestLog[]; totalCount: number };
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
      setData(data.requestLogs);
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
  const onClickFilter = (event: React.MouseEvent<HTMLElement>) => {
    setFilterOpen(true);
    setAnchorEl(event.currentTarget);
  };

  return (
    <PageContainer title="API хүсэлтийн түүх" description="API хүсэлтийн түүх">
      <Box>
        {/* fields */}
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
          parentTitle="API хүсэлтийн түүх"
          page={page}
          isLoading={loading}
          onClickFilter={onClickFilter}
          onPageChange={handleChangePage}
          fields={ListFields}
          rowsPerPage={rowsPerPage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        >
          {data?.requestLogs?.map((row: RequestLog, index: number) => {
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
                          {row[item.key as keyof RequestLog] != undefined
                            ? String(row[item.key as keyof RequestLog])
                            : ""}
                        </TypoToolTip>
                      </TableCell>
                    ) : null
                  )}
                </TableRow>

                <TableRow>
                  <TableCell
                    colSpan={12}
                    sx={{ paddingBottom: 0, paddingTop: 0 }}
                  >
                    <Collapse
                      in={collapseOpen == index}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box>
                        <Table>
                          <TableBody>
                            {detailFields.map(
                              (
                                field: { label: string; key: string },
                                index
                              ) => (
                                <TableRow key={index} hover>
                                  <TableCell>
                                    <Typography
                                      variant="body1"
                                      fontWeight="600"
                                      color="text.secondary"
                                    >
                                      {field.label}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      variant="subtitle1"
                                      sx={{ wordWrap: "break-word" }}
                                      mb={0.5}
                                    >
                                      {String(row?.[field.key]) || "-"}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              )
                            )}
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

export default RequestLog;
