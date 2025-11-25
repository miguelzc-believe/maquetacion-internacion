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
  Stack,
} from "@mui/material";
import { useAtom } from "jotai";
import { pharmacyRequestsAtom, updatePharmacyRequestAtom } from "../../stores/pharmacyStore";
import { PharmacyRequest } from "../../types/pharmacyRequest";

const ReturnsPage: React.FC = () => {
  const [requests] = useAtom(pharmacyRequestsAtom);
  const [, updateRequest] = useAtom(updatePharmacyRequestAtom);
  const [open, setOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PharmacyRequest | null>(null);
  const [returnData, setReturnData] = useState({ cantidad: 0, motivo: "" });

  const deliveredRequests = requests.filter((r) => r.estado === "entregado");

  const handleOpenReturn = (request: PharmacyRequest): void => {
    setSelectedRequest(request);
    setReturnData({ cantidad: request.cantidadTotalDia, motivo: "" });
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
    setSelectedRequest(null);
    setReturnData({ cantidad: 0, motivo: "" });
  };

  const handleSubmitReturn = (): void => {
    if (!selectedRequest || !returnData.motivo) return;

    updateRequest(selectedRequest.id, {
      estado: "devuelto",
      devolucion: {
        cantidad: returnData.cantidad,
        motivo: returnData.motivo,
        fecha: new Date().toISOString().split("T")[0],
      },
    });

    handleClose();
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Devoluciones
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Medicamentos entregados disponibles para devolución: {deliveredRequests.length}
        </Typography>
      </Paper>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Paciente</TableCell>
              <TableCell>Ubicación</TableCell>
              <TableCell>Medicamentos</TableCell>
              <TableCell>Fecha Entrega</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveredRequests.map((request) => (
              <TableRow key={request.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {request.pacienteNombre}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    Hab. {request.habitacion} - Cama {request.cama}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Stack spacing={0.5}>
                    {request.medicamentos.map((med, index) => (
                      <Typography key={index} variant="body2">
                        {med.medicamento} ({med.dosis})
                      </Typography>
                    ))}
                  </Stack>
                </TableCell>
                <TableCell>
                  {request.fechaEntrega
                    ? new Date(request.fechaEntrega).toLocaleDateString("es-ES")
                    : "-"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleOpenReturn(request)}
                  >
                    Registrar Devolución
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Registrar Devolución</DialogTitle>
        <DialogContent dividers>
          {selectedRequest && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Paciente:</strong> {selectedRequest.pacienteNombre}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" gutterBottom>
                  <strong>Medicamentos:</strong>
                </Typography>
                <Stack spacing={0.5} sx={{ pl: 2 }}>
                  {selectedRequest.medicamentos.map((med, index) => (
                    <Typography key={index} variant="body2">
                      {med.medicamento} - {med.dosis} (Cantidad/día: {med.cantidad})
                    </Typography>
                  ))}
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cantidad Devuelta"
                  type="number"
                  value={returnData.cantidad}
                  onChange={(e) =>
                    setReturnData({ ...returnData, cantidad: parseFloat(e.target.value) || 0 })
                  }
                  inputProps={{ min: 0, max: selectedRequest.cantidadTotalDia }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Motivo de Devolución"
                  value={returnData.motivo}
                  onChange={(e) => setReturnData({ ...returnData, motivo: e.target.value })}
                  multiline
                  rows={3}
                  required
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            onClick={handleSubmitReturn}
            variant="contained"
            color="error"
            disabled={!returnData.motivo || returnData.cantidad <= 0}
          >
            Registrar Devolución
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReturnsPage;

