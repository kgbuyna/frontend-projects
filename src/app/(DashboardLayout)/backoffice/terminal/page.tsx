"use client";
import { TableListFieldType } from "../../types/tms/common";
import React, { useState } from "react";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "../../layout/shared/breadcrumb/Breadcrumb";
import { gql, useQuery } from "@apollo/client";
import withAuth from "@/store/hooks/withAuth";
import {
  TerminalEdge,
  TerminalType,
  Terminals
} from "../../types/apps/terminal";
import { Button, TableCell, TableRow, Typography } from "@mui/material";
import CustomTable from "@/components/table/table";
import TypoToolTip from "@/components/typography/typograpyToolTip";
import RightSideDialog from "@/components/dialog/rightDialog";
import styled from "styled-components";

const MerchantListFields: TableListFieldType[] = [
  { label: "Нэр", key: "name", type: "text", visible: true },
  { label: "Терминал дугаар", key: "idBank", type: "text", visible: true },
  { label: "Гэрээний дугаар", key: "contractNo", type: "text", visible: true },
  { label: "TRC", key: "trc", type: "text", visible: true },
  {
    label: "Терминалийн төрөл",
    key: "terminalType",
    type: "text",
    visible: true
  },
  {
    label: "Connection Version",
    key: "dbConnectionVersion",
    type: "text",
    visible: true
  },
  {
    label: "Хувилбар",
    key: "applicationVersion",
    type: "text",
    visible: true
  },
  { label: "Төхөөрөмжийн SN", key: "readerId", type: "text", visible: true },
  {
    label: "Үүсгэсэн хэрэглэгч",
    key: "createdUserName",
    type: "text",
    visible: false
  },
  {
    label: "Сүүлд шинэчилсэн хэрэглэгч",
    key: "lastUpdatedUserName",
    type: "text",
    visible: false
  },
  { label: "Үүсгэсэн огноо", key: "createdDate", type: "text", visible: false },
  {
    label: "Сүүлд шинэчлэгдсэн огноо",
    key: "lastUpdatedDate",
    type: "number",
    visible: false
  },
  {
    label: "Сүүлд шинэчлэгдсэн хэрэглэгч",
    key: "lastUpdatedUserName",
    type: "text",
    visible: false
  },
  {
    label: "",
    key: "_edit",
    type: "edit",
    visible: false
  },
  {
    label: "Банк мерчант дугаар",
    key: "bankMerchantId",
    type: "text",
    visible: false
  },
  { label: "Аккаунт дугаар", key: "accountNo", type: "text", visible: false },
  { label: "ПИН", key: "pin", type: "text", visible: false },
  { label: "has Pin Entry", key: "hasPinEntry", type: "text", visible: false },
  { label: "Төлөв", key: "isActive", type: "text", visible: false },
  { label: "Блоклогдсон эсэх", key: "isBlocked", type: "text", visible: false },
  {
    label: "Блоклогдсон огноо",
    key: "blockedNote",
    type: "text",
    visible: false
  },
  { label: "log Level", key: "logLevel", type: "text", visible: false },
  { label: "agent Flag", key: "agentFlag", type: "text", visible: false },
  {
    label: "Үндсэн терминал",
    key: "parentTerminalId",
    type: "text",
    visible: false
  },

  { label: "mac Address", key: "macAddress", type: "text", visible: false },
  {
    label: "reserved Field1",
    key: "reservedField1",
    type: "text",
    visible: false
  },
  {
    label: "reserved Field2",
    key: "reservedField2",
    type: "text",
    visible: false
  },
  { label: "Хаяг", key: "address", type: "text", visible: false },
  { label: "gps Хаяг", key: "gps", type: "text", visible: false },
  { label: "sim Im si", key: "simImsi", type: "text", visible: false },

  { label: "pos Firmware", key: "posFirmware", type: "text", visible: false },
  {
    label: "Гэрээний хүсэлт",
    key: "registrationRequestId",
    type: "text",
    visible: false
  },
  { label: "Хүсэлтийн дугаар", key: "requestNo", type: "text", visible: false },
  {
    label: "source Display",
    key: "sourceDisplay",
    type: "text",
    visible: false
  },
  { label: "flag Display", key: "flagDisplay", type: "text", visible: false },
  {
    label: "Хяналт",
    key: "actions",
    type: "actions",
    actions: ["edit", "detail", "delete"],
    visible: false
  }
];

const BCrumb = [
  {
    to: "/",
    title: "Home"
  },
  {
    title: "Terminal"
  }
];

const GET_ITEMS = gql`
  query Terminals($first: Int, $offset: Int) {
    terminals(first: $first, offset: $offset) {
      totalCount
      edges {
        cursor
        node {
          flag
          uuid
          source
          createdDate
          createdUserName
          lastUpdatedDate
          lastUpdatedUserName
          name
          idBank
          bankMerchantId
          trc
          accountNo
          pin
          hasPinEntry
          isActive
          isBlocked
          blockedNote
          logLevel
          agentFlag
          parentTerminalId
          terminalType
          macAddress
          readerId
          reservedField1
          reservedField2
          address
          gps
          simImsi
          applicationVersion
          dbConnectionVersion
          posFirmware
          contractNo
          registrationRequestId
          requestNo
          id
          sourceDisplay
          flagDisplay
          productType {
            flag
            uuid
            source
            createdDate
            createdUserName
            lastUpdatedDate
            lastUpdatedUserName
            code
            name
            posType
            isActive
            isHome
            id
            sourceDisplay
            flagDisplay
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

// Styled components
const HoverTableCell = styled(TableCell)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  position: "relative",
  "& .hover-button": {
    visibility: "hidden"
  },
  "&:hover .hover-button": {
    visibility: "visible"
  },
  "&:hover .cell-text": {
    // marginRight: theme.spacing(8) // Adjust as needed to make space for the button
  }
}));

const Terminal = () => {
  // const [after, setAfter] = useState<string | null>(null); // Cursor for pagination
  const [open, setOpen] = useState<boolean>(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, loading } = useQuery<Terminals>(GET_ITEMS, {
    variables: { first: rowsPerPage, offset: rowsPerPage * page }
  });

  const items = data?.terminals?.edges.map((edge: TerminalEdge) => edge.node);
  console.log("data :>> ", data);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rpp = parseInt(event.target.value);
    setPage(0);
    setRowsPerPage(rpp);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  return (
    <PageContainer title="Терминал" description="Терминал">
      <Breadcrumb title="Терминал жагсаалт" items={BCrumb} />
      <CustomTable
        page={page}
        parentTitle="Terminal"
        totalCount={data?.terminals.totalCount ?? 0}
        onPageChange={handleChangePage}
        fields={MerchantListFields}
        rowsPerPage={rowsPerPage}
        isLoading={loading}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      >
        {items?.map((row: TerminalType, index: number) => (
          <TableRow key={index} hover>
            <HoverTableCell align="justify">
              <TypoToolTip>{row.name}</TypoToolTip>
              <Button
                onClick={() => setOpen(true)}
                className="hover-button"
                sx={{ margin: 0, padding: 0.1 }}
                color="secondary"
              >
                <Typography>Preview</Typography>
              </Button>
            </HoverTableCell>
            <TableCell>
              <TypoToolTip color="textSecondary" fontSize={13} fontWeight="500">
                {row.idBank}
              </TypoToolTip>
            </TableCell>
            <TableCell>
              <TypoToolTip color="textSecondary" fontSize={13} fontWeight="500">
                {row.contractNo}
              </TypoToolTip>
            </TableCell>
            <TableCell>
              <TypoToolTip color="textSecondary" fontSize={13} fontWeight="500">
                {row.trc}
              </TypoToolTip>
            </TableCell>
            <TableCell>
              <TypoToolTip color="textSecondary" fontSize={13} fontWeight="500">
                {row.terminalType}
              </TypoToolTip>
            </TableCell>
            <TableCell>
              <TypoToolTip color="textSecondary" fontSize={13} fontWeight="500">
                {row.dbConnectionVersion}
              </TypoToolTip>
            </TableCell>
            <TableCell>
              <TypoToolTip color="textSecondary" fontSize={13} fontWeight="500">
                {row.applicationVersion}
              </TypoToolTip>
            </TableCell>
            <TableCell>
              <TypoToolTip color="textSecondary" fontSize={13} fontWeight="500">
                {row.readerId}
              </TypoToolTip>
            </TableCell>
          </TableRow>
        ))}
      </CustomTable>
      <RightSideDialog
        title="Терминал"
        onClose={() => setOpen(false)}
        open={open}
      >
        <Typography>Hello world</Typography>
      </RightSideDialog>
    </PageContainer>
  );
};

export default withAuth(Terminal);
