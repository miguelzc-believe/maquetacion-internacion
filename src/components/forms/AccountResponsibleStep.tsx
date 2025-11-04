import React from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { AccountResponsible } from "../../types/admission";

interface AccountResponsibleStepProps {
  data: AccountResponsible;
  onChange: (data: AccountResponsible) => void;
}

const AccountResponsibleStep: React.FC<AccountResponsibleStepProps> = ({
  data,
  onChange,
}) => {
  const handleChange = (field: keyof AccountResponsible) => (
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
        Responsable de la Cuenta
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
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Documento"
            value={data.documento}
            onChange={handleChange("documento")}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Lugar de Nacimiento"
            value={data.lugarNacimiento}
            onChange={handleChange("lugarNacimiento")}
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
      </Grid>
    </Box>
  );
};

export default AccountResponsibleStep;
