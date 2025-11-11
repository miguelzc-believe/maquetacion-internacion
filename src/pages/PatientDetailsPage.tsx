import React, { useMemo, useState } from "react";
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
  Stack,
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import {
  Home,
  ArrowBack,
  Assignment,
  Notes,
  Description,
  HighlightOff,
  Add,
} from "@mui/icons-material";
import { getPatientById } from "../utils/patients";
import { inpatients } from "../utils/inpatients";
import { admissionOrders, createTemporaryOrder } from "../utils/admissionOrders";
import { AdmissionOrder } from "../types/admissionOrder";

type SectionKey = "ordenes" | "notas" | "epicrisis" | "defuncion";

const PatientDetailsPage: React.FC = () => {
  const { pacienteId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [selectedSection, setSelectedSection] = useState<SectionKey>("ordenes");

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

  const patientOrders: AdmissionOrder[] = useMemo(() => {
    const byId = admissionOrders.filter((o) => o.pacienteId === pacienteId);
    if (byId.length > 0) return byId;
    return admissionOrders.filter(
      (o) => o.pacienteNombre.toLowerCase() === fullName.toLowerCase()
    );
  }, [pacienteId, fullName]);

  const handleAddOrder = (): void => {
    const nombre = fullName;
    const pid = pacienteId;
    const medicoACargo = inpatient ? inpatient.medicoResponsable : "-";
    const diagnostico = inpatient ? inpatient.diagnostico : "-";
    const medicoSolicitante = medicoACargo;
    createTemporaryOrder(nombre, pid, medicoSolicitante, medicoACargo, diagnostico);
    navigate(0);
  };

  const renderSection = (): React.ReactNode => {
    if (selectedSection === "ordenes") {
      return (
        <Card>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6">Órdenes médicas</Typography>
              <Button variant="contained" startIcon={<Add />} onClick={handleAddOrder} aria-label="Agregar orden médica">
                Agregar orden
              </Button>
            </Stack>
            {patientOrders.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No hay órdenes médicas registradas
              </Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Diagnóstico</TableCell>
                    <TableCell>Médico solicitante</TableCell>
                    <TableCell>Médico a cargo</TableCell>
                    <TableCell>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patientOrders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>{order.fechaAgendamiento}</TableCell>
                      <TableCell>{order.diagnostico}</TableCell>
                      <TableCell>{order.medicoSolicitante}</TableCell>
                      <TableCell>{order.medicoACargo}</TableCell>
                      <TableCell>
                        {order.temporal ? (
                          <Chip label="Temporal" color="warning" size="small" />
                        ) : (
                          <Chip label="Definitiva" color="success" size="small" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      );
    }

    if (selectedSection === "notas") {
      return (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Notas de evolución
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sin notas cargadas. Próximamente formulario de registro.
            </Typography>
          </CardContent>
        </Card>
      );
    }

    if (selectedSection === "epicrisis") {
      return (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Epicrisis y alta
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sección para registrar epicrisis y alta.
            </Typography>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Certificado de defunción
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sección para emitir certificado de defunción.
          </Typography>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate("/")}
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <Home sx={{ mr: 0.5 }} fontSize="inherit" />
            Inicio
          </Link>
          <Link component="button" variant="body2" onClick={() => navigate("/")}
            sx={{ cursor: "pointer" }}>
            Pacientes internados
          </Link>
          <Typography color="text.primary" variant="body2">{fullName}</Typography>
        </Breadcrumbs>

        <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "flex-start", md: "center" }}>
            <Avatar sx={{ width: 56, height: 56 }} aria-label="avatar paciente">
              {fullName.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1, width: "100" }}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }}>
                <Box>
                  <Typography variant="h5" component="h1" sx={{ mb: 0.5 }}>
                    {fullName}
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    {patient?.documento ? (
                      <Typography variant="body2" color="text.secondary">Doc: {patient.documento}</Typography>
                    ) : null}
                    {inpatient ? (
                      <Typography variant="body2" color="text.secondary">Edad: {inpatient.edad} años</Typography>
                    ) : null}
                    {inpatient ? (
                      <Typography variant="body2" color="text.secondary">Días: {diasInternado ?? "-"}</Typography>
                    ) : null}
                    {inpatient ? (
                      <Typography variant="body2" color="text.secondary">Hab: {inpatient.habitacion} / Cama {inpatient.cama}</Typography>
                    ) : null}
                    {inpatient ? (
                      <Typography variant="body2" color="text.secondary">Médico: {inpatient.medicoResponsable}</Typography>
                    ) : null}
                  </Stack>
                </Box>
                {inpatient ? (
                  <Chip label={inpatient.estado} color={getEstadoColor(inpatient.estado)} size="small" />
                ) : null}
              </Stack>
              {inpatient ? (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Dx: {inpatient.diagnostico}
                </Typography>
              ) : null}
            </Box>
            <Link
              component="button"
              onClick={() => navigate(-1)}
              sx={{ display: "flex", alignItems: "center", whiteSpace: "nowrap" }}
            >
              <ArrowBack sx={{ mr: 1 }} />
              Volver
            </Link>
          </Stack>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Paper elevation={3} sx={{ p: 1 }}>
              <nav aria-label="Submenú paciente">
                <List>
                  <ListItem disablePadding>
                    <ListItemButton selected={selectedSection === "ordenes"} onClick={() => setSelectedSection("ordenes")} role="button">
                      <ListItemIcon>
                        <Assignment />
                      </ListItemIcon>
                      <ListItemText primary="Órdenes médicas" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton selected={selectedSection === "notas"} onClick={() => setSelectedSection("notas")} role="button">
                      <ListItemIcon>
                        <Notes />
                      </ListItemIcon>
                      <ListItemText primary="Notas de evolución" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton selected={selectedSection === "epicrisis"} onClick={() => setSelectedSection("epicrisis")} role="button">
                      <ListItemIcon>
                        <Description />
                      </ListItemIcon>
                      <ListItemText primary="Epicrisis y alta" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton selected={selectedSection === "defuncion"} onClick={() => setSelectedSection("defuncion")} role="button">
                      <ListItemIcon>
                        <HighlightOff />
                      </ListItemIcon>
                      <ListItemText primary="Certificado de defunción" />
                    </ListItemButton>
                  </ListItem>
                </List>
              </nav>
            </Paper>
          </Grid>

          <Grid item xs={12} md={9}>
            {renderSection()}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PatientDetailsPage;
