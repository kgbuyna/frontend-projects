"use client";
import Link from "next/link";
import { Grid, Box, Card, Stack, Typography } from "@mui/material";

// components
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import PageContainer from "@/app/components/container/PageContainer";
import AuthLogin from "../../authForms/AuthLogin";
import Image from "next/image";

export default function Login2() {
  return (
    <PageContainer title="Login Page" description="this is Sample page">
      <Box
        sx={{
          position: "relative",
          "&:before": {
            content: '""',
            background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
            position: "absolute",
            height: "100%",
            width: "100%",
            opacity: "0.3"
          }
        }}
      >
        <Grid
          container
          spacing={0}
          justifyContent="center"
          sx={{ height: "100vh" }}
        >
          <Grid
            item
            xs={12}
            sm={12}
            lg={5}
            xl={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card
              elevation={9}
              sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "450px" }}
            >
              <Box
                display="flex"
                width="200px"
                alignItems="center"
                justifyContent="center"
              >
                <Image
                  src={"/images/logos/databank_logo.png"}
                  alt="logo"
                  layout="responsive"
                  sizes="(max-width: 768px) 50vw, 33vw"
                  width={20}
                  height={20}
                />
              </Box>
              <AuthLogin />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}
