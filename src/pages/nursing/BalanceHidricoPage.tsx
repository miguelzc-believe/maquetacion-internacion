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
  Card,
  CardContent,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAtom } from "jotai";
import { fluidBalanceAtom, addFluidBalanceAtom } from "../../stores/fluidBalanceStore";
import { FluidBalance } from "../../types/fluidBalance";
import { inpatients } from "../../utils/inpatients";

const BalanceHidricoPage: React.FC = () => {
  const [fluidBalances] = useAtom(fluidBalanceAtom);
  const [, addFluidBalance] = useAtom(addFluidBalanceAtom);
  const [open, setOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
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

  const handleOpen = (patientId: string): void => {
    setSelectedPatientId(patientId);
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
    setSelectedPatientId("");
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
    const ingresosTotal =
      (formData.ingresos?.viaOral || 0) +
      (formData.ingresos?.viaVenosa || 0) +
      (formData.ingresos?.otros || 0);

    const egresosTotal =
      (formData.egresos?.orina || 0) +
      (formData.egresos?.heces || 0) +
      (formData.egresos?.vomito || 0) +
      (formData.egresos?.drenajes || 0) +
      (formData.egresos?.otros || 0);

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

  const handleIngresoChange = (field: keyof FluidBalance["ingresos"], value: number): void => {
    const newIngresos = {
      ...formData.ingresos!,
      [field]: value,
    };
    setFormData({
      ...formData,
      ingresos: newIngresos,
    });
    setTimeout(calculateTotals, 0);
  };

  const handleEgresoChange = (field: keyof FluidBalance["egresos"], value: number): void => {
    const newEgresos = {
      ...formData.egresos!,
      [field]: value,
    };
    setFormData({
      ...formData,
      egresos: newEgresos,
    });
    setTimeout(calculateTotals, 0);
  };

  const handleSubmit = (): void => {
    if (!selectedPatientId) return;

    const patient = inpatients.find((p) => p.id === selectedPatientId);
    if (!patient) return;

    const now = new Date();

    const newFluidBalance: FluidBalance = {
      id: `fb-${Date.now()}`,
      pacienteId: selectedPatientId,
      fecha: now.toISOString().split("T")[0],
      hora: now.toTimeString().split(" ")[0].substring(0, 5),
      ingresos: formData.ingresos!,
      egresos: formData.egresos!,
      balance: formData.balance || 0,
      registradoPor: "Enfermera",
    };

    addFluidBalance(newFluidBalance);
    handleClose();
  };

  const patientBalances = fluidBalances.filter(
    (fb) => fb.pacienteId === selectedPatientId
  );

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Balance Hídrico
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Seleccione un paciente para registrar balance hídrico
        </Typography>
        <Grid container spacing={2}>
          {inpatients.map((patient) => (
            <Grid item xs={12} sm={6} md={4} key={patient.id}>
              <Card>
                <CardContent>
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
                    Registrar Balance
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Registrar Balance Hídrico</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Ingresos (ml)
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Vía Oral"
                type="number"
                value={formData.ingresos?.viaOral || ""}
                onChange={(e) =>
                  handleIngresoChange("viaOral", parseFloat(e.target.value) || 0)
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Vía Venosa"
                type="number"
                value={formData.ingresos?.viaVenosa || ""}
                onChange={(e) =>
                  handleIngresoChange("viaVenosa", parseFloat(e.target.value) || 0)
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Otros"
                type="number"
                value={formData.ingresos?.otros || ""}
                onChange={(e) =>
                  handleIngresoChange("otros", parseFloat(e.target.value) || 0)
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, bgcolor: "primary.light", color: "primary.contrastText" }}>
                <Typography variant="h6">
                  Total Ingresos: {formData.ingresos?.total || 0} ml
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Egresos (ml)
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Orina"
                type="number"
                value={formData.egresos?.orina || ""}
                onChange={(e) =>
                  handleEgresoChange("orina", parseFloat(e.target.value) || 0)
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Heces"
                type="number"
                value={formData.egresos?.heces || ""}
                onChange={(e) =>
                  handleEgresoChange("heces", parseFloat(e.target.value) || 0)
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Vómito"
                type="number"
                value={formData.egresos?.vomito || ""}
                onChange={(e) =>
                  handleEgresoChange("vomito", parseFloat(e.target.value) || 0)
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Drenajes"
                type="number"
                value={formData.egresos?.drenajes || ""}
                onChange={(e) =>
                  handleEgresoChange("drenajes", parseFloat(e.target.value) || 0)
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Otros"
                type="number"
                value={formData.egresos?.otros || ""}
                onChange={(e) =>
                  handleEgresoChange("otros", parseFloat(e.target.value) || 0)
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, bgcolor: "secondary.light", color: "secondary.contrastText" }}>
                <Typography variant="h6">
                  Total Egresos: {formData.egresos?.total || 0} ml
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 2,
                  bgcolor:
                    (formData.balance || 0) > 0
                      ? "success.light"
                      : (formData.balance || 0) < 0
                      ? "error.light"
                      : "grey.300",
                  color: "text.primary",
                }}
              >
                <Typography variant="h5" fontWeight="bold">
                  Balance: {formData.balance || 0} ml
                </Typography>
              </Paper>
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

export default BalanceHidricoPage;

