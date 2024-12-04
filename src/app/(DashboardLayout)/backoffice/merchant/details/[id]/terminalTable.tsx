"use client";
import {
  MerchantLocationEdge,
  MerchantLocations,
  MerchantLocationType
} from "@/app/(DashboardLayout)/types/apps/merchantLocation";
import {
  TerminalEdge,
  Terminals
} from "@/app/(DashboardLayout)/types/apps/terminal";
import { DetailFields } from "@/app/(DashboardLayout)/types/common";
import { TableListFieldType } from "@/app/(DashboardLayout)/types/tms/common";
import DetailCard from "@/components/shared/detailCard";
import CustomTable from "@/components/table/table";
import TypoToolTip from "@/components/typography/typograpyToolTip";
import theme from "@/utils/theme";
import { gql, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Drawer,
  Link,
  Stack,
  TableCell,
  TableRow,
  Typography
} from "@mui/material";
import { IconChevronLeft, IconChevronDown } from "@tabler/icons-react";
import { useEffect, useState } from "react";

const GET_ITEMS = gql`
  query Terminals($id: ID!, $first: Int, $offset: Int) {
    terminals(merchant: $id, first: $first, offset: $offset) {
      totalCount
      edges {
        node {
          uuid
          merchantLocation {
            uuid
            id
            name
          }
          name
          accountNo
          productType {
            name
          }
          trc
          applicationVersion
          bankMerchantId
          isActive
          isBlocked
          blockedNote
          logLevel
          agentFlag
          parentTerminalId
          terminalType
          sourceDisplay
          contractNo
          flagDisplay
        }
      }
    }
  }
`;

const GET_MERCHANT_LOCATION = gql`
  query MerchantLocation($id: String!) {
    merchantLocation(uuid: $id) {
      uuid
      name
      businessName
      status
      phone
      email
      accountNo
      bankAccountName
      employeeName
      employeePosition
      employeePhone
      financialEmployeeName
      financialEmployeePhone
      imagePath
      address
      gps
      bankAgentCode
      is98Config
      isPaperLocation
      merchantBusinessStartedDate
      dailyCustomerNumber
      monthlyAverageRevenue
      id
      sourceDisplay
      flagDisplay
      bankEmployee {
        id
        username
      }
      city {
        id
        name
      }
      district {
        id
        name
      }
      quarter {
        id
        name
      }
      supportGroup {
        id
        name
      }
    }
  }
`;
const ListFields: TableListFieldType[] = [
  {
    label: "Салбарын нэр",
    key: "merchantLocation.name",
    type: "text",
    filter: {
      isDefault: true,
      filterType: "string"
    },
    visible: true
  },
  {
    label: "Терминалын дугаар (нэр)",
    key: "name",
    type: "text",
    visible: true,
    filter: {
      isDefault: true,
      filterType: "string"
    }
  },
  {
    label: "Дансны дугаар",
    key: "personRegisterNo",
    type: "text",
    visible: true
  },
  {
    label: "Бүтээгдэхүүний төрөл",
    key: "productType.name",
    type: "text",
    visible: true
  },
  { label: "TRC", key: "trc", type: "text", visible: true },
  { label: "Сериал дугаар", key: "", type: "text", visible: true },
  {
    label: "Апп хувилбар",
    key: "applicationVersion",
    type: "text",
    visible: true
  },
  { label: "Холболт хийсэн эсэх", key: "", type: "text", visible: true }
];
const StyledTableCell = ({ children }: { children?: JSX.Element }) => (
  <TableCell sx={{ maxWidth: 200, overflow: "inherit", textOverflow: "clip" }}>
    {children}
  </TableCell>
);

interface Props {
  merchantId: string | undefined;
}

