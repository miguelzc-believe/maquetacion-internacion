import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Button,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { useRole } from "../contexts/RoleContext";

interface HeaderProps {
  onMenuClick: () => void;
}

const roleNames: Record<string, string> = {
  recepcionista: "Recepcionista",
  cajero: "Cajero",
  medico: "Médico",
  enfermera: "Enfermera",
  administrador: "Administrador",
};

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { selectedRole, clearRole } = useRole();

  const handleChangeRole = (): void => {
    clearRole();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>
        {selectedRole && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body1" component="span">
              {roleNames[selectedRole]}
            </Typography>
            <Button
              color="inherit"
              startIcon={<SwapHorizIcon />}
              onClick={handleChangeRole}
              aria-label="cambiar rol"
            >
              Cambiar Rol
            </Button>
          </Box>
        )}
        <Avatar sx={{ bgcolor: "secondary.main", ml: 2 }}>U</Avatar>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
