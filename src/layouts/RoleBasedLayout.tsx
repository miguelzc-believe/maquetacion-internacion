import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useRole } from "../contexts/RoleContext";
import { getMenuItemsForRole } from "../utils/rolePermissions";
import { roleNames } from "../utils/roleNames";
import Header from "../components/Header";
import CardItem from "../components/CardItem";
import AdmissionForm from "../components/forms/AdmissionForm";
import AppointmentsPage from "../pages/AppointmentsPage";
import InpatientsPage from "../pages/InpatientsPage";
import OrdenesInternacionPage from "../pages/OrdenesInternacionPage";
import InpatientsNursingPage from "../pages/nursing/InpatientsNursingPage";
import VitalSignsPage from "../pages/nursing/VitalSignsPage";
import BalanceHidricoPage from "../pages/nursing/BalanceHidricoPage";
import MedicalOrdersNursingPage from "../pages/nursing/MedicalOrdersNursingPage";
import NursingNotesPage from "../pages/nursing/NursingNotesPage";
import MedicalOrdersDoctorPage from "../pages/doctor/MedicalOrdersDoctorPage";
import EvolutionNotesPage from "../pages/doctor/EvolutionNotesPage";
import EpicrisisAltaPage from "../pages/doctor/EpicrisisAltaPage";
import DeathCertificatePage from "../pages/doctor/DeathCertificatePage";
import PharmacyRequestsPage from "../pages/farmacia/PharmacyRequestsPage";
import PrepareMedicationsPage from "../pages/farmacia/PrepareMedicationsPage";
import ReturnsPage from "../pages/farmacia/ReturnsPage";
import LaboratoryRequestsPage from "../pages/laboratory/LaboratoryRequestsPage";
import CollectSamplePage from "../pages/laboratory/CollectSamplePage";
import ResultsPage from "../pages/laboratory/ResultsPage";
import ImagingRequestsPage from "../pages/imagenologia/ImagingRequestsPage";
import PerformStudyPage from "../pages/imagenologia/PerformStudyPage";
import ReportsPage from "../pages/imagenologia/ReportsPage";
import PatientsForDischargePage from "../pages/presupuesto/PatientsForDischargePage";
import AccountDetailsPage from "../pages/presupuesto/AccountDetailsPage";

const DRAWER_WIDTH = 240;

