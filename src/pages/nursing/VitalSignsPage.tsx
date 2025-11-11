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
import { vitalSignsAtom, addVitalSignsAtom } from "../../stores/vitalSignsStore";
import { VitalSigns } from "../../types/vitalSigns";
import { inpatients } from "../../utils/inpatients";

const VitalSignsPage: React.FC = () => {
  const [vitalSigns] = useAtom(vitalSignsAtom);
  const [, addVitalSigns] = useAtom(addVitalSignsAtom);
  const [open, setOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
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

  const handleOpen = (patientId: string): void => {
    setSelectedPatientId(patientId);
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
    setSelectedPatientId("");
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
    if (!selectedPatientId) return;

    const patient = inpatients.find((p) => p.id === selectedPatientId);
    if (!patient) return;

    const now = new Date();
    const imc = formData.peso && formData.talla
      ? formData.peso / Math.pow(formData.talla / 100, 2)
      : undefined;

    const newVitalSigns: VitalSigns = {
      id: `vs-${Date.now()}`,
      pacienteId: selectedPatientId,
      fecha: now.toISOString().split("T")[0],
      hora: now.toTimeString().split(" ")[0].substring(0, 5),
      temperatura: formData.temperatura || 0,
      presionArterialSistolica: formData.presionArterialSistolica || 0,
      presionArterialDiastolica: formData.presionArterialDiastolica || 0,
      frecuenciaCardiaca: formData.frecuenciaCardiaca || 0,
      frecuenciaRespiratoria: formData.frecuenciaRespiratoria || 0,
      saturacionOxigeno: formData.saturacionOxigeno || 0,
      peso: formData.peso,
      talla: formData.talla,
      imc,
      registradoPor: "Enfermera",
    };

    addVitalSigns(newVitalSigns);
    handleClose();
  };

  const patientVitalSigns = vitalSigns.filter(
    (vs) => vs.pacienteId === selectedPatientId
  );

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Signos Vitales
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Seleccione un paciente para registrar signos vitales
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
                  Registrar Signos Vitales
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Registrar Signos Vitales</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Temperatura (°C)"
                type="number"
                value={formData.temperatura || ""}
                onChange={(e) =>
                  setFormData({ ...formData, temperatura: parseFloat(e.target.value) || 0 })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Presión Arterial Sistólica"
                type="number"
                value={formData.presionArterialSistolica || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    presionArterialSistolica: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Presión Arterial Diastólica"
                type="number"
                value={formData.presionArterialDiastolica || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    presionArterialDiastolica: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Frecuencia Cardíaca (lpm)"
                type="number"
                value={formData.frecuenciaCardiaca || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    frecuenciaCardiaca: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Frecuencia Respiratoria (rpm)"
                type="number"
                value={formData.frecuenciaRespiratoria || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    frecuenciaRespiratoria: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Saturación de Oxígeno (%)"
                type="number"
                value={formData.saturacionOxigeno || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    saturacionOxigeno: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Peso (kg)"
                type="number"
                value={formData.peso || ""}
                onChange={(e) =>
                  setFormData({ ...formData, peso: parseFloat(e.target.value) || 0 })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Talla (cm)"
                type="number"
                value={formData.talla || ""}
                onChange={(e) =>
                  setFormData({ ...formData, talla: parseFloat(e.target.value) || 0 })
                }
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
    </Box>
  );
};

export default VitalSignsPage;

