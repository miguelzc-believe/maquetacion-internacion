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
  Stack,
  Divider,
  Chip,
} from "@mui/material";
import { useAtom } from "jotai";
import { pharmacyRequestsAtom, updatePharmacyRequestAtom } from "../../stores/pharmacyStore";
import { PharmacyRequest } from "../../types/pharmacyRequest";

const ReturnsPage: React.FC = () => {
  const [requests] = useAtom(pharmacyRequestsAtom);
  const [, updateRequest] = useAtom(updatePharmacyRequestAtom);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PharmacyRequest | null>(null);
  const [actionType, setActionType] = useState<"aceptar" | "rechazar" | null>(null);

  const deliveredRequests = requests.filter((r) => r.estado === "entregado");

  const handleViewDetails = (request: PharmacyRequest): void => {
    setSelectedRequest(request);
    setDetailsOpen(true);
  };

  const handleOpenAction = (request: PharmacyRequest, type: "aceptar" | "rechazar"): void => {
    setSelectedRequest(request);
    setActionType(type);
    setActionOpen(true);
  };

  const handleCloseDetails = (): void => {
    setDetailsOpen(false);
    setSelectedRequest(null);
  };

  const handleCloseAction = (): void => {
    setActionOpen(false);
    setSelectedRequest(null);
    setActionType(null);
  };

  const handleAcceptReturn = (): void => {
    if (!selectedRequest) return;

    updateRequest(selectedRequest.id, {
      estado: "devuelto",
      devolucion: {
        cantidad: selectedRequest.cantidadTotalDia,
        motivo: "Devolución aceptada",
        fecha: new Date().toISOString().split("T")[0],
      },
    });

    handleCloseAction();
  };

  const handleRejectReturn = (): void => {
    if (!selectedRequest) return;

    updateRequest(selectedRequest.id, {
      observaciones: "Devolución rechazada",
    });

    handleCloseAction();
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
                  <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap", gap: 0.5 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewDetails(request)}
                      sx={{ minWidth: "auto", px: 1, py: 0.5, fontSize: "0.75rem" }}
                    >
                      Ver Detalles
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleOpenAction(request, "aceptar")}
                      sx={{ minWidth: "auto", px: 1, py: 0.5, fontSize: "0.75rem" }}
                    >
                      Aceptar
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleOpenAction(request, "rechazar")}
                      sx={{ minWidth: "auto", px: 1, py: 0.5, fontSize: "0.75rem" }}
                    >
                      Rechazar
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={detailsOpen} onClose={handleCloseDetails} maxWidth="sm" fullWidth>
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
                <strong>Fecha Solicitud:</strong> {new Date(selectedRequest.fechaSolicitud).toLocaleDateString("es-ES")}
              </Typography>
              <Typography variant="body1">
                <strong>Fecha Entrega:</strong> {selectedRequest.fechaEntrega ? new Date(selectedRequest.fechaEntrega).toLocaleDateString("es-ES") : "-"}
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
          <Button onClick={handleCloseDetails}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={actionOpen} onClose={handleCloseAction} maxWidth="sm" fullWidth>
        <DialogTitle>
          {actionType === "aceptar" ? "Aceptar Devolución" : "Rechazar Devolución"}
        </DialogTitle>
        <DialogContent dividers>
          {selectedRequest && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              <Typography variant="body1">
                <strong>Paciente:</strong> {selectedRequest.pacienteNombre}
              </Typography>
              <Typography variant="body1">
                <strong>Ubicación:</strong> Hab. {selectedRequest.habitacion} - Cama {selectedRequest.cama}
              </Typography>
              <Divider />
              <Typography variant="subtitle2" fontWeight="bold">
                Medicamentos:
              </Typography>
              <Stack spacing={0.5}>
                {selectedRequest.medicamentos.map((med, index) => (
                  <Typography key={index} variant="body2">
                    {med.medicamento} - {med.dosis} (Cantidad/día: {med.cantidad})
                  </Typography>
                ))}
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {actionType === "aceptar"
                  ? "¿Está seguro de que desea aceptar esta devolución?"
                  : "¿Está seguro de que desea rechazar esta devolución?"}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAction}>Cancelar</Button>
          {actionType === "aceptar" && (
            <Button onClick={handleAcceptReturn} variant="contained" color="success">
              Aceptar Devolución
            </Button>
          )}
          {actionType === "rechazar" && (
            <Button onClick={handleRejectReturn} variant="contained" color="error">
              Rechazar Devolución
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReturnsPage;