const RoleBasedLayout: React.FC = () => {
  const { selectedRole } = useRole();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState<string | null>(null);

  useEffect(() => {
    if (selectedRole === "medico" && selectedMenuItem === null) {
      setSelectedMenuItem("internados");
    }
  }, [selectedRole, selectedMenuItem]);

  if (!selectedRole) {
    return null;
  }

  const menuItems = getMenuItemsForRole(selectedRole);

  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen);
  };

  const handleDesktopDrawerToggle = (): void => {
    setDesktopOpen(!desktopOpen);
  };

  const handleMenuItemClick = (itemId: string): void => {
    setSelectedMenuItem(itemId);
  };

  const drawer = (
    <Box sx={{ p: desktopOpen ? 2 : 1 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: desktopOpen ? "flex-start" : "center",
          mb: 2,
          minHeight: 48,
        }}
      >
        {desktopOpen ? (
          <Typography variant="h6">{roleNames[selectedRole]}</Typography>
        ) : (
          <Typography variant="h6" sx={{ fontSize: "1rem" }}>
            {roleNames[selectedRole].charAt(0)}
          </Typography>
        )}
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={selectedMenuItem === item.id}
              onClick={() => handleMenuItemClick(item.id)}
              sx={{
                minHeight: 48,
                justifyContent: desktopOpen ? "flex-start" : "center",
                px: desktopOpen ? 2 : 1.5,
              }}
              title={desktopOpen ? undefined : item.label}
            >
              <ListItemIcon
                sx={{
                  minWidth: desktopOpen ? 40 : 0,
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {desktopOpen && <ListItemText primary={item.label} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const cardData: Array<{ title: string; description: string }> = [
    { title: "Tarjeta 1", description: "Descripción de la tarjeta 1" },
    { title: "Tarjeta 2", description: "Descripción de la tarjeta 2" },
    { title: "Tarjeta 3", description: "Descripción de la tarjeta 3" },
    { title: "Tarjeta 4", description: "Descripción de la tarjeta 4" },
    { title: "Tarjeta 5", description: "Descripción de la tarjeta 5" },
    { title: "Tarjeta 6", description: "Descripción de la tarjeta 6" },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header
        onMenuClick={handleDrawerToggle}
        onDesktopMenuToggle={handleDesktopDrawerToggle}
        desktopMenuOpen={desktopOpen}
      />
      <Box sx={{ display: "flex", flex: 1, mt: "64px" }}>
        <Box
          component="nav"
          sx={{
            width: { md: desktopOpen ? DRAWER_WIDTH : 64 },
            flexShrink: { md: 0 },
            transition: "width 0.3s ease",
          }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: DRAWER_WIDTH,
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: desktopOpen ? DRAWER_WIDTH : 64,
                transition: "width 0.3s ease",
                overflowX: "hidden",
                top: 64,
                height: "calc(100% - 64px)",
              },
            }}
            open={desktopOpen}
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: {
              md: desktopOpen
                ? `calc(100% - ${DRAWER_WIDTH}px)`
                : `calc(100% - 64px)`,
            },
            transition: "width 0.3s ease",
          }}
        >
          {selectedMenuItem === "internacion" ? (
            <AdmissionForm />
          ) : selectedMenuItem === "citas" ? (
            <AppointmentsPage />
          ) : selectedMenuItem === "internados" ? (
            <InpatientsPage />
          ) : selectedMenuItem === "ordenes-internacion" ? (
            <OrdenesInternacionPage />
          ) : selectedMenuItem === "pacientes-internados" ? (
            <InpatientsNursingPage />
          ) : selectedMenuItem === "signos-vitales" ? (
            <VitalSignsPage />
          ) : selectedMenuItem === "balance-hidrico" ? (
            <BalanceHidricoPage />
          ) : selectedMenuItem === "ordenes-medicas" && selectedRole === "enfermera" ? (
            <MedicalOrdersNursingPage />
          ) : selectedMenuItem === "notas-enfermeria" ? (
            <NursingNotesPage />
          ) : selectedMenuItem === "ordenes-medicas" && selectedRole === "medico" ? (
            <MedicalOrdersDoctorPage />
          ) : selectedMenuItem === "notas-evolucion" ? (
            <EvolutionNotesPage />
          ) : selectedMenuItem === "epicrisis-alta" ? (
            <EpicrisisAltaPage />
          ) : selectedMenuItem === "certificado-defuncion" ? (
            <DeathCertificatePage />
          ) : selectedMenuItem === "solicitudes-farmacia" ? (
            <PharmacyRequestsPage />
          ) : selectedMenuItem === "preparar-medicamentos" ? (
            <PrepareMedicationsPage />
          ) : selectedMenuItem === "devoluciones" ? (
            <ReturnsPage />
          ) : selectedMenuItem === "solicitudes-lab" ? (
            <LaboratoryRequestsPage />
          ) : selectedMenuItem === "recolectar-muestra" ? (
            <CollectSamplePage />
          ) : selectedMenuItem === "resultados" && selectedRole === "laboratorio" ? (
            <ResultsPage />
          ) : selectedMenuItem === "solicitudes-imagen" ? (
            <ImagingRequestsPage />
          ) : selectedMenuItem === "realizar-estudio" ? (
            <PerformStudyPage />
          ) : selectedMenuItem === "informes" ? (
            <ReportsPage />
          ) : selectedMenuItem === "pacientes-alta" ? (
            <PatientsForDischargePage />
          ) : selectedMenuItem === "detalles-cuenta" ? (
            <AccountDetailsPage />
          ) : (
            <Grid container spacing={3}>
              {cardData.map((card, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <CardItem title={card.title} description={card.description} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default RoleBasedLayout;
