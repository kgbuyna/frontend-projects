import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import StringFieldFilter from "@/components/filters/stringField";
import { Box } from "@mui/material";
import React from "react";

const LeftSection = () => {
  return (
    <Box display={"flex"} flexDirection={"row"}>
      <CustomTextField placeholder="Хайх..." />
      <Box display={"flex"} flexDirection={"row"} flexWrap="wrap">
        <StringFieldFilter />
        <StringFieldFilter />
        <StringFieldFilter />
        <StringFieldFilter />
        <StringFieldFilter />
      </Box>
    </Box>
  );
};

export default LeftSection;
