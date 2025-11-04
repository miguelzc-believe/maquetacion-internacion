import React from "react";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import theme from "./styles/theme";
import { RoleProvider, useRole } from "./contexts/RoleContext";
import RoleSelection from "./pages/RoleSelection";
import RoleBasedLayout from "./layouts/RoleBasedLayout";

const AppContent: React.FC = () => {
  const { selectedRole } = useRole();

  return selectedRole ? <RoleBasedLayout /> : <RoleSelection />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RoleProvider>
        <AppContent />
      </RoleProvider>
    </ThemeProvider>
  );
}

export default App;
