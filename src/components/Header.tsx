import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Button,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useRole } from "../contexts/RoleContext";
import { roleNames } from "../utils/roleNames";

interface HeaderProps {
  onMenuClick: () => void;
  onDesktopMenuToggle?: () => void;
  desktopMenuOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  onDesktopMenuToggle,
  desktopMenuOpen,
}) => {
  const { selectedRole, clearRole } = useRole();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleChangeRole = (): void => {
    clearRole();
  };

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        {isMobile ? (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="toggle menu"
            onClick={onDesktopMenuToggle}
            sx={{ mr: 2 }}
          >
            {desktopMenuOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        )}
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
