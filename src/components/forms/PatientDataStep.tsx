import React from "react";
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import { PatientData } from "../../types/admission";

interface PatientDataStepProps {
  data: PatientData;
  onChange: (data: PatientData) => void;
}

const sexoOptions = [
  { value: "masculino", label: "Masculino" },
  { value: "femenino", label: "Femenino" },
  { value: "otro", label: "Otro" },
];

const estadoCivilOptions = [
  { value: "soltero", label: "Soltero" },
  { value: "casado", label: "Casado" },
  { value: "divorciado", label: "Divorciado" },
  { value: "viudo", label: "Viudo" },
  { value: "union_libre", label: "Unión Libre" },
];

const tipoSeguroOptions = [
  { value: "seguro_social", label: "Seguro Social" },
  { value: "seguro_privado", label: "Seguro Privado" },
  { value: "particular", label: "Particular" },
];

const PatientDataStep: React.FC<PatientDataStepProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof PatientData) => (
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
            select
            label="Estado Civil"
            value={data.estadoCivil}
            onChange={handleChange("estadoCivil")}
            required
          >
            {estadoCivilOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            select
            label="Tipo de Seguro"
            value={data.tipoSeguro}
            onChange={handleChange("tipoSeguro")}
            required
          >
            {tipoSeguroOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientDataStep;
