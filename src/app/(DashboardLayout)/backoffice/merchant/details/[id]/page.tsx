"use client";
import PageContainer from "@/app/components/container/PageContainer";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useParams } from "next/navigation";
import { ReactNode, useState } from "react";

import { TabContext, TabPanel } from "@mui/lab";
import {
  Button,
  Divider,
  Drawer,
  Paper,
  Tab,
  Tabs,
  useTheme
} from "@mui/material";
import { IconChevronDown, IconChevronLeft } from "@tabler/icons-react";
import Link from "next/link";

import { MerchantType } from "@/app/(DashboardLayout)/types/apps/merhant";
import withAuth from "@/store/hooks/withAuth";
import { gql, useQuery } from "@apollo/client";
import TerminalTable from "./terminalTable";
import Dict from "@/components/shared/dict";
import DetailCard from "@/components/shared/detailCard";
import { MerchantLocationType } from "@/app/(DashboardLayout)/types/apps/merchantLocation";

const GET_ITEM = gql`
  query Merchants($uuid: String!) {
    merchant(uuid: $uuid) {
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
      city {
        name
      }
      district {
        name
      }
      quarter {
        name
      }
    }
  }
`;

type Entry = {
  key: string;
  value: string;
  fullWidth?: boolean;
};

type DetailFields = {
  subTitle?: string;
  fields: (Entry | Entry[])[];
};

type StringKeyObject = {
  [key: string]: any;
};

const MerchantDetails: DetailFields[] = [
  {
    subTitle: "Үндсэн мэдээлэл",
    fields: [
      { key: "Мерчантын дугаар", value: "bankMerchantId" },
      { key: "Гэрээний дугаар", value: "contractNo" },
      { key: "Улсын бүртгэлийн дугаар", value: "register_no" },
      [
        { key: "Компанийн хэлбэр", value: "companyType" },
        { key: "Иргэншил", value: "personNationality" }
      ],
      { key: "Эзэмшигчийн зэрэглэл", value: "merchantRatingDisplay" }
    ]
  },
  {
    subTitle: "Холбогдох мэдээлэл",
    fields: [
      { key: "Утасны дугаар 1", value: "phone1" },
      { key: "Утасны дугаар 2", value: "phone2" },
      {
        key: "Мессеж илгээх утасны дугаар",
        value: "phoneSms",
        fullWidth: true
      },
      { key: "Имэйл хаяг", value: "email", fullWidth: true },
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

const TABS = [
  {
    value: "1",
    label: "Терминал"
  },
  {
    value: "2",
    label: "Гүйлгээ"
  },
  {
    value: "3",
    label: "Хүсэлт"
  },
  {
    value: "4",
    label: "Тикет"
  },
  {
    value: "5",
    label: "Хувь шимтгэлийн түүх"
  },
  {
    value: "6",
    label: "Лимит өөрчлөлтийн түүх"
  },
  {
    value: "7",
    label: "Нэмэлт тэмдэглэл"
  },
  {
    value: "8",
    label: "Хавсралт файл"
  }
];

const MerchantDetail = <T extends StringKeyObject>({
  detail,
  title,
  subtitle,
  action,
  data
}: CardDetailProps<T>) => {
  let el = 0;
  if (data?.merchantType?.toUpperCase() === "PERSON") {
    el = 1;
  }
  return (
    <Paper square elevation={24} variant="outlined" sx={{ p: 2 }}>
      <Box sx={{ height: "70px" }}>{action}</Box>
      <Box px={1}>
        <Typography variant="h5">{title}</Typography>
        <Typography sx={{ my: 1 }}>{subtitle}</Typography>
        <Divider />
        <Box>
          {detail.map((section, index) => {
            return (
              <Grid container columnSpacing={3} rowSpacing={3} key={index}>
                <Grid item lg={12} md={12} xs={12} sx={{ mt: 2, mb: 0.5 }}>
                  <Typography variant="h5">{section.subTitle}</Typography>
                </Grid>
                {section.fields.map((field, index) => {
                  if (!Array.isArray(field)) {
                    const value =
                      field.value
                        .split(".")
                        .reduce((acc, part) => acc && acc[part], data) || "-";
                    return (
                      <Grid
                        item
                        md={field.fullWidth ? 12 : 6}
                        xs={6}
                        key={index}
                      >
                        <Dict label={field.key} value={value.toString()} />
                      </Grid>
                    );
                  } else {
                    return (
                      <Grid item md={6} xs={6} key={index}>
                        <Dict
                          label={field[el].key}
                          value={data?.[field[el].value]?.toString() || "-"}
                        />
                      </Grid>
                    );
                  }
                })}
              </Grid>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
};
type CardDetailProps<T> = {
  detail: DetailFields[];
  title: string;
  subtitle: string;
  action: ReactNode;
  data: T | undefined;
};
const ProfileBanner = () => {
  const theme = useTheme();
  const { id } = useParams();
  const [valueTab, setValueTab] = useState("1");
  const { data } = useQuery<{ merchant: MerchantType }>(GET_ITEM, {
    variables: { uuid: id }
  });

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setValueTab(newValue);
  };

  return (
    <PageContainer title="КҮБ-ын дэлгэрэнгүй" description="КҮБ">
      <Grid container spacing={3}>
        <Grid item sm={12}></Grid>
        {/* Merchant Detail */}
        <Grid item md={3} sm={12} xs={12}>
          <MerchantDetail<MerchantType>
            title={
              data?.merchant?.companyName ||
              data?.merchant.personFirstName ||
              ""
            }
            subtitle={
              data?.merchant?.companyRegisterNo ||
              data?.merchant.personRegisterNo ||
              ""
            }
            detail={MerchantDetails}
            data={data?.merchant}
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
        </Grid>

        <Grid item md={9} sm={12} xs={12}>
          <TabContext value={valueTab}>
            <Tabs
              value={valueTab}
              onChange={handleChangeTab}
              aria-label="log tabs"
            >
              {TABS.map((tab, index) => (
                <Tab
                  sx={{ textTransform: "none" }}
                  key={index}
                  label={tab.label}
                  value={tab.value}
                />
              ))}
            </Tabs>
            <Box bgcolor="grey.200" mt={2}>
              <TabPanel key={1} value="1">
                <TerminalTable merchantId={data?.merchant?.id?.toString()} />
              </TabPanel>
              <TabPanel key={2} value="2">
                {/* <EventLog /> */}
              </TabPanel>
              <TabPanel key={3} value="3">
                {/* <ChangeLog /> */}
              </TabPanel>
            </Box>
          </TabContext>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default withAuth(ProfileBanner);
