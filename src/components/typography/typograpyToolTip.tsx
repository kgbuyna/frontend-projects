import { Tooltip, Typography, TypographyProps } from "@mui/material";
import React from "react";

const TypoToolTip = (props: TypographyProps) => (
  <Tooltip title={props.children} arrow>
    <Typography
      sx={{
        display: "-webkit-box",
        overflow: "hidden",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: 2
        // textAlign: "center"
      }}
      variant="subtitle1"
      fontWeight="500"
      {...props}
    >
      {props.children}
    </Typography>
  </Tooltip>
);

export default TypoToolTip;
