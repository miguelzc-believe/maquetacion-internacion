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
import { deathCertificatesAtom, addDeathCertificateAtom } from "../../stores/deathCertificateStore";
import { DeathCertificate } from "../../types/deathCertificate";
import { inpatients } from "../../utils/inpatients";
import { doctors } from "../../utils/doctors";

const DeathCertificatePage: React.FC = () => {
  const [certificates] = useAtom(deathCertificatesAtom);
  const [, addCertificate] = useAtom(addDeathCertificateAtom);
  const [open, setOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [formData, setFormData] = useState<Partial<DeathCertificate>>({
    causaMuerte: "",
    lugarDefuncion: "",
  });

  const handleOpen = (patientId: string): void => {
    setSelectedPatientId(patientId);
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
    setSelectedPatientId("");
    setFormData({
      causaMuerte: "",
      lugarDefuncion: "",
    });
  };

  const handleSubmit = (): void => {
    if (!selectedPatientId || !formData.causaMuerte) return;

    const patient = inpatients.find((p) => p.id === selectedPatientId);
    if (!patient) return;

    const doctor = doctors[0];
    const now = new Date();

    const newCertificate: DeathCertificate = {
      id: `dc-${Date.now()}`,
      pacienteId: selectedPatientId,
      fechaDefuncion: formData.fechaDefuncion || now.toISOString().split("T")[0],
      horaDefuncion: formData.horaDefuncion || now.toTimeString().split(" ")[0].substring(0, 5),
      causaMuerte: formData.causaMuerte,
      lugarDefuncion: formData.lugarDefuncion || "Hospital",
      medicoId: doctor.id,
      medicoNombre: doctor.nombre,
      observaciones: formData.observaciones,
    };

    addCertificate(newCertificate);
    handleClose();
  };

  const patientCertificates = certificates.filter((cert) => cert.pacienteId === selectedPatientId);

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Certificado Defunción
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Seleccione un paciente para registrar certificado de defunción
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
                  color="error"
                  startIcon={<Add />}
                  onClick={() => handleOpen(patient.id)}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Registrar Defunción
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Registrar Certificado de Defunción</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha Defunción"
                type="date"
                value={formData.fechaDefuncion || ""}
                onChange={(e) => setFormData({ ...formData, fechaDefuncion: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Hora Defunción"
                type="time"
                value={formData.horaDefuncion || ""}
                onChange={(e) => setFormData({ ...formData, horaDefuncion: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
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
            color="error"
            disabled={!formData.causaMuerte || !formData.fechaDefuncion || !formData.horaDefuncion}
          >
            Registrar
          </Button>
        </DialogActions>
      </Dialog>

      {selectedPatientId && patientCertificates.length > 0 && (
        <TableContainer component={Paper} elevation={3} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha/Hora</TableCell>
                <TableCell>Causa de Muerte</TableCell>
                <TableCell>Lugar</TableCell>
                <TableCell>Médico</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patientCertificates.map((cert) => (
                <TableRow key={cert.id} hover>
                  <TableCell>
                    {cert.fechaDefuncion} {cert.horaDefuncion}
                  </TableCell>
                  <TableCell>{cert.causaMuerte}</TableCell>
                  <TableCell>{cert.lugarDefuncion}</TableCell>
                  <TableCell>{cert.medicoNombre}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default DeathCertificatePage;

