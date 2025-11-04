import { ReactNode } from "react";

export type UserRole =
  | "recepcionista"
  | "cajero"
  | "medico"
  | "enfermera"
  | "administrador";

export interface RoleConfig {
  id: UserRole;
  name: string;
  description: string;
  icon: ReactNode;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: ReactNode;
  path: string;
}

export interface MenuPermission {
  role: UserRole;
  menuItems: MenuItem[];
}
