import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Grid,
  Divider,
} from "@mui/material";
import {
  LocalHospital,
  Person,
  CalendarToday,
  Assignment,
  Bed,
  Medication,
} from "@mui/icons-material";
import { Inpatient } from "../../types/inpatient";

interface InpatientCardProps {
  inpatient: Inpatient;
}

const statusColors: Record<string, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
  estable: "success",
  mejorando: "info",
  grave: "warning",
  critico: "error",
  alta: "default",
};

const InpatientCard: React.FC<InpatientCardProps> = ({ inpatient }) => {
  const navigate = useNavigate();
  const diasInternado = Math.floor(
    (new Date().getTime() - new Date(inpatient.fechaIngreso).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <Card
      elevation={3}
      sx={{
        height: "100%",
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 6,
        },
      }}
      onClick={() => navigate(`/pacientes/${inpatient.pacienteId}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/pacientes/${inpatient.pacienteId}`);
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocalHospital color="primary" />
            <Typography variant="h6" component="div">
              {inpatient.pacienteNombre}
            </Typography>
          </Box>
          <Chip
            label={inpatient.estado.toUpperCase()}
            color={statusColors[inpatient.estado]}
            size="small"
          />
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Person fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                Edad:
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {inpatient.edad} años
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <CalendarToday fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                Días internado:
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {diasInternado} días
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Assignment fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                Diagnóstico:
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {inpatient.diagnostico}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Bed fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                Habitación:
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {inpatient.habitacion} - Cama {inpatient.cama}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Médico responsable:
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {inpatient.medicoResponsable}
            </Typography>
          </Grid>
          {inpatient.alergias.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Alergias:
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {inpatient.alergias.map((alergia, index) => (
                  <Chip
                    key={index}
                    label={alergia}
                    color="error"
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>
          )}
          {inpatient.medicamentos.length > 0 && (
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "start", gap: 1 }}>
                <Medication fontSize="small" color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Medicamentos:
                  </Typography>
                  {inpatient.medicamentos.map((medicamento, index) => (
                    <Typography key={index} variant="caption" display="block">
                      • {medicamento}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Grid>
          )}
          {inpatient.observaciones && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Observaciones:
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                {inpatient.observaciones}
              </Typography>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default InpatientCard;
