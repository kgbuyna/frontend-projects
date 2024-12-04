import { Paper, Box, Typography, Divider, Grid } from "@mui/material";
import Dict from "./dict";
import { DetailFields } from "@/app/(DashboardLayout)/types/common";
import { ReactNode } from "react";

type StringKeyObject = {
  [key: string]: any;
};

type CardDetailProps<T> = {
  detail: DetailFields[];
  title: string;
  subtitle: string;
  action: ReactNode;
  data: T | undefined;
};

const DetailCard = <T extends StringKeyObject>({
  detail,
  title,
  subtitle,
  action,
  data
}: CardDetailProps<T>) => {
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
                  const value =
                    field.value
                      .split(".")
                      .reduce((acc, part) => acc && acc[part], data) || "-";
                  return (
                    <Grid item md={field.fullWidth ? 12 : 6} xs={6} key={index}>
                      <Dict label={field.key} value={value.toString()} />
                    </Grid>
                  );
                })}
              </Grid>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
};

export default DetailCard;
