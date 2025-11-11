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
  Medication,
  CameraAlt,
  Favorite,
  WaterDrop,
  Note,
  ExitToApp,
  Cancel,
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
      id: "internados",
      label: "Pacientes Internados",
      icon: React.createElement(Hotel),
      path: "/internados",
    },
    {
      id: "ordenes-medicas",
      label: "Órdenes Médicas",
      icon: React.createElement(Assignment),
      path: "/ordenes-medicas",
    },
    {
      id: "notas-evolucion",
      label: "Notas Evolución",
      icon: React.createElement(Note),
      path: "/notas-evolucion",
    },
    {
      id: "epicrisis-alta",
      label: "Epicrisis / Alta",
      icon: React.createElement(ExitToApp),
      path: "/epicrisis-alta",
    },
    {
      id: "certificado-defuncion",
      label: "Certificado Defunción",
      icon: React.createElement(Cancel),
      path: "/certificado-defuncion",
    },
  ],
  enfermera: [
    {
      id: "pacientes-internados",
      label: "Pacientes Internados",
      icon: React.createElement(Hotel),
      path: "/pacientes-internados",
    },
    {
      id: "signos-vitales",
      label: "Signos Vitales",
      icon: React.createElement(Favorite),
      path: "/signos-vitales",
    },
    {
      id: "balance-hidrico",
      label: "Balance Hídrico",
      icon: React.createElement(WaterDrop),
      path: "/balance-hidrico",
    },
    {
      id: "ordenes-medicas",
      label: "Órdenes Médicas",
      icon: React.createElement(Assignment),
      path: "/ordenes-medicas",
    },
    {
      id: "notas-enfermeria",
      label: "Notas Enfermería",
      icon: React.createElement(Note),
      path: "/notas-enfermeria",
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
      id: "solicitudes-lab",
      label: "Solicitudes Lab",
      icon: React.createElement(Assignment),
      path: "/solicitudes-lab",
    },
    {
      id: "recolectar-muestra",
      label: "Recolectar Muestra",
      icon: React.createElement(Science),
      path: "/recolectar-muestra",
    },
    {
      id: "resultados",
      label: "Resultados",
      icon: React.createElement(Assessment),
      path: "/resultados",
    },
  ],
  presupuesto: [
    {
      id: "pacientes-alta",
      label: "Pacientes para Alta",
      icon: React.createElement(People),
      path: "/pacientes-alta",
    },
    {
      id: "detalles-cuenta",
      label: "Detalles Cuenta",
      icon: React.createElement(AccountBalanceWallet),
      path: "/detalles-cuenta",
    },
  ],
  farmacia: [
    {
      id: "solicitudes-farmacia",
      label: "Solicitudes Descargo",
      icon: React.createElement(Assignment),
      path: "/solicitudes-farmacia",
    },
    {
      id: "preparar-medicamentos",
      label: "Preparar Medicamentos",
      icon: React.createElement(Medication),
      path: "/preparar-medicamentos",
    },
    {
      id: "devoluciones",
      label: "Devoluciones",
      icon: React.createElement(Receipt),
      path: "/devoluciones",
    },
  ],
  imagenologia: [
    {
      id: "solicitudes-imagen",
      label: "Solicitudes Estudios",
      icon: React.createElement(Assignment),
      path: "/solicitudes-imagen",
    },
    {
      id: "realizar-estudio",
      label: "Realizar Estudio",
      icon: React.createElement(CameraAlt),
      path: "/realizar-estudio",
    },
    {
      id: "informes",
      label: "Informes",
      icon: React.createElement(Description),
      path: "/informes",
    },
  ],
};

export const getMenuItemsForRole = (role: UserRole): MenuItem[] => {
  return menuItemsByRole[role] || [];
};

