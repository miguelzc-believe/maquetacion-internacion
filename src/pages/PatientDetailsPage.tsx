import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Breadcrumbs,
  Link,
  Chip,
  Paper,
  Divider,
} from "@mui/material";
import { Home, ArrowBack } from "@mui/icons-material";
import { getPatientById } from "../utils/patients";
import { inpatients } from "../utils/inpatients";

const PatientDetailsPage: React.FC = () => {
  const { pacienteId } = useParams();
  const navigate = useNavigate();

  if (!pacienteId) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4">Error: ID de paciente no encontrado</Typography>
      </Container>
    );
  }

  const patient = getPatientById(pacienteId);
  const inpatient = inpatients.find((i) => i.pacienteId === pacienteId);

  if (!patient && !inpatient) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4">Paciente no encontrado</Typography>
      </Container>
    );
  }

  const fullName = patient
    ? `${patient.nombre} ${patient.apellidoPaterno} ${patient.apellidoMaterno}`
    : inpatient?.pacienteNombre ?? "Paciente";

  const diasInternado = inpatient
    ? Math.floor(
        (new Date().getTime() - new Date(inpatient.fechaIngreso).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  const getEstadoColor = (
    estado: string
  ): "success" | "warning" | "error" | "info" => {
    switch (estado) {
      case "estable":
        return "success";
      case "mejorando":
        return "info";
      case "grave":
      case "critico":
        return "error";
      default:
        return "warning";
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link
            component="button"
            variant="body1"
            onClick={() => navigate("/")}
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <Home sx={{ mr: 0.5 }} fontSize="inherit" />
            Inicio
          </Link>
          <Link
            component="button"
            variant="body1"
            onClick={() => navigate("/")}
            sx={{ cursor: "pointer" }}
          >
            Pacientes internados
          </Link>
          <Typography color="text.primary">{fullName}</Typography>
        </Breadcrumbs>

        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Link
            component="button"
            onClick={() => navigate(-1)}
            sx={{ display: "flex", alignItems: "center", mr: 2, cursor: "pointer" }}
          >
            <ArrowBack sx={{ mr: 1 }} />
            Volver
          </Link>
        </Box>

        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h4" component="h1">
              Detalles del Paciente
            </Typography>
            {inpatient ? (
              <Chip label={inpatient.estado} color={getEstadoColor(inpatient.estado)} />
            ) : null}
          </Box>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            {fullName}
          </Typography>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Información de Contacto
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Documento
                  </Typography>
                  <Typography variant="body1">{patient?.documento ?? "-"}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Teléfono
                  </Typography>
                  <Typography variant="body1">{patient?.telefono ?? "-"}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Estado de Internación
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {inpatient ? (
                  <>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Diagnóstico
                      </Typography>
                      <Typography variant="body1">{inpatient.diagnostico}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Días Internado
                      </Typography>
                      <Typography variant="body1">{diasInternado} días</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Habitación / Cama
                      </Typography>
                      <Typography variant="body1">
                        {inpatient.habitacion} - Cama {inpatient.cama}
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No se encuentra internado actualmente
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {inpatient ? (
            <>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Alergias
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    {inpatient.alergias.length > 0 ? (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {inpatient.alergias.map((alergia, index) => (
                          <Chip key={index} label={alergia} color="error" size="small" />
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No registra alergias
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Medicamentos
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    {inpatient.medicamentos.length > 0 ? (
                      <Box component="ul" sx={{ pl: 2, m: 0 }}>
                        {inpatient.medicamentos.map((medicamento, index) => (
                          <li key={index}>
                            <Typography variant="body1">{medicamento}</Typography>
                          </li>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No hay medicamentos registrados
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </>
          ) : null}
        </Grid>
      </Container>
    </Box>
  );
};

export default PatientDetailsPage;
