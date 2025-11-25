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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Tabs,
  Tab,
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
import { useAtom } from "jotai";
import { getPatientById } from "../utils/patients";
import { inpatients } from "../utils/inpatients";
import { admissionOrders, createTemporaryOrder } from "../utils/admissionOrders";
import { AdmissionOrder } from "../types/admissionOrder";
import { medicalOrdersAtom, addMedicalOrderAtom } from "../stores/medicalOrdersStore";
import { evolutionNotesAtom, addEvolutionNoteAtom } from "../stores/evolutionNotesStore";
import { epicrisisAtom, addEpicrisisAtom } from "../stores/epicrisisStore";
import { deathCertificatesAtom, addDeathCertificateAtom } from "../stores/deathCertificateStore";
import { MedicalOrder, MedicationOrder, LaboratoryOrder, ImagingOrder } from "../types/medicalOrder";
import { EvolutionNote } from "../types/evolutionNote";
import { Epicrisis } from "../types/epicrisis";
import { DeathCertificate } from "../types/deathCertificate";
import { doctors } from "../utils/doctors";

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

  const MedicalOrdersSection: React.FC<{ pacienteId: string; pacienteNombre: string }> = ({ pacienteId, pacienteNombre }) => {
    const [orders] = useAtom(medicalOrdersAtom);
    const [, addOrder] = useAtom(addMedicalOrderAtom);
    const [open, setOpen] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [formData, setFormData] = useState<Partial<MedicalOrder>>({
      tipo: "medicamento",
      descripcion: "",
      prioridad: "normal",
    });

    const patientOrders = useMemo(() => {
      return orders.filter((order) => order.pacienteId === pacienteId);
    }, [orders, pacienteId]);

    const handleOpen = (): void => {
      setOpen(true);
    };

    const handleClose = (): void => {
      setOpen(false);
      setFormData({
        tipo: "medicamento",
        descripcion: "",
        prioridad: "normal",
      });
      setTabValue(0);
    };

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number): void => {
      setTabValue(newValue);
      const tipos: MedicalOrder["tipo"][] = ["medicamento", "laboratorio", "imagenologia"];
      setFormData({ ...formData, tipo: tipos[newValue] });
    };

    const handleSubmit = (): void => {
      if (!formData.descripcion) return;

      const doctor = doctors[0];
      const now = new Date();

      let newOrder: MedicalOrder;

      if (formData.tipo === "medicamento") {
        const medOrder = formData as Partial<MedicationOrder>;
        newOrder = {
          id: `mo-${Date.now()}`,
          pacienteId: pacienteId,
          pacienteNombre: pacienteNombre,
          tipo: "medicamento",
          descripcion: formData.descripcion,
          fechaCreacion: now.toISOString().split("T")[0],
          medicoId: doctor.id,
          medicoNombre: doctor.nombre,
          estado: "pendiente",
          prioridad: formData.prioridad || "normal",
          medicamento: medOrder.medicamento || "",
          dosis: medOrder.dosis || "",
          frecuencia: medOrder.frecuencia || "",
          via: medOrder.via || "",
          duracion: medOrder.duracion || "",
        } as MedicationOrder;
      } else if (formData.tipo === "laboratorio") {
        newOrder = {
          id: `mo-${Date.now()}`,
          pacienteId: pacienteId,
          pacienteNombre: pacienteNombre,
          tipo: "laboratorio",
          descripcion: formData.descripcion,
          fechaCreacion: now.toISOString().split("T")[0],
          medicoId: doctor.id,
          medicoNombre: doctor.nombre,
          estado: "pendiente",
          prioridad: formData.prioridad || "normal",
          estudio: (formData as Partial<LaboratoryOrder>).estudio || "",
        } as LaboratoryOrder;
      } else {
        newOrder = {
          id: `mo-${Date.now()}`,
          pacienteId: pacienteId,
          pacienteNombre: pacienteNombre,
          tipo: "imagenologia",
          descripcion: formData.descripcion,
          fechaCreacion: now.toISOString().split("T")[0],
          medicoId: doctor.id,
          medicoNombre: doctor.nombre,
          estado: "pendiente",
          prioridad: formData.prioridad || "normal",
          estudio: (formData as Partial<ImagingOrder>).estudio || "",
          region: (formData as Partial<ImagingOrder>).region || "",
        } as ImagingOrder;
      }

      addOrder(newOrder);
      handleClose();
    };

    const statusColors: Record<MedicalOrder["estado"], "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
      pendiente: "warning",
      en_proceso: "info",
      completada: "success",
      cancelada: "error",
    };

    return (
      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6">Órdenes médicas</Typography>
            <Button variant="contained" startIcon={<Add />} onClick={handleOpen} aria-label="Agregar orden médica">
              Nueva Orden
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
                  <TableCell>Tipo</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Prioridad</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patientOrders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>{new Date(order.fechaCreacion).toLocaleDateString("es-ES")}</TableCell>
                    <TableCell>
                      <Chip label={order.tipo} size="small" />
                    </TableCell>
                    <TableCell>{order.descripcion}</TableCell>
                    <TableCell>
                      <Chip label={order.prioridad} size="small" color={order.prioridad === "critica" ? "error" : order.prioridad === "urgente" ? "warning" : "default"} />
                    </TableCell>
                    <TableCell>
                      <Chip label={order.estado} color={statusColors[order.estado]} size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Crear Orden Médica</DialogTitle>
            <DialogContent dividers>
              <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                  <Tab label="Medicamento" />
                  <Tab label="Laboratorio" />
                  <Tab label="Imagenología" />
                </Tabs>
              </Box>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Prioridad"
                    value={formData.prioridad}
                    onChange={(e) =>
                      setFormData({ ...formData, prioridad: e.target.value as MedicalOrder["prioridad"] })
                    }
                  >
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="urgente">Urgente</MenuItem>
                    <MenuItem value="critica">Crítica</MenuItem>
                  </TextField>
                </Grid>

                {tabValue === 0 && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Medicamento"
                        value={(formData as Partial<MedicationOrder>).medicamento || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, medicamento: e.target.value } as Partial<MedicationOrder>)
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Dosis"
                        value={(formData as Partial<MedicationOrder>).dosis || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, dosis: e.target.value } as Partial<MedicationOrder>)
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Frecuencia"
                        value={(formData as Partial<MedicationOrder>).frecuencia || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, frecuencia: e.target.value } as Partial<MedicationOrder>)
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Vía"
                        value={(formData as Partial<MedicationOrder>).via || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, via: e.target.value } as Partial<MedicationOrder>)
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Duración"
                        value={(formData as Partial<MedicationOrder>).duracion || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, duracion: e.target.value } as Partial<MedicationOrder>)
                        }
                      />
                    </Grid>
                  </>
                )}

                {tabValue === 1 && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Estudio"
                      value={(formData as Partial<LaboratoryOrder>).estudio || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, estudio: e.target.value } as Partial<LaboratoryOrder>)
                      }
                    />
                  </Grid>
                )}

                {tabValue === 2 && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Estudio"
                        value={(formData as Partial<ImagingOrder>).estudio || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, estudio: e.target.value } as Partial<ImagingOrder>)
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Región"
                        value={(formData as Partial<ImagingOrder>).region || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, region: e.target.value } as Partial<ImagingOrder>)
                        }
                      />
                    </Grid>
                  </>
                )}

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descripción"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    multiline
                    rows={3}
                    required
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button onClick={handleSubmit} variant="contained" disabled={!formData.descripcion}>
                Crear Orden
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
    );
  };

  const EvolutionNotesSection: React.FC<{ pacienteId: string; pacienteNombre: string }> = ({ pacienteId, pacienteNombre }) => {
    const [notes] = useAtom(evolutionNotesAtom);
    const [, addNote] = useAtom(addEvolutionNoteAtom);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<EvolutionNote>>({
      sintomas: "",
      examenFisico: "",
      diagnostico: "",
      planTratamiento: "",
    });

    const patientNotes = useMemo(() => {
      return notes.filter((note) => note.pacienteId === pacienteId);
    }, [notes, pacienteId]);

    const handleOpen = (): void => {
      setOpen(true);
    };

    const handleClose = (): void => {
      setOpen(false);
      setFormData({
        sintomas: "",
        examenFisico: "",
        diagnostico: "",
        planTratamiento: "",
      });
    };

    const handleSubmit = (): void => {
      if (!formData.sintomas || !formData.examenFisico) return;

      const doctor = doctors[0];
      const now = new Date();

      const newNote: EvolutionNote = {
        id: `en-${Date.now()}`,
        pacienteId: pacienteId,
        pacienteNombre: pacienteNombre,
        fecha: now.toISOString().split("T")[0],
        medicoId: doctor.id,
        medicoNombre: doctor.nombre,
        sintomas: formData.sintomas || "",
        examenFisico: formData.examenFisico || "",
        diagnostico: formData.diagnostico || "",
        planTratamiento: formData.planTratamiento || "",
      };

      addNote(newNote);
      handleClose();
    };

    return (
      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6">Notas de evolución</Typography>
            <Button variant="contained" startIcon={<Add />} onClick={handleOpen} aria-label="Agregar nota de evolución">
              Nueva Nota
            </Button>
          </Stack>
          {patientNotes.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No hay notas de evolución registradas
            </Typography>
          ) : (
            <Stack spacing={2}>
              {patientNotes.map((note) => (
                <Paper key={note.id} elevation={1} sx={{ p: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {new Date(note.fecha).toLocaleDateString("es-ES")} - {note.medicoNombre}
                    </Typography>
                  </Stack>
                  <Divider sx={{ mb: 1 }} />
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Síntomas:</strong> {note.sintomas}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Examen Físico:</strong> {note.examenFisico}
                  </Typography>
                  {note.diagnostico && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Diagnóstico:</strong> {note.diagnostico}
                    </Typography>
                  )}
                  {note.planTratamiento && (
                    <Typography variant="body2">
                      <strong>Plan de Tratamiento:</strong> {note.planTratamiento}
                    </Typography>
                  )}
                </Paper>
              ))}
            </Stack>
          )}

          <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Nueva Nota de Evolución</DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Síntomas"
                    value={formData.sintomas}
                    onChange={(e) => setFormData({ ...formData, sintomas: e.target.value })}
                    multiline
                    rows={3}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Examen Físico"
                    value={formData.examenFisico}
                    onChange={(e) => setFormData({ ...formData, examenFisico: e.target.value })}
                    multiline
                    rows={3}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Diagnóstico"
                    value={formData.diagnostico}
                    onChange={(e) => setFormData({ ...formData, diagnostico: e.target.value })}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Plan de Tratamiento"
                    value={formData.planTratamiento}
                    onChange={(e) => setFormData({ ...formData, planTratamiento: e.target.value })}
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button onClick={handleSubmit} variant="contained" disabled={!formData.sintomas || !formData.examenFisico}>
                Guardar Nota
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
    );
  };

  const EpicrisisSection: React.FC<{ pacienteId: string; pacienteNombre: string }> = ({ pacienteId, pacienteNombre }) => {
    const [epicrisisList] = useAtom(epicrisisAtom);
    const [, addEpicrisis] = useAtom(addEpicrisisAtom);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<Epicrisis>>({
      motivoIngreso: "",
      diagnosticoIngreso: "",
      diagnosticoAlta: "",
      evolucion: "",
      procedimientosRealizados: [],
      medicamentosSuministrados: [],
      recomendaciones: "",
      tipoAlta: "alta_medica",
    });

    const patientEpicrisis = useMemo(() => {
      return epicrisisList.filter((ep) => ep.pacienteId === pacienteId);
    }, [epicrisisList, pacienteId]);

    const handleOpen = (): void => {
      if (inpatient) {
        setFormData({
          motivoIngreso: "",
          diagnosticoIngreso: inpatient.diagnostico,
          diagnosticoAlta: "",
          evolucion: "",
          procedimientosRealizados: [],
          medicamentosSuministrados: [],
          recomendaciones: "",
          tipoAlta: "alta_medica",
        });
      }
      setOpen(true);
    };

    const handleClose = (): void => {
      setOpen(false);
      setFormData({
        motivoIngreso: "",
        diagnosticoIngreso: "",
        diagnosticoAlta: "",
        evolucion: "",
        procedimientosRealizados: [],
        medicamentosSuministrados: [],
        recomendaciones: "",
        tipoAlta: "alta_medica",
      });
    };

    const handleSubmit = (): void => {
      if (!formData.motivoIngreso || !formData.diagnosticoIngreso) return;

      const doctor = doctors[0];
      const now = new Date();

      const newEpicrisis: Epicrisis = {
        id: `ep-${Date.now()}`,
        pacienteId: pacienteId,
        pacienteNombre: pacienteNombre,
        fechaIngreso: inpatient?.fechaIngreso || now.toISOString().split("T")[0],
        fechaAlta: now.toISOString().split("T")[0],
        medicoId: doctor.id,
        medicoNombre: doctor.nombre,
        motivoIngreso: formData.motivoIngreso || "",
        diagnosticoIngreso: formData.diagnosticoIngreso || "",
        diagnosticoAlta: formData.diagnosticoAlta || "",
        evolucion: formData.evolucion || "",
        procedimientosRealizados: formData.procedimientosRealizados || [],
        medicamentosSuministrados: formData.medicamentosSuministrados || [],
        recomendaciones: formData.recomendaciones || "",
        tipoAlta: formData.tipoAlta || "alta_medica",
      };

      addEpicrisis(newEpicrisis);
      handleClose();
    };

    return (
      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6">Epicrisis y alta</Typography>
            <Button variant="contained" startIcon={<Add />} onClick={handleOpen} aria-label="Registrar epicrisis">
              Registrar Epicrisis
            </Button>
          </Stack>
          {patientEpicrisis.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No hay epicrisis registradas
            </Typography>
          ) : (
            <Stack spacing={2}>
              {patientEpicrisis.map((ep) => (
                <Paper key={ep.id} elevation={1} sx={{ p: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Fecha Alta: {new Date(ep.fechaAlta).toLocaleDateString("es-ES")} - {ep.medicoNombre}
                    </Typography>
                    <Chip label={ep.tipoAlta} size="small" />
                  </Stack>
                  <Divider sx={{ mb: 1 }} />
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Motivo Ingreso:</strong> {ep.motivoIngreso}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Diagnóstico Ingreso:</strong> {ep.diagnosticoIngreso}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Diagnóstico Alta:</strong> {ep.diagnosticoAlta}
                  </Typography>
                  {ep.evolucion && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Evolución:</strong> {ep.evolucion}
                    </Typography>
                  )}
                  {ep.recomendaciones && (
                    <Typography variant="body2">
                      <strong>Recomendaciones:</strong> {ep.recomendaciones}
                    </Typography>
                  )}
                </Paper>
              ))}
            </Stack>
          )}

          <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Registrar Epicrisis y Alta</DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Tipo de Alta"
                    value={formData.tipoAlta}
                    onChange={(e) => setFormData({ ...formData, tipoAlta: e.target.value as Epicrisis["tipoAlta"] })}
                  >
                    <MenuItem value="alta_medica">Alta Médica</MenuItem>
                    <MenuItem value="alta_voluntaria">Alta Voluntaria</MenuItem>
                    <MenuItem value="traslado">Traslado</MenuItem>
                    <MenuItem value="defuncion">Defunción</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Motivo de Ingreso"
                    value={formData.motivoIngreso}
                    onChange={(e) => setFormData({ ...formData, motivoIngreso: e.target.value })}
                    multiline
                    rows={2}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Diagnóstico de Ingreso"
                    value={formData.diagnosticoIngreso}
                    onChange={(e) => setFormData({ ...formData, diagnosticoIngreso: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Diagnóstico de Alta"
                    value={formData.diagnosticoAlta}
                    onChange={(e) => setFormData({ ...formData, diagnosticoAlta: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Evolución"
                    value={formData.evolucion}
                    onChange={(e) => setFormData({ ...formData, evolucion: e.target.value })}
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Recomendaciones"
                    value={formData.recomendaciones}
                    onChange={(e) => setFormData({ ...formData, recomendaciones: e.target.value })}
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button onClick={handleSubmit} variant="contained" disabled={!formData.motivoIngreso || !formData.diagnosticoIngreso}>
                Registrar Epicrisis
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
    );
  };

  const DeathCertificateSection: React.FC<{ pacienteId: string; pacienteNombre: string }> = ({ pacienteId, pacienteNombre }) => {
    const [certificates] = useAtom(deathCertificatesAtom);
    const [, addCertificate] = useAtom(addDeathCertificateAtom);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<DeathCertificate>>({
      causaMuerte: "",
      lugarDefuncion: "",
    });

    const patientCertificates = useMemo(() => {
      return certificates.filter((cert) => cert.pacienteId === pacienteId);
    }, [certificates, pacienteId]);

    const handleOpen = (): void => {
      setOpen(true);
    };

    const handleClose = (): void => {
      setOpen(false);
      setFormData({
        causaMuerte: "",
        lugarDefuncion: "",
      });
    };

    const handleSubmit = (): void => {
      if (!formData.causaMuerte || !formData.lugarDefuncion) return;

      const doctor = doctors[0];
      const now = new Date();

      const newCertificate: DeathCertificate = {
        id: `dc-${Date.now()}`,
        pacienteId: pacienteId,
        pacienteNombre: pacienteNombre,
        fechaDefuncion: now.toISOString().split("T")[0],
        horaDefuncion: now.toTimeString().split(" ")[0].substring(0, 5),
        medicoId: doctor.id,
        medicoNombre: doctor.nombre,
        causaMuerte: formData.causaMuerte || "",
        lugarDefuncion: formData.lugarDefuncion || "",
      };

      addCertificate(newCertificate);
      handleClose();
    };

    return (
      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6">Certificado de defunción</Typography>
            <Button variant="contained" startIcon={<Add />} onClick={handleOpen} aria-label="Emitir certificado de defunción">
              Emitir Certificado
            </Button>
          </Stack>
          {patientCertificates.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No hay certificados de defunción registrados
            </Typography>
          ) : (
            <Stack spacing={2}>
              {patientCertificates.map((cert) => (
                <Paper key={cert.id} elevation={1} sx={{ p: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {new Date(cert.fechaDefuncion).toLocaleDateString("es-ES")} {cert.horaDefuncion} - {cert.medicoNombre}
                    </Typography>
                  </Stack>
                  <Divider sx={{ mb: 1 }} />
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Causa de Muerte:</strong> {cert.causaMuerte}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Lugar de Defunción:</strong> {cert.lugarDefuncion}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          )}

          <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Emitir Certificado de Defunción</DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Causa de Muerte"
                    value={formData.causaMuerte}
                    onChange={(e) => setFormData({ ...formData, causaMuerte: e.target.value })}
                    multiline
                    rows={3}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Lugar de Defunción"
                    value={formData.lugarDefuncion}
                    onChange={(e) => setFormData({ ...formData, lugarDefuncion: e.target.value })}
                    required
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button onClick={handleSubmit} variant="contained" disabled={!formData.causaMuerte || !formData.lugarDefuncion}>
                Emitir Certificado
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
    );
  };

  const renderSection = (): React.ReactNode => {
    if (selectedSection === "ordenes") {
      return <MedicalOrdersSection pacienteId={pacienteId} pacienteNombre={fullName} />;
    }

    if (selectedSection === "notas") {
      return <EvolutionNotesSection pacienteId={pacienteId} pacienteNombre={fullName} />;
    }

    if (selectedSection === "epicrisis") {
      return <EpicrisisSection pacienteId={pacienteId} pacienteNombre={fullName} />;
    }

    return <DeathCertificateSection pacienteId={pacienteId} pacienteNombre={fullName} />;
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
