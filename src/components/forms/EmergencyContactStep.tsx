import React from "react";
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import { EmergencyContact } from "../../types/admission";

interface EmergencyContactStepProps {
  data: EmergencyContact;
  onChange: (data: EmergencyContact) => void;
}

const parentescoOptions = [
  { value: "padre", label: "Padre" },
  { value: "madre", label: "Madre" },
  { value: "hijo", label: "Hijo" },
  { value: "hija", label: "Hija" },
  { value: "hermano", label: "Hermano" },
  { value: "hermana", label: "Hermana" },
  { value: "esposo", label: "Esposo" },
  { value: "esposa", label: "Esposa" },
  { value: "tio", label: "Tío" },
  { value: "tia", label: "Tía" },
  { value: "abuelo", label: "Abuelo" },
  { value: "abuela", label: "Abuela" },
  { value: "otro", label: "Otro" },
];

const EmergencyContactStep: React.FC<EmergencyContactStepProps> = ({
  data,
  onChange,
}) => {
  const handleChange = (field: keyof EmergencyContact) => (
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
        Contacto de Emergencia
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nombre Completo"
            value={data.nombreCompleto}
            onChange={handleChange("nombreCompleto")}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Dirección"
            multiline
            rows={2}
            value={data.direccion}
            onChange={handleChange("direccion")}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Teléfono"
            type="tel"
            value={data.telefono}
            onChange={handleChange("telefono")}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={data.email}
            onChange={handleChange("email")}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Parentesco"
            value={data.parentesco}
            onChange={handleChange("parentesco")}
            required
          >
            {parentescoOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Teléfono de Emergencia"
            type="tel"
            value={data.telefonoEmergencia}
            onChange={handleChange("telefonoEmergencia")}
            required
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmergencyContactStep;
