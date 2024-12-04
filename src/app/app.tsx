"use client";
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import RTL from "@/app/(DashboardLayout)/layout/shared/customizer/RTL";
import { ThemeSettings } from "@/utils/theme/Theme";
import { useSelector } from "react-redux";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { AppState } from "@/store/store";
import "@/utils/i18n";
import "@/app/api/index";
import { UserProvider } from "@/store/hooks/UserContext";
import { ApolloProvider } from "@apollo/client";
import { client } from "@/utils/network/main";

const MyApp = ({ children }: { children: React.ReactNode }) => {
  const theme = ThemeSettings();
  const customizer = useSelector((state: AppState) => state.customizer);

  return (
    <>
      <ApolloProvider client={client}>
        <UserProvider>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <ThemeProvider theme={theme}>
              <RTL direction={customizer.activeDir}>
                <CssBaseline />
                {children}
              </RTL>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </UserProvider>
      </ApolloProvider>
    </>
  );
};

export default MyApp;