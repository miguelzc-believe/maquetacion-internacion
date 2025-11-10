import React from "react";
import {
  PersonAdd,
  Payment,
  LocalHospital,
  MedicalServices,
  AdminPanelSettings,
  Assignment,
  Receipt,
  People,
  CalendarToday,
  Settings,
  Assessment,
  Security,
  Hotel,
  Science,
  AccountBalanceWallet,
  Description,
  Calculate,
} from "@mui/icons-material";
import { MenuItem, UserRole } from "../types/role";

export const menuItemsByRole: Record<UserRole, MenuItem[]> = {
  recepcionista: [
    {
      id: "pacientes",
      label: "Pacientes",
      icon: React.createElement(People),
      path: "/pacientes",
    },
    {
      id: "citas",
      label: "Citas",
      icon: React.createElement(CalendarToday),
      path: "/citas",
    },
    {
      id: "registros",
      label: "Registros",
      icon: React.createElement(Assignment),
      path: "/registros",
    },
    {
      id: "internacion",
      label: "Internación",
      icon: React.createElement(LocalHospital),
      path: "/internacion",
    },
    {
      id: "ordenes-internacion",
      label: "Órdenes de Internación",
      icon: React.createElement(Description),
      path: "/ordenes-internacion",
    },
  ],
  cajero: [
    {
      id: "pagos",
      label: "Pagos",
      icon: React.createElement(Payment),
      path: "/pagos",
    },
    {
      id: "facturas",
      label: "Facturas",
      icon: React.createElement(Receipt),
      path: "/facturas",
    },
    {
      id: "reportes-caja",
      label: "Reportes de Caja",
      icon: React.createElement(Assessment),
      path: "/reportes-caja",
    },
  ],
  medico: [
    {
      id: "pacientes",
      label: "Pacientes",
      icon: React.createElement(People),
      path: "/pacientes",
    },
    {
      id: "citas",
      label: "Citas",
      icon: React.createElement(CalendarToday),
      path: "/citas",
    },
    {
      id: "internados",
      label: "Pacientes Internados",
      icon: React.createElement(Hotel),
      path: "/internados",
    },
    {
      id: "historiales",
      label: "Historiales Médicos",
      icon: React.createElement(LocalHospital),
      path: "/historiales",
    },
    {
      id: "diagnosticos",
      label: "Diagnósticos",
      icon: React.createElement(MedicalServices),
      path: "/diagnosticos",
    },
  ],
  enfermera: [
    {
      id: "pacientes",
      label: "Pacientes",
      icon: React.createElement(People),
      path: "/pacientes",
    },
    {
      id: "citas",
      label: "Citas",
      icon: React.createElement(CalendarToday),
      path: "/citas",
    },
    {
      id: "procedimientos",
      label: "Procedimientos",
      icon: React.createElement(MedicalServices),
      path: "/procedimientos",
    },
  ],
  administrador: [
    {
      id: "usuarios",
      label: "Usuarios",
      icon: React.createElement(People),
      path: "/usuarios",
    },
    {
      id: "reportes",
      label: "Reportes",
      icon: React.createElement(Assessment),
      path: "/reportes",
    },
    {
      id: "configuracion",
      label: "Configuración",
      icon: React.createElement(Settings),
      path: "/configuracion",
    },
    {
      id: "seguridad",
      label: "Seguridad",
      icon: React.createElement(Security),
      path: "/seguridad",
    },
  ],
  laboratorio: [
    {
      id: "analisis",
      label: "Análisis",
      icon: React.createElement(Science),
      path: "/analisis",
    },
    {
      id: "resultados",
      label: "Resultados",
      icon: React.createElement(Assignment),
      path: "/resultados",
    },
    {
      id: "estudios",
      label: "Estudios",
      icon: React.createElement(MedicalServices),
      path: "/estudios",
    },
    {
      id: "reportes-lab",
      label: "Reportes",
      icon: React.createElement(Assessment),
      path: "/reportes-lab",
    },
  ],
  presupuesto: [
    {
      id: "presupuestos",
      label: "Presupuestos",
      icon: React.createElement(AccountBalanceWallet),
      path: "/presupuestos",
    },
    {
      id: "costos",
      label: "Costos",
      icon: React.createElement(Calculate),
      path: "/costos",
    },
    {
      id: "cotizaciones",
      label: "Cotizaciones",
      icon: React.createElement(Description),
      path: "/cotizaciones",
    },
    {
      id: "reportes-pres",
      label: "Reportes",
      icon: React.createElement(Assessment),
      path: "/reportes-pres",
    },
  ],
};

export const getMenuItemsForRole = (role: UserRole): MenuItem[] => {
  return menuItemsByRole[role] || [];
};
