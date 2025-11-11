import { UserRole } from "../types/role";

export const roleNames: Record<UserRole, string> = {
  recepcionista: "Recepcionista",
  cajero: "Cajero",
  medico: "Médico",
  enfermera: "Enfermera",
  administrador: "Administrador",
  laboratorio: "Laboratorio",
  presupuesto: "Presupuesto",
  farmacia: "Farmacia",
  imagenologia: "Imagenología",
};

export const getRoleName = (role: UserRole): string => {
  return roleNames[role] || role;
};
