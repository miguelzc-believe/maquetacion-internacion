import React from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { InsuranceData } from "../../types/admission";

interface InsuranceDataStepProps {
  data: InsuranceData;
  onChange: (data: InsuranceData) => void;
}

const InsuranceDataStep: React.FC<InsuranceDataStepProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof InsuranceData) => (
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
        Datos del Seguro
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Categoría"
            value={data.categoria}
            onChange={handleChange("categoria")}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Número de Matrícula"
            value={data.numeroMatricula}
            onChange={handleChange("numeroMatricula")}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Número de Carpeta"
            value={data.numeroCarpeta}
            onChange={handleChange("numeroCarpeta")}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Matrícula"
            value={data.matricula}
            onChange={handleChange("matricula")}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Empresa"
            value={data.empresa}
            onChange={handleChange("empresa")}
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
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nombre del Asegurado"
            value={data.nombreAsegurado}
            onChange={handleChange("nombreAsegurado")}
            required
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default InsuranceDataStep;
