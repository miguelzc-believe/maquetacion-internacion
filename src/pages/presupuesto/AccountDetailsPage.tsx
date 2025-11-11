import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import { useAtom } from "jotai";
import { patientBudgetsAtom, updatePatientBudgetAtom } from "../../stores/budgetStore";
import { PatientBudget } from "../../types/budget";

const AccountDetailsPage: React.FC = () => {
  const [budgets] = useAtom(patientBudgetsAtom);
  const [, updateBudget] = useAtom(updatePatientBudgetAtom);
  const [open, setOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<PatientBudget | null>(null);

  const pendingBudgets = budgets.filter((b) => b.estado === "pendiente" || b.estado === "revision");

  const handleOpen = (budget: PatientBudget): void => {
    setSelectedBudget(budget);
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
    setSelectedBudget(null);
  };

  const handleApprove = (): void => {
    if (!selectedBudget) return;

    updateBudget(selectedBudget.id, {
      estado: "aprobado",
    });

    handleClose();
  };

  const handleSendToCashier = (): void => {
    if (!selectedBudget) return;

    updateBudget(selectedBudget.id, {
      estado: "en_caja",
    });

    handleClose();
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Detalles Cuenta
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Presupuestos pendientes de revisión: {pendingBudgets.length}
        </Typography>
      </Paper>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Paciente</TableCell>
              <TableCell>Fecha Ingreso</TableCell>
              <TableCell>Fecha Alta</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingBudgets.map((budget) => (
              <TableRow key={budget.id} hover>
                <TableCell>{budget.pacienteId}</TableCell>
                <TableCell>{budget.fechaIngreso}</TableCell>
                <TableCell>{budget.fechaAlta}</TableCell>
                <TableCell>${budget.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={budget.estado}
                    color={budget.estado === "aprobado" ? "success" : "warning"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button variant="contained" size="small" onClick={() => handleOpen(budget)}>
                    Ver Detalles
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Detalles de Cuenta</DialogTitle>
        <DialogContent dividers>
          {selectedBudget && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Paciente ID:</strong> {selectedBudget.pacienteId}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Fecha Ingreso:</strong> {selectedBudget.fechaIngreso}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Fecha Alta:</strong> {selectedBudget.fechaAlta}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Estado:</strong>{" "}
                  <Chip
                    label={selectedBudget.estado}
                    color={selectedBudget.estado === "aprobado" ? "success" : "warning"}
                    size="small"
                  />
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Servicios
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedBudget.servicios.length > 0
                    ? selectedBudget.servicios.join(", ")
                    : "No hay servicios registrados"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Medicamentos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedBudget.medicamentos.length > 0
                    ? selectedBudget.medicamentos.join(", ")
                    : "No hay medicamentos registrados"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Estudios
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedBudget.estudios.length > 0
                    ? selectedBudget.estudios.join(", ")
                    : "No hay estudios registrados"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Paper sx={{ p: 2, bgcolor: "primary.light", color: "primary.contrastText" }}>
                  <Typography variant="h5" fontWeight="bold">
                    Total: ${selectedBudget.total.toFixed(2)}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cerrar</Button>
          {selectedBudget?.estado === "pendiente" && (
            <Button onClick={handleApprove} variant="contained" color="success">
              Aprobar
            </Button>
          )}
          {selectedBudget?.estado === "aprobado" && (
            <Button onClick={handleSendToCashier} variant="contained" color="primary">
              Pasar a Caja
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountDetailsPage;

