import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserRole } from "../types/role";

interface RoleContextType {
  selectedRole: UserRole | null;
  setSelectedRole: (role: UserRole | null) => void;
  clearRole: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const STORAGE_KEY = "selectedRole";

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedRole, setSelectedRoleState] = useState<UserRole | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem(STORAGE_KEY);
    if (storedRole) {
      setSelectedRoleState(storedRole as UserRole);
    }
  }, []);

  const setSelectedRole = (role: UserRole | null): void => {
    if (role) {
      localStorage.setItem(STORAGE_KEY, role);
      setSelectedRoleState(role);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      setSelectedRoleState(null);
    }
  };

  const clearRole = (): void => {
    localStorage.removeItem(STORAGE_KEY);
    setSelectedRoleState(null);
  };

  return (
    <RoleContext.Provider value={{ selectedRole, setSelectedRole, clearRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};
