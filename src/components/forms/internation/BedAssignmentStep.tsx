import React from "react";
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import { BedAssignment } from "../../../types/internationProcess";

interface BedAssignmentStepProps {
  data: BedAssignment;
  onChange: (data: BedAssignment) => void;
}

const habitaciones = [
  "101",
  "102",
  "103",
  "104",
  "105",
  "201",
  "202",
  "203",
  "204",
  "205",
  "301",
  "302",
  "303",
  "304",
  "305",
];

const camas = ["1", "2", "3", "4"];

const BedAssignmentStep: React.FC<BedAssignmentStepProps> = ({
  data,
  onChange,
}) => {
  const handleChange = (field: keyof BedAssignment) => (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    onChange({
      ...data,
      [field]: event.target.value,
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Asignación de Cama
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Habitación"
            value={data.habitacion}
            onChange={handleChange("habitacion")}
            required
          >
            {habitaciones.map((habitacion) => (
              <MenuItem key={habitacion} value={habitacion}>
                Habitación {habitacion}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Cama"
            value={data.cama}
            onChange={handleChange("cama")}
            required
          >
            {camas.map((cama) => (
              <MenuItem key={cama} value={cama}>
                Cama {cama}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BedAssignmentStep;

