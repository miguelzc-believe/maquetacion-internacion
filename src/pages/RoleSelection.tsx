import React from "react";
import { Box, Container, Grid, Typography, Paper } from "@mui/material";
import {
  PersonAdd,
  Payment,
  LocalHospital,
  MedicalServices,
  AdminPanelSettings,
  Science,
  AccountBalanceWallet,
} from "@mui/icons-material";
import { useRole } from "../contexts/RoleContext";
import { RoleConfig, UserRole } from "../types/role";
import RoleCard from "../components/RoleCard";

const availableRoles: RoleConfig[] = [
  {
    id: "recepcionista",
    name: "Recepcionista",
    description: "Gestión de pacientes y citas",
    icon: <PersonAdd />,
  },
  {
    id: "cajero",
    name: "Cajero",
    description: "Manejo de pagos y facturación",
    icon: <Payment />,
  },
  {
    id: "medico",
    name: "Médico",
    description: "Atención médica y diagnósticos",
    icon: <LocalHospital />,
  },
  {
    id: "enfermera",
    name: "Enfermera",
    description: "Atención y procedimientos",
    icon: <MedicalServices />,
  },
  {
    id: "administrador",
    name: "Administrador",
    description: "Gestión del sistema completo",
    icon: <AdminPanelSettings />,
  },
  {
    id: "laboratorio",
    name: "Laboratorio",
    description: "Análisis y estudios de laboratorio",
    icon: <Science />,
  },
  {
    id: "presupuesto",
    name: "Presupuesto",
    description: "Gestión de presupuestos y costos",
    icon: <AccountBalanceWallet />,
  },
];

const RoleSelection: React.FC = () => {
  const { setSelectedRole } = useRole();

  const validRoleIds: UserRole[] = [
    "recepcionista",
    "cajero",
    "medico",
    "enfermera",
    "administrador",
    "laboratorio",
    "presupuesto",
  ];

  const isValidRoleId = (roleId: string): roleId is UserRole => {
    return validRoleIds.includes(roleId as UserRole);
  };

  const handleRoleSelect = (roleId: string): void => {
    if (isValidRoleId(roleId)) {
      setSelectedRole(roleId);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.default",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom>
            Sistema Médico
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Seleccione su rol para continuar
          </Typography>
        </Paper>
        <Grid container spacing={3}>
          {availableRoles.map((role) => (
            <Grid item xs={12} sm={6} md={4} key={role.id}>
              <RoleCard role={role} onSelect={handleRoleSelect} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default RoleSelection;
