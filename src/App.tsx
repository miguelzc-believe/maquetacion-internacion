import React from "react";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import theme from "./styles/theme";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DashboardLayout />
    </ThemeProvider>
  );
}

export default App;