const MerchantDetails: DetailFields[] = [
  {
    subTitle: "Үндсэн мэдээлэл",
    fields: [{ key: "Дансны дугаар", value: "accountNo" }]
  },
  {
    subTitle: "Холбогдох мэдээлэл",
    fields: [
      { key: "Утасны дугаар", value: "phone" },
      {
        key: "И-мэйл хаяг",
        value: "email"
      },
      { key: "Аймаг, нийслэл", value: "city.name" },
      { key: "Сум, дүүрэг", value: "district.name" },
      { key: "Баг, хороо", value: "quarter.name", fullWidth: true },
      { key: "Хаяг, дэлгэрэнгүй", value: "address" }
    ]
  },
  {
    subTitle: "Бүртгэлийн мэдээлэл",
    fields: [
      {
        key: "ЗҮ хариуцсан ажилтан",
        value: "createdUserName",
        fullWidth: true
      },
      {
        key: "Санхүү хариуцсан ажилтан",
        value: "createdDate",
        fullWidth: true
      },
      {
        key: "Банк хариуцсан ажилтан",
        value: "lastUpdatedUserName"
      },
      {
        key: "Хэрэглэгчийн нэр",
        value: "lastUpdatedDate"
      },
      {
        key: "Сүүлд өөрчилсөн огноо",
        value: "lastUpdatedDate"
      },
      {
        key: "Сүүлд өөрчилсөн хэрэглэгч",
        value: "lastUpdatedUserName"
      },
      {
        key: "Сүүлд өөрчилсөн огноо",
        value: "lastUpdatedDate"
      }
    ]
  },
  {
    subTitle: "Үйл ажиллагааны мэдээлэл",
    fields: [
      {
        key: "Бүртгэсэн хэрэглэгч",
        value: "createdUserName"
      },
      {
        key: "Бүртгэсэн огноо",
        value: "createdDate"
      },
      {
        key: "Сүүлд өөрчилсөн хэрэглэгч",
        value: "lastUpdatedUserName"
      },
      {
        key: "Сүүлд өөрчилсөн огноо",
        value: "lastUpdatedDate"
      }
    ]
  }
];

const TerminalTable = ({ merchantId }: Props) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [merchantLocationId, setMerchantLocationId] = useState<string | null>(
    ""
  );

  const { data, loading } = useQuery<Terminals>(GET_ITEMS, {
    variables: {
      id: merchantId,
      first: rowsPerPage,
      offset: page * rowsPerPage
    },
    skip: !merchantId
  });

  const {
    data: merchantLocationData,
    fetchMore: fetchMoreMerchantLocation,
    loading: loadingMerchantLocation
  } = useQuery<MerchantLocationType>(GET_MERCHANT_LOCATION, {
    variables: {
      id: merchantLocationId
    },
    skip: !merchantLocationId
  });

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

  const items = data?.terminals?.edges.map((edge: TerminalEdge) => edge.node);

  const open = Boolean(merchantLocationId);

  return (
    <Box>
      <CustomTable
        totalCount={data?.terminals.totalCount ?? 0}
        page={page}
        isLoading={loading}
        onPageChange={handleChangePage}
        fields={ListFields}
        rowsPerPage={rowsPerPage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      >
        {items?.map((row, index) => (
          <TableRow key={index} hover>
            <StyledTableCell>
              <TypoToolTip
                color="textSecondary"
                fontSize={13}
                fontWeight="500"
                sx={{
                  ":hover": {
                    color: "primary.main",
                    cursor: "pointer"
                  }
                }}
                onClick={() => {
                  // setMerchantLocationId(row.merchantLocation.uuid);
                }}
              >
                {row.merchantLocation.name}
              </TypoToolTip>
            </StyledTableCell>
            <TableCell>
              <TypoToolTip>{row.name}</TypoToolTip>
            </TableCell>
            <TableCell>
              <TypoToolTip>{row.accountNo}</TypoToolTip>
            </TableCell>
            <TableCell>
              <TypoToolTip> {row.productType.name}</TypoToolTip>
            </TableCell>
            <TableCell>
              <TypoToolTip>{row.trc}</TypoToolTip>
            </TableCell>
            <TableCell>
              <TypoToolTip></TypoToolTip>
            </TableCell>
            <TableCell>
              <TypoToolTip>{row.applicationVersion}</TypoToolTip>
            </TableCell>
            <TableCell>
              <TypoToolTip></TypoToolTip>
            </TableCell>
          </TableRow>
        ))}
      </CustomTable>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => {
          setMerchantLocationId("");
        }}
      >
        <DetailCard<MerchantLocationType>
          title={merchantLocationData?.businessName || ""}
          subtitle={merchantLocationData?.status || ""}
          data={merchantLocationData}
          detail={MerchantDetails}
          action={
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Link
                style={{ color: "inherit", textDecoration: "inherit" }}
                href="/backoffice/merchant"
              >
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  flexDirection={"row"}
                  py={1}
                  px={0}
                  sx={{
                    "&:hover": {
                      color: theme.palette.primary.main
                    }
                  }}
                >
                  <IconChevronLeft size={24} stroke={1} />
                  <Typography variant="caption">КҮБ-ын жагсаалт</Typography>
                </Box>
              </Link>

              <Button
                variant=""
                disableElevation
                disableFocusRipple
                py={1}
                gap={0.5}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  "&:hover": {
                    color: theme.palette.primary.main
                  }
                }}
              >
                <Typography variant="caption">Үйлдэл</Typography>
                <IconChevronDown size={24} stroke={1} />
              </Button>
            </Stack>
          }
        />
      </Drawer>
    </Box>
  );
};

export default TerminalTable;
