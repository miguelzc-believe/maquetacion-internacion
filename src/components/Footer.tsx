import React from "react";
import { Box, Typography, Link, Stack } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: (theme) => theme.palette.background.paper,
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Stack spacing={2} alignItems="center">
        <Stack direction="row" spacing={2}>
          <Link href="#" color="text.secondary" underline="hover">
            Inicio
          </Link>
          <Link href="#" color="text.secondary" underline="hover">
            Acerca de
          </Link>
          <Link href="#" color="text.secondary" underline="hover">
            Contacto
          </Link>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Copyright © {new Date().getFullYear()} Layout App. Todos los derechos
          reservados.
        </Typography>
      </Stack>
    </Box>
  );
};

export default Footer;
