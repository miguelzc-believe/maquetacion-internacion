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
  Stack,
  Divider,
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
    return requests.filter((r) => r.estado === "pendiente");
  }, [requests]);

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
              <TableCell>Enfermera</TableCell>
              <TableCell>Ubicación</TableCell>
              <TableCell>Medicamentos</TableCell>
              <TableCell>Fecha Solicitud</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingRequests.map((request) => (
              <TableRow key={request.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {request.pacienteNombre}
                  </Typography>
                </TableCell>
                <TableCell>{request.enfermera}</TableCell>
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
                <strong>Enfermera:</strong> {selectedRequest.enfermera}
              </Typography>
              <Typography variant="body1">
                <strong>Ubicación:</strong> Hab. {selectedRequest.habitacion} - Cama {selectedRequest.cama}
              </Typography>
              <Divider />
              <Typography variant="subtitle2" fontWeight="bold">
                Medicamentos:
              </Typography>
              <Stack spacing={1.5}>
                {selectedRequest.medicamentos.map((med, index) => (
                  <Box key={index} sx={{ pl: 2, borderLeft: 2, borderColor: "primary.main" }}>
                    <Typography variant="body2" fontWeight="medium">
                      {med.medicamento}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Dosis: {med.dosis}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Cantidad/día: {med.cantidad}
                    </Typography>
                  </Box>
                ))}
              </Stack>
              <Divider />
              <Typography variant="body1">
                <strong>Cantidad Total/Día:</strong> {selectedRequest.cantidadTotalDia}
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

