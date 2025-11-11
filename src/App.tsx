import React from "react";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "jotai";
import theme from "./styles/theme";
import { RoleProvider, useRole } from "./contexts/RoleContext";
import RoleSelection from "./pages/RoleSelection";
import RoleBasedLayout from "./layouts/RoleBasedLayout";
import PatientDetailsPage from "./pages/PatientDetailsPage";

const AppContent: React.FC = () => {
  const { selectedRole } = useRole();

  return selectedRole ? <RoleBasedLayout /> : <RoleSelection />;
};

function App() {
  return (
    <Provider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <RoleProvider>
            <Routes>
              <Route path="/pacientes/:pacienteId" element={<PatientDetailsPage />} />
              <Route path="*" element={<AppContent />} />
            </Routes>
          </RoleProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
