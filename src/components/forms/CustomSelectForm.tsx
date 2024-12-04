import React from "react";
import {
  Box,
  FormHelperText,
  Select,
  SelectProps,
  Typography
} from "@mui/material";

const CustomSelectForm = (props: SelectProps ) => {
  return (
    <>
      <Select {...props}>{props.children}</Select>
      {props.error ? (
        <FormHelperText sx={{ color: "error.main", marginBottom: 0 }}>
          <Typography
            component={"span"}
            fontSize={12}
            marginTop={"3px"}
            marginX={"14px"}
          >
            Энэ талбарыг бөглөх шаардлагатай.
          </Typography>
        </FormHelperText>
      ) : (
        <FormHelperText>
          <Typography
            fontSize={12}
            marginTop={"3px"}
            marginX={"14px"}
            component={"span"}
          >
            {/* Placeholder */}
          </Typography>
        </FormHelperText>
      )}
    </>
  );
};

export default CustomSelectForm;
