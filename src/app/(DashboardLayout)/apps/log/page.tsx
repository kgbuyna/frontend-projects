"use client";

import PageContainer from "@/app/components/container/PageContainer";
import { TabContext, TabPanel } from "@mui/lab";
import { Tabs, Tab, Box } from "@mui/material";
import React from "react";
import Breadcrumb from "../../layout/shared/breadcrumb/Breadcrumb";
import RequestLog from "./requestLog";
import EventLog from "./eventLog";
import ChangeLog from "./changeLog";
import withAuth from "@/store/hooks/withAuth";

const BCrumb = [
  {
    to: "/",
    title: "Home"
  },
  {
    title: "Log"
  }
];

const LOG_TABS = [
  {
    value: "1",
    label: "API хүсэлтийн түүх"
  },
  {
    value: "2",
    label: "Хийсэн үйлдлийн түүх"
  },
  {
    value: "3",
    label: "Өөрчлөлтийн түүх"
  }
];
const Log = () => {
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <PageContainer title="Лог" description="Лог">
      <Breadcrumb title="Лог" items={BCrumb} />

      <TabContext value={value}>
        <Tabs value={value} onChange={handleChange} aria-label="log tabs">
          {LOG_TABS.map((tab, index) => (
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
            <RequestLog />
          </TabPanel>
          <TabPanel key={2} value="2">
            <EventLog />
          </TabPanel>
          <TabPanel key={3} value="3">
            <ChangeLog />
          </TabPanel>
        </Box>
      </TabContext>
    </PageContainer>
  );
};

export default withAuth(Log);
