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
import { nursingNotesAtom, addNursingNoteAtom } from "../../stores/nursingNotesStore";
import { NursingNote } from "../../types/nursingNote";
import { inpatients } from "../../utils/inpatients";

const NursingNotesPage: React.FC = () => {
  const [notes] = useAtom(nursingNotesAtom);
  const [, addNote] = useAtom(addNursingNoteAtom);
  const [open, setOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [formData, setFormData] = useState<Partial<NursingNote>>({
    contenido: "",
    tipo: "evolucion",
  });

  const handleOpen = (patientId: string): void => {
    setSelectedPatientId(patientId);
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
    setSelectedPatientId("");
    setFormData({
      contenido: "",
      tipo: "evolucion",
    });
  };

  const handleSubmit = (): void => {
    if (!selectedPatientId || !formData.contenido) return;

    const patient = inpatients.find((p) => p.id === selectedPatientId);
    if (!patient) return;

    const now = new Date();

    const newNote: NursingNote = {
      id: `nn-${Date.now()}`,
      pacienteId: selectedPatientId,
      fecha: now.toISOString().split("T")[0],
      hora: now.toTimeString().split(" ")[0].substring(0, 5),
      contenido: formData.contenido,
      tipo: formData.tipo || "evolucion",
      registradoPor: "Enfermera",
    };

    addNote(newNote);
    handleClose();
  };

  const patientNotes = notes.filter((note) => note.pacienteId === selectedPatientId);

  const tipoColors: Record<NursingNote["tipo"], "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
    evolucion: "primary",
    procedimiento: "info",
    observacion: "default",
    incidente: "error",
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Notas Enfermería
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Seleccione un paciente para registrar notas
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
        <DialogTitle>Registrar Nota de Enfermería</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Tipo de Nota"
                value={formData.tipo}
                onChange={(e) =>
                  setFormData({ ...formData, tipo: e.target.value as NursingNote["tipo"] })
                }
              >
                <MenuItem value="evolucion">Evolución</MenuItem>
                <MenuItem value="procedimiento">Procedimiento</MenuItem>
                <MenuItem value="observacion">Observación</MenuItem>
                <MenuItem value="incidente">Incidente</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contenido"
                multiline
                rows={8}
                value={formData.contenido}
                onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                placeholder="Describa la situación, procedimiento realizado, observaciones..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!formData.contenido}>
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
                <TableCell>Tipo</TableCell>
                <TableCell>Contenido</TableCell>
                <TableCell>Registrado Por</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patientNotes.map((note) => (
                <TableRow key={note.id}>
                  <TableCell>
                    {note.fecha} {note.hora}
                  </TableCell>
                  <TableCell>
                    <Chip label={note.tipo} color={tipoColors[note.tipo]} size="small" />
                  </TableCell>
                  <TableCell>{note.contenido}</TableCell>
                  <TableCell>{note.registradoPor}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default NursingNotesPage;

