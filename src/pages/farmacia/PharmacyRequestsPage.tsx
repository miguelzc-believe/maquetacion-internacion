import React, { useState, useMemo } from "react";
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
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import { useAtom } from "jotai";
import { pharmacyRequestsAtom, updatePharmacyRequestAtom, getPharmacyRequestsByStatusAtom } from "../../stores/pharmacyStore";
import { PharmacyRequest } from "../../types/pharmacyRequest";
import { medicalOrdersAtom } from "../../stores/medicalOrdersStore";
import { MedicationOrder } from "../../types/medicalOrder";

const PharmacyRequestsPage: React.FC = () => {
  const [orders] = useAtom(medicalOrdersAtom);
  const [requests] = useAtom(pharmacyRequestsAtom);
  const [, updateRequest] = useAtom(updatePharmacyRequestAtom);
  const [getRequestsByStatus] = useAtom(getPharmacyRequestsByStatusAtom);
  const [selectedRequest, setSelectedRequest] = useState<PharmacyRequest | null>(null);
  const [open, setOpen] = useState(false);

  const medicationOrders = orders.filter(
    (order) => order.tipo === "medicamento" && order.estado === "pendiente"
  ) as MedicationOrder[];

  const pendingRequests = useMemo(() => {
    const existingRequestOrderIds = requests.map((r) => r.ordenMedicaId);
    const newOrders = medicationOrders.filter((order) => !existingRequestOrderIds.includes(order.id));

    const newRequests: PharmacyRequest[] = newOrders.map((order) => ({
      id: `pr-${Date.now()}-${order.id}`,
      ordenMedicaId: order.id,
      pacienteId: order.pacienteId,
      pacienteNombre: order.pacienteNombre,
      medicamento: order.medicamento,
      dosis: order.dosis,
      cantidad: 1,
      fechaSolicitud: order.fechaCreacion,
      estado: "pendiente",
    }));

    return [...requests, ...newRequests].filter((r) => r.estado === "pendiente");
  }, [orders, requests]);

  const handleViewDetails = (request: PharmacyRequest): void => {
    setSelectedRequest(request);
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
    setSelectedRequest(null);
  };

  const handleUpdateStatus = (status: PharmacyRequest["estado"]): void => {
    if (!selectedRequest) return;

    const updates: Partial<PharmacyRequest> = {
      estado: status,
    };

    if (status === "preparando") {
      updates.fechaPreparacion = new Date().toISOString().split("T")[0];
    } else if (status === "entregado") {
      updates.fechaEntrega = new Date().toISOString().split("T")[0];
    }

    updateRequest(selectedRequest.id, updates);
    handleClose();
  };

  const statusColors: Record<PharmacyRequest["estado"], "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
    pendiente: "warning",
    preparando: "info",
    listo: "primary",
    entregado: "success",
    devuelto: "error",
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Solicitudes Descargo
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total de solicitudes pendientes: {pendingRequests.length}
        </Typography>
      </Paper>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Paciente</TableCell>
              <TableCell>Medicamento</TableCell>
              <TableCell>Dosis</TableCell>
              <TableCell>Fecha Solicitud</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingRequests.map((request) => (
              <TableRow key={request.id} hover>
                <TableCell>{request.pacienteNombre}</TableCell>
                <TableCell>{request.medicamento}</TableCell>
                <TableCell>{request.dosis}</TableCell>
                <TableCell>
                  {new Date(request.fechaSolicitud).toLocaleDateString("es-ES")}
                </TableCell>
                <TableCell>
                  <Chip label={request.estado} color={statusColors[request.estado]} size="small" />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewDetails(request)}
                  >
                    Ver Detalles
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Detalles de Solicitud</DialogTitle>
        <DialogContent dividers>
          {selectedRequest && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              <Typography variant="body1">
                <strong>Paciente:</strong> {selectedRequest.pacienteNombre}
              </Typography>
              <Typography variant="body1">
                <strong>Medicamento:</strong> {selectedRequest.medicamento}
              </Typography>
              <Typography variant="body1">
                <strong>Dosis:</strong> {selectedRequest.dosis}
              </Typography>
              <Typography variant="body1">
                <strong>Cantidad:</strong> {selectedRequest.cantidad}
              </Typography>
              <Typography variant="body1">
                <strong>Estado:</strong>{" "}
                <Chip
                  label={selectedRequest.estado}
                  color={statusColors[selectedRequest.estado]}
                  size="small"
                />
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cerrar</Button>
          {selectedRequest?.estado === "pendiente" && (
            <Button onClick={() => handleUpdateStatus("preparando")} variant="contained">
              Iniciar Preparación
            </Button>
          )}
          {selectedRequest?.estado === "preparando" && (
            <Button onClick={() => handleUpdateStatus("listo")} variant="contained">
              Marcar como Listo
            </Button>
          )}
          {selectedRequest?.estado === "listo" && (
            <Button onClick={() => handleUpdateStatus("entregado")} variant="contained" color="success">
              Marcar como Entregado
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PharmacyRequestsPage;

