import React from "react";
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import { InternationPatientData } from "../../../types/internationProcess";

interface InternationPatientDataStepProps {
  data: InternationPatientData;
  onChange: (data: InternationPatientData) => void;
}

const sexoOptions = [
  { value: "masculino", label: "Masculino" },
  { value: "femenino", label: "Femenino" },
  { value: "otro", label: "Otro" },
];

const InternationPatientDataStep: React.FC<InternationPatientDataStepProps> = ({
  data,
  onChange,
}) => {
  const handleChange = (field: keyof InternationPatientData) => (
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
        Datos del Paciente
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Nombre"
            value={data.nombre}
            onChange={handleChange("nombre")}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Apellido Paterno"
            value={data.apellidoPaterno}
            onChange={handleChange("apellidoPaterno")}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Apellido Materno"
            value={data.apellidoMaterno}
            onChange={handleChange("apellidoMaterno")}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Fecha de Nacimiento"
            type="date"
            value={data.fechaNacimiento}
            onChange={handleChange("fechaNacimiento")}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Sexo"
            value={data.sexo}
            onChange={handleChange("sexo")}
            required
          >
            {sexoOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Documento de Identidad"
            value={data.documento}
            onChange={handleChange("documento")}
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
      </Grid>
    </Box>
  );
};

export default InternationPatientDataStep;

