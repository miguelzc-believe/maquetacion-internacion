import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Chip,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAtom } from "jotai";
import { epicrisisAtom, addEpicrisisAtom } from "../../stores/epicrisisStore";
import { Epicrisis } from "../../types/epicrisis";
import { inpatients } from "../../utils/inpatients";
import { doctors } from "../../utils/doctors";

const EpicrisisAltaPage: React.FC = () => {
  const [epicrisisList] = useAtom(epicrisisAtom);
  const [, addEpicrisis] = useAtom(addEpicrisisAtom);
  const [open, setOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
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

  const handleOpen = (patientId: string): void => {
    setSelectedPatientId(patientId);
    const patient = inpatients.find((p) => p.id === patientId);
    if (patient) {
      setFormData({
        ...formData,
        motivoIngreso: patient.diagnostico,
        diagnosticoIngreso: patient.diagnostico,
        fechaIngreso: patient.fechaIngreso,
      });
    }
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
    setSelectedPatientId("");
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
    if (!selectedPatientId || !formData.diagnosticoAlta) return;

    const patient = inpatients.find((p) => p.id === selectedPatientId);
    if (!patient) return;

    const doctor = doctors[0];
    const now = new Date();

    const newEpicrisis: Epicrisis = {
      id: `ep-${Date.now()}`,
      pacienteId: selectedPatientId,
      fechaIngreso: formData.fechaIngreso || patient.fechaIngreso,
      fechaAlta: now.toISOString().split("T")[0],
      motivoIngreso: formData.motivoIngreso || "",
      diagnosticoIngreso: formData.diagnosticoIngreso || "",
      diagnosticoAlta: formData.diagnosticoAlta,
      evolucion: formData.evolucion || "",
      procedimientosRealizados: formData.procedimientosRealizados || [],
      medicamentosSuministrados: formData.medicamentosSuministrados || [],
      recomendaciones: formData.recomendaciones || "",
      medicoId: doctor.id,
      medicoNombre: doctor.nombre,
      tipoAlta: formData.tipoAlta || "alta_medica",
    };

    addEpicrisis(newEpicrisis);
    handleClose();
  };

  const patientEpicrisis = epicrisisList.filter((ep) => ep.pacienteId === selectedPatientId);

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Epicrisis / Alta
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Seleccione un paciente para registrar epicrisis y alta
        </Typography>
        <Grid container spacing={2}>
          {inpatients.map((patient) => (
            <Grid item xs={12} sm={6} md={4} key={patient.id}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {patient.pacienteNombre}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Habitación: {patient.habitacion} - Cama {patient.cama}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => handleOpen(patient.id)}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Registrar Epicrisis
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Registrar Epicrisis / Alta</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha Ingreso"
                type="date"
                value={formData.fechaIngreso || ""}
                onChange={(e) => setFormData({ ...formData, fechaIngreso: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Tipo de Alta"
                value={formData.tipoAlta}
                onChange={(e) =>
                  setFormData({ ...formData, tipoAlta: e.target.value as Epicrisis["tipoAlta"] })
                }
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Diagnóstico Ingreso"
                value={formData.diagnosticoIngreso}
                onChange={(e) => setFormData({ ...formData, diagnosticoIngreso: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Diagnóstico Alta"
                value={formData.diagnosticoAlta}
                onChange={(e) => setFormData({ ...formData, diagnosticoAlta: e.target.value })}
                multiline
                rows={2}
                required
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
                label="Procedimientos Realizados (separados por comas)"
                value={formData.procedimientosRealizados?.join(", ") || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    procedimientosRealizados: e.target.value.split(",").map((p) => p.trim()),
                  })
                }
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Medicamentos Suministrados (separados por comas)"
                value={formData.medicamentosSuministrados?.join(", ") || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    medicamentosSuministrados: e.target.value.split(",").map((m) => m.trim()),
                  })
                }
                multiline
                rows={2}
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
          <Button onClick={handleSubmit} variant="contained" disabled={!formData.diagnosticoAlta}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {selectedPatientId && patientEpicrisis.length > 0 && (
        <TableContainer component={Paper} elevation={3} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha Alta</TableCell>
                <TableCell>Diagnóstico Alta</TableCell>
                <TableCell>Tipo Alta</TableCell>
                <TableCell>Médico</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patientEpicrisis.map((ep) => (
                <TableRow key={ep.id} hover>
                  <TableCell>{ep.fechaAlta}</TableCell>
                  <TableCell>{ep.diagnosticoAlta}</TableCell>
                  <TableCell>
                    <Chip
                      label={ep.tipoAlta.replace("_", " ")}
                      color={ep.tipoAlta === "defuncion" ? "error" : "success"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{ep.medicoNombre}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default EpicrisisAltaPage;

