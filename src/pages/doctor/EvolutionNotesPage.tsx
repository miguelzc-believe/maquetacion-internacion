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
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAtom } from "jotai";
import { evolutionNotesAtom, addEvolutionNoteAtom } from "../../stores/evolutionNotesStore";
import { EvolutionNote } from "../../types/evolutionNote";
import { inpatients } from "../../utils/inpatients";
import { doctors } from "../../utils/doctors";

const EvolutionNotesPage: React.FC = () => {
  const [notes] = useAtom(evolutionNotesAtom);
  const [, addNote] = useAtom(addEvolutionNoteAtom);
  const [open, setOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [formData, setFormData] = useState<Partial<EvolutionNote>>({
    sintomas: "",
    examenFisico: "",
    diagnostico: "",
    planTratamiento: "",
  });

  const handleOpen = (patientId: string): void => {
    setSelectedPatientId(patientId);
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
    setSelectedPatientId("");
    setFormData({
      sintomas: "",
      examenFisico: "",
      diagnostico: "",
      planTratamiento: "",
    });
  };

  const handleSubmit = (): void => {
    if (!selectedPatientId || !formData.sintomas || !formData.diagnostico) return;

    const patient = inpatients.find((p) => p.id === selectedPatientId);
    if (!patient) return;

    const doctor = doctors[0];
    const now = new Date();

    const newNote: EvolutionNote = {
      id: `en-${Date.now()}`,
      pacienteId: selectedPatientId,
      fecha: now.toISOString().split("T")[0],
      hora: now.toTimeString().split(" ")[0].substring(0, 5),
      sintomas: formData.sintomas,
      examenFisico: formData.examenFisico || "",
      diagnostico: formData.diagnostico,
      planTratamiento: formData.planTratamiento || "",
      medicoId: doctor.id,
      medicoNombre: doctor.nombre,
    };

    addNote(newNote);
    handleClose();
  };

  const patientNotes = notes.filter((note) => note.pacienteId === selectedPatientId);

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Notas Evolución
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Seleccione un paciente para registrar nota de evolución
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
                  Nueva Nota
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Registrar Nota de Evolución</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Motivo de Consulta"
                value={formData.motivoConsulta || ""}
                onChange={(e) => setFormData({ ...formData, motivoConsulta: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
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
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Plan de Tratamiento"
                value={formData.planTratamiento}
                onChange={(e) => setFormData({ ...formData, planTratamiento: e.target.value })}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observaciones"
                value={formData.observaciones || ""}
                onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.sintomas || !formData.diagnostico}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {selectedPatientId && patientNotes.length > 0 && (
        <TableContainer component={Paper} elevation={3} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha/Hora</TableCell>
                <TableCell>Diagnóstico</TableCell>
                <TableCell>Médico</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patientNotes.map((note) => (
                <TableRow key={note.id} hover>
                  <TableCell>
                    {note.fecha} {note.hora}
                  </TableCell>
                  <TableCell>{note.diagnostico}</TableCell>
                  <TableCell>{note.medicoNombre}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default EvolutionNotesPage;

