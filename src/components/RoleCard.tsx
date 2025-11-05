import React from "react";
import { Card, CardContent, Typography, Box, CardActionArea } from "@mui/material";
import { RoleConfig } from "../types/role";

interface RoleCardProps {
  role: RoleConfig;
  onSelect: (roleId: string) => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ role, onSelect }) => {
  return (
    <Card>
      <CardActionArea
        onClick={() => onSelect(role.id)}
        sx={{ height: "100%" }}
        role="button"
        aria-label={`Seleccionar rol ${role.name}`}
        tabIndex={0}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              py: 2,
            }}
          >
            <Box
              sx={{
                fontSize: 64,
                color: "primary.main",
                mb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {role.icon}
            </Box>
            <Typography variant="h5" component="div" gutterBottom>
              {role.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {role.description}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default RoleCard;
