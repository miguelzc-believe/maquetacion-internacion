import React, { useState } from "react";
import { Box, Drawer, Grid, Typography } from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CardItem from "../components/CardItem";

const DRAWER_WIDTH = 240;

const DashboardLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Menú
      </Typography>
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
      <Header onMenuClick={handleDrawerToggle} />
      <Box sx={{ display: "flex", flex: 1 }}>
        <Box
          component="nav"
          sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
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
                width: DRAWER_WIDTH,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          }}
        >
          <Grid container spacing={3}>
            {cardData.map((card, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <CardItem title={card.title} description={card.description} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default DashboardLayout;
