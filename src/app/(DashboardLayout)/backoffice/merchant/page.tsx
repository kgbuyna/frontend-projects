"use client";
import PageContainer from "@/app/components/container/PageContainer";
import StyledTableCell from "@/components/table/styledTableCell";
import CustomTable from "@/components/table/table";
import TypoToolTip from "@/components/typography/typograpyToolTip";
import withAuth from "@/store/hooks/withAuth";
import { gql, useQuery } from "@apollo/client";
import {
  TableRow
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import Breadcrumb from "../../layout/shared/breadcrumb/Breadcrumb";
import {
  MerchantEdge,
  MerchantType,
  Merchants
} from "../../types/apps/merhant";
import { TableListFieldType } from "../../types/tms/common";
import LeftSection from "./leftSection";

const MerchantListFields: TableListFieldType[] = [
  {
    label: "Мерчантын дугаар",
    key: "bankMerchantId",
    type: "text",
    filter: {
      isDefault: true,
      filterType: "string"
    },
    visible: true
  },
  {
    label: "Байгууллага/Иргэн нэр",
    key: "companyName",
    type: "text",
    visible: true,
    filter: {
      isDefault: true,
      filterType: "string"
    }
  },
  {
    label: "Регистрийн дугаар",
    key: "personRegisterNo",
    type: "text",
    visible: true
  },
  { label: "Утасны дугаар", key: "phone1", type: "text", visible: true },
  { label: "Гэрээний дугаар", key: "phone1", type: "text", visible: true }
];

const BCrumb = [
  {
    to: "/",
    title: "Home"
  },
  {
    title: "Merchant"
  }
];

const GET_ITEMS = gql`
  query Merchants($first: Int, $offset: Int) {
    merchants(first: $first, offset: $offset) {
      totalCount
      edgeCount
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
          status
          bankMerchantId
          merchantType
          merchantRating
          companyName
          companyNameShort
          companyStateCertificationNo
          companyRegisterNo
          companyType
          personFirstName
          personLastName
          personRegisterNo
          personNationality
          nameLatin
          businessType
          merchantBusinessStartedDate
          dailyCustomerNumber
          monthlyAverageRevenue
          phone1
          phone2
          phoneSms
          email
          address
          intlCardAllowed
          isBiggerMerchant
          imagePath
          tempAccount
          isShopCreated
          alipaySettlementAccount
          merchantFee
          feePercentage
          providerFee
          databankFee
          intlMerchantFee
          intlFeePercentage
          intlProviderFee
          intlDatabankFee
          dailyLimit
          oneTimeLimit
          intlDailyLimit
          intlOneTimeMaxLimit
          intlOneTimeMinLimit
          originalRequestId
          id
          sourceDisplay
          flagDisplay
        }
      }
    }
  }
`;

const Merchant = () => {
  const pathname = usePathname();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, loading } = useQuery<Merchants>(GET_ITEMS, {
    variables: { first: rowsPerPage, offset: rowsPerPage * page }
  });

  const items = data?.merchants?.edges.map((edge: MerchantEdge) => edge.node);

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
    <PageContainer title="КҮБ" description="КҮБ">
      <Breadcrumb title="КҮБ-ын жагсаалт" items={BCrumb} />
      <CustomTable
        page={page}
        leftSection={<LeftSection />}
        totalCount={data?.merchants.totalCount ?? 0}
        onPageChange={handleChangePage}
        fields={MerchantListFields}
        rowsPerPage={rowsPerPage}
        isLoading={loading}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      >
        {items?.map((row: MerchantType, index: number) => (
          <TableRow key={index} hover>
            <StyledTableCell>
              <TypoToolTip color="textSecondary" fontSize={13} fontWeight="500">
                {row.bankMerchantId}
              </TypoToolTip>
            </StyledTableCell>
            <StyledTableCell>
              <Link
                href={{
                  pathname: `${pathname}/details/${row.uuid}`
                }}
              >
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
                >
                  {row.merchantType == "ORGANIZATION"
                    ? row.companyName
                    : row.personLastName![0] + "." + row.personFirstName}
                </TypoToolTip>
              </Link>
            </StyledTableCell>
            <StyledTableCell>
              <TypoToolTip color="textSecondary" fontSize={13} fontWeight="500">
                {row.merchantType == "ORGANIZATION"
                  ? row.companyRegisterNo
                  : row.personRegisterNo}
              </TypoToolTip>
            </StyledTableCell>
            <StyledTableCell>
              <TypoToolTip color="textSecondary" fontSize={13} fontWeight="500">
                {row.phone1}
              </TypoToolTip>
            </StyledTableCell>
            <StyledTableCell>
              <TypoToolTip color="textSecondary" fontSize={13} fontWeight="500">
                {row.phone1}
              </TypoToolTip>
            </StyledTableCell>
          </TableRow>
        ))}
      </CustomTable>
    </PageContainer>
  );
};

export default withAuth(Merchant);
