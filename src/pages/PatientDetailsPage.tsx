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
import { useRole } from "../contexts/RoleContext";
import { vitalSignsAtom, addVitalSignsAtom } from "../stores/vitalSignsStore";
import { fluidBalanceAtom, addFluidBalanceAtom } from "../stores/fluidBalanceStore";
import { nursingNotesAtom, addNursingNoteAtom } from "../stores/nursingNotesStore";
import { VitalSigns } from "../types/vitalSigns";
import { FluidBalance } from "../types/fluidBalance";
import { NursingNote } from "../types/nursingNote";
import { Favorite, WaterDrop } from "@mui/icons-material";

type SectionKey = "ordenes" | "notas" | "epicrisis" | "defuncion" | "signos-vitales" | "balance-hidrico" | "ordenes-medicas" | "notas-enfermeria";

const PatientDetailsPage: React.FC = () => {
  const { pacienteId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const { selectedRole } = useRole();
  const [selectedSection, setSelectedSection] = useState<SectionKey>(
    selectedRole === "enfermera" ? "signos-vitales" : "ordenes"
  );

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

  const VitalSignsSection: React.FC<{ pacienteId: string; pacienteNombre: string }> = ({ pacienteId, pacienteNombre }) => {
    const [vitalSigns] = useAtom(vitalSignsAtom);
    const [, addVitalSigns] = useAtom(addVitalSignsAtom);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<VitalSigns>>({
      temperatura: 0,
      presionArterialSistolica: 0,
      presionArterialDiastolica: 0,
      frecuenciaCardiaca: 0,
      frecuenciaRespiratoria: 0,
      saturacionOxigeno: 0,
      peso: 0,
      talla: 0,
    });

    const patientVitalSigns = useMemo(() => {
      return vitalSigns.filter((vs) => vs.pacienteId === pacienteId);
    }, [vitalSigns, pacienteId]);

    const handleOpen = (): void => {
      setOpen(true);
    };

    const handleClose = (): void => {
      setOpen(false);
      setFormData({
        temperatura: 0,
        presionArterialSistolica: 0,
        presionArterialDiastolica: 0,
        frecuenciaCardiaca: 0,
        frecuenciaRespiratoria: 0,
        saturacionOxigeno: 0,
        peso: 0,
        talla: 0,
      });
    };

    const handleSubmit = (): void => {
      const now = new Date();
      const newVitalSigns: VitalSigns = {
        id: `vs-${Date.now()}`,
        pacienteId: pacienteId,
        pacienteNombre: pacienteNombre,
        fecha: now.toISOString().split("T")[0],
        hora: now.toTimeString().split(" ")[0].substring(0, 5),
        temperatura: formData.temperatura || 0,
        presionArterialSistolica: formData.presionArterialSistolica || 0,
        presionArterialDiastolica: formData.presionArterialDiastolica || 0,
        frecuenciaCardiaca: formData.frecuenciaCardiaca || 0,
        frecuenciaRespiratoria: formData.frecuenciaRespiratoria || 0,
        saturacionOxigeno: formData.saturacionOxigeno || 0,
        peso: formData.peso || 0,
        talla: formData.talla || 0,
      };

      addVitalSigns(newVitalSigns);
      handleClose();
    };

    return (
      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6">Signos Vitales</Typography>
            <Button variant="contained" startIcon={<Add />} onClick={handleOpen} aria-label="Registrar signos vitales">
              Registrar Signos Vitales
            </Button>
          </Stack>
          {patientVitalSigns.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No hay signos vitales registrados
            </Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fecha/Hora</TableCell>
                  <TableCell>Temperatura</TableCell>
                  <TableCell>Presión Arterial</TableCell>
                  <TableCell>FC</TableCell>
                  <TableCell>FR</TableCell>
                  <TableCell>SpO2</TableCell>
                  <TableCell>Peso</TableCell>
                  <TableCell>Talla</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patientVitalSigns.map((vs) => (
                  <TableRow key={vs.id} hover>
                    <TableCell>
                      {new Date(vs.fecha).toLocaleDateString("es-ES")} {vs.hora}
                    </TableCell>
                    <TableCell>{vs.temperatura}°C</TableCell>
                    <TableCell>{vs.presionArterialSistolica}/{vs.presionArterialDiastolica} mmHg</TableCell>
                    <TableCell>{vs.frecuenciaCardiaca} lpm</TableCell>
                    <TableCell>{vs.frecuenciaRespiratoria} rpm</TableCell>
                    <TableCell>{vs.saturacionOxigeno}%</TableCell>
                    <TableCell>{vs.peso} kg</TableCell>
                    <TableCell>{vs.talla} cm</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Registrar Signos Vitales</DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Temperatura (°C)"
                    type="number"
                    value={formData.temperatura || ""}
                    onChange={(e) => setFormData({ ...formData, temperatura: parseFloat(e.target.value) || 0 })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Presión Arterial Sistólica (mmHg)"
                    type="number"
                    value={formData.presionArterialSistolica || ""}
                    onChange={(e) => setFormData({ ...formData, presionArterialSistolica: parseFloat(e.target.value) || 0 })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Presión Arterial Diastólica (mmHg)"
                    type="number"
                    value={formData.presionArterialDiastolica || ""}
                    onChange={(e) => setFormData({ ...formData, presionArterialDiastolica: parseFloat(e.target.value) || 0 })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Frecuencia Cardiaca (lpm)"
                    type="number"
                    value={formData.frecuenciaCardiaca || ""}
                    onChange={(e) => setFormData({ ...formData, frecuenciaCardiaca: parseFloat(e.target.value) || 0 })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Frecuencia Respiratoria (rpm)"
                    type="number"
                    value={formData.frecuenciaRespiratoria || ""}
                    onChange={(e) => setFormData({ ...formData, frecuenciaRespiratoria: parseFloat(e.target.value) || 0 })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Saturación de Oxígeno (%)"
                    type="number"
                    value={formData.saturacionOxigeno || ""}
                    onChange={(e) => setFormData({ ...formData, saturacionOxigeno: parseFloat(e.target.value) || 0 })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Peso (kg)"
                    type="number"
                    value={formData.peso || ""}
                    onChange={(e) => setFormData({ ...formData, peso: parseFloat(e.target.value) || 0 })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Talla (cm)"
                    type="number"
                    value={formData.talla || ""}
                    onChange={(e) => setFormData({ ...formData, talla: parseFloat(e.target.value) || 0 })}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button onClick={handleSubmit} variant="contained">
                Guardar
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
    );
  };

  const FluidBalanceSection: React.FC<{ pacienteId: string; pacienteNombre: string }> = ({ pacienteId, pacienteNombre }) => {
    const [fluidBalances] = useAtom(fluidBalanceAtom);
    const [, addFluidBalance] = useAtom(addFluidBalanceAtom);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<FluidBalance>>({
      ingresos: {
        viaOral: 0,
        viaVenosa: 0,
        otros: 0,
        total: 0,
      },
      egresos: {
        orina: 0,
        heces: 0,
        vomito: 0,
        drenajes: 0,
        otros: 0,
        total: 0,
      },
      balance: 0,
    });

    const patientFluidBalances = useMemo(() => {
      return fluidBalances.filter((fb) => fb.pacienteId === pacienteId);
    }, [fluidBalances, pacienteId]);

    const handleOpen = (): void => {
      setOpen(true);
    };

    const handleClose = (): void => {
      setOpen(false);
      setFormData({
        ingresos: {
          viaOral: 0,
          viaVenosa: 0,
          otros: 0,
          total: 0,
        },
        egresos: {
          orina: 0,
          heces: 0,
          vomito: 0,
          drenajes: 0,
          otros: 0,
          total: 0,
        },
        balance: 0,
      });
    };

    const calculateTotals = (): void => {
      const ingresosTotal = (formData.ingresos?.viaOral || 0) + (formData.ingresos?.viaVenosa || 0) + (formData.ingresos?.otros || 0);
      const egresosTotal = (formData.egresos?.orina || 0) + (formData.egresos?.heces || 0) + (formData.egresos?.vomito || 0) + (formData.egresos?.drenajes || 0) + (formData.egresos?.otros || 0);
      const balance = ingresosTotal - egresosTotal;

      setFormData({
        ...formData,
        ingresos: {
          ...formData.ingresos!,
          total: ingresosTotal,
        },
        egresos: {
          ...formData.egresos!,
          total: egresosTotal,
        },
        balance,
      });
    };

    const handleSubmit = (): void => {
      calculateTotals();
      const now = new Date();
      const newFluidBalance: FluidBalance = {
        id: `fb-${Date.now()}`,
        pacienteId: pacienteId,
        pacienteNombre: pacienteNombre,
        fecha: now.toISOString().split("T")[0],
        hora: now.toTimeString().split(" ")[0].substring(0, 5),
        ingresos: formData.ingresos || {
          viaOral: 0,
          viaVenosa: 0,
          otros: 0,
          total: 0,
        },
        egresos: formData.egresos || {
          orina: 0,
          heces: 0,
          vomito: 0,
          drenajes: 0,
          otros: 0,
          total: 0,
        },
        balance: formData.balance || 0,
      };

      addFluidBalance(newFluidBalance);
      handleClose();
    };

    return (
      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6">Balance Hídrico</Typography>
            <Button variant="contained" startIcon={<Add />} onClick={handleOpen} aria-label="Registrar balance hídrico">
              Registrar Balance
            </Button>
          </Stack>
          {patientFluidBalances.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No hay registros de balance hídrico
            </Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fecha/Hora</TableCell>
                  <TableCell>Ingresos Total</TableCell>
                  <TableCell>Egresos Total</TableCell>
                  <TableCell>Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patientFluidBalances.map((fb) => (
                  <TableRow key={fb.id} hover>
                    <TableCell>
                      {new Date(fb.fecha).toLocaleDateString("es-ES")} {fb.hora}
                    </TableCell>
                    <TableCell>{fb.ingresos.total} ml</TableCell>
                    <TableCell>{fb.egresos.total} ml</TableCell>
                    <TableCell>
                      <Chip
                        label={`${fb.balance > 0 ? "+" : ""}${fb.balance} ml`}
                        color={fb.balance > 0 ? "success" : fb.balance < 0 ? "error" : "default"}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Registrar Balance Hídrico</DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Ingresos (ml)
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Vía Oral"
                    type="number"
                    value={formData.ingresos?.viaOral || ""}
                    onChange={(e) => {
                      const newIngresos = { ...formData.ingresos!, viaOral: parseFloat(e.target.value) || 0 };
                      setFormData({ ...formData, ingresos: newIngresos });
                      setTimeout(calculateTotals, 0);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Vía Venosa"
                    type="number"
                    value={formData.ingresos?.viaVenosa || ""}
                    onChange={(e) => {
                      const newIngresos = { ...formData.ingresos!, viaVenosa: parseFloat(e.target.value) || 0 };
                      setFormData({ ...formData, ingresos: newIngresos });
                      setTimeout(calculateTotals, 0);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Otros"
                    type="number"
                    value={formData.ingresos?.otros || ""}
                    onChange={(e) => {
                      const newIngresos = { ...formData.ingresos!, otros: parseFloat(e.target.value) || 0 };
                      setFormData({ ...formData, ingresos: newIngresos });
                      setTimeout(calculateTotals, 0);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Egresos (ml)
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Orina"
                    type="number"
                    value={formData.egresos?.orina || ""}
                    onChange={(e) => {
                      const newEgresos = { ...formData.egresos!, orina: parseFloat(e.target.value) || 0 };
                      setFormData({ ...formData, egresos: newEgresos });
                      setTimeout(calculateTotals, 0);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Heces"
                    type="number"
                    value={formData.egresos?.heces || ""}
                    onChange={(e) => {
                      const newEgresos = { ...formData.egresos!, heces: parseFloat(e.target.value) || 0 };
                      setFormData({ ...formData, egresos: newEgresos });
                      setTimeout(calculateTotals, 0);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Vómito"
                    type="number"
                    value={formData.egresos?.vomito || ""}
                    onChange={(e) => {
                      const newEgresos = { ...formData.egresos!, vomito: parseFloat(e.target.value) || 0 };
                      setFormData({ ...formData, egresos: newEgresos });
                      setTimeout(calculateTotals, 0);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Drenajes"
                    type="number"
                    value={formData.egresos?.drenajes || ""}
                    onChange={(e) => {
                      const newEgresos = { ...formData.egresos!, drenajes: parseFloat(e.target.value) || 0 };
                      setFormData({ ...formData, egresos: newEgresos });
                      setTimeout(calculateTotals, 0);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Otros"
                    type="number"
                    value={formData.egresos?.otros || ""}
                    onChange={(e) => {
                      const newEgresos = { ...formData.egresos!, otros: parseFloat(e.target.value) || 0 };
                      setFormData({ ...formData, egresos: newEgresos });
                      setTimeout(calculateTotals, 0);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2">
                    <strong>Total Ingresos:</strong> {formData.ingresos?.total || 0} ml
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2">
                    <strong>Total Egresos:</strong> {formData.egresos?.total || 0} ml
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2">
                    <strong>Balance:</strong> {formData.balance || 0} ml
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button onClick={handleSubmit} variant="contained">
                Guardar
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
    );
  };

  const MedicalOrdersNursingSection: React.FC<{ pacienteId: string; pacienteNombre: string }> = ({ pacienteId, pacienteNombre }) => {
    const [orders] = useAtom(medicalOrdersAtom);

    const patientOrders = useMemo(() => {
      return orders.filter((order) => order.pacienteId === pacienteId && order.estado !== "completada" && order.estado !== "cancelada");
    }, [orders, pacienteId]);

    const statusColors: Record<MedicalOrder["estado"], "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
      pendiente: "warning",
      en_proceso: "info",
      completada: "success",
      cancelada: "error",
    };

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Órdenes Médicas
          </Typography>
          {patientOrders.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No hay órdenes médicas pendientes
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
                      <Chip
                        label={order.prioridad}
                        size="small"
                        color={order.prioridad === "critica" ? "error" : order.prioridad === "urgente" ? "warning" : "default"}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip label={order.estado} color={statusColors[order.estado]} size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    );
  };

  const NursingNotesSection: React.FC<{ pacienteId: string; pacienteNombre: string }> = ({ pacienteId, pacienteNombre }) => {
    const [notes] = useAtom(nursingNotesAtom);
    const [, addNote] = useAtom(addNursingNoteAtom);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<NursingNote>>({
      contenido: "",
      tipo: "evolucion",
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
        contenido: "",
        tipo: "evolucion",
      });
    };

    const handleSubmit = (): void => {
      if (!formData.contenido) return;

      const now = new Date();
      const newNote: NursingNote = {
        id: `nn-${Date.now()}`,
        pacienteId: pacienteId,
        pacienteNombre: pacienteNombre,
        fecha: now.toISOString().split("T")[0],
        hora: now.toTimeString().split(" ")[0].substring(0, 5),
        contenido: formData.contenido || "",
        tipo: formData.tipo || "evolucion",
      };

      addNote(newNote);
      handleClose();
    };

    return (
      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6">Notas Enfermería</Typography>
            <Button variant="contained" startIcon={<Add />} onClick={handleOpen} aria-label="Agregar nota de enfermería">
              Nueva Nota
            </Button>
          </Stack>
          {patientNotes.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No hay notas de enfermería registradas
            </Typography>
          ) : (
            <Stack spacing={2}>
              {patientNotes.map((note) => (
                <Paper key={note.id} elevation={1} sx={{ p: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {new Date(note.fecha).toLocaleDateString("es-ES")} {note.hora}
                    </Typography>
                    <Chip label={note.tipo} size="small" />
                  </Stack>
                  <Divider sx={{ mb: 1 }} />
                  <Typography variant="body2">{note.contenido}</Typography>
                </Paper>
              ))}
            </Stack>
          )}

          <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Nueva Nota de Enfermería</DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Tipo"
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as NursingNote["tipo"] })}
                  >
                    <MenuItem value="evolucion">Evolución</MenuItem>
                    <MenuItem value="procedimiento">Procedimiento</MenuItem>
                    <MenuItem value="observacion">Observación</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Contenido"
                    value={formData.contenido}
                    onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                    multiline
                    rows={6}
                    required
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button onClick={handleSubmit} variant="contained" disabled={!formData.contenido}>
                Guardar Nota
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
    );
  };

  const renderSection = (): React.ReactNode => {
    if (selectedRole === "medico") {
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
    } else if (selectedRole === "enfermera") {
      if (selectedSection === "signos-vitales") {
        return <VitalSignsSection pacienteId={pacienteId} pacienteNombre={fullName} />;
      }
      if (selectedSection === "balance-hidrico") {
        return <FluidBalanceSection pacienteId={pacienteId} pacienteNombre={fullName} />;
      }
      if (selectedSection === "ordenes-medicas") {
        return <MedicalOrdersNursingSection pacienteId={pacienteId} pacienteNombre={fullName} />;
      }
      if (selectedSection === "notas-enfermeria") {
        return <NursingNotesSection pacienteId={pacienteId} pacienteNombre={fullName} />;
      }
    }
    return null;
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
                  {selectedRole === "medico" ? (
                    <>
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
                    </>
                  ) : selectedRole === "enfermera" ? (
                    <>
                      <ListItem disablePadding>
                        <ListItemButton selected={selectedSection === "signos-vitales"} onClick={() => setSelectedSection("signos-vitales")} role="button">
                          <ListItemIcon>
                            <Favorite />
                          </ListItemIcon>
                          <ListItemText primary="Signos Vitales" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton selected={selectedSection === "balance-hidrico"} onClick={() => setSelectedSection("balance-hidrico")} role="button">
                          <ListItemIcon>
                            <WaterDrop />
                          </ListItemIcon>
                          <ListItemText primary="Balance Hídrico" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton selected={selectedSection === "ordenes-medicas"} onClick={() => setSelectedSection("ordenes-medicas")} role="button">
                          <ListItemIcon>
                            <Assignment />
                          </ListItemIcon>
                          <ListItemText primary="Órdenes Médicas" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton selected={selectedSection === "notas-enfermeria"} onClick={() => setSelectedSection("notas-enfermeria")} role="button">
                          <ListItemIcon>
                            <Notes />
                          </ListItemIcon>
                          <ListItemText primary="Notas Enfermería" />
                        </ListItemButton>
                      </ListItem>
                    </>
                  ) : null}
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
