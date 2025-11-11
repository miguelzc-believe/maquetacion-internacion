import React, { useMemo } from "react";
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
} from "@mui/material";
import { useAtom } from "jotai";
import { imagingRequestsAtom, addImagingRequestAtom, updateImagingRequestAtom } from "../../stores/imagingStore";
import { ImagingRequest } from "../../types/imagingRequest";
import { medicalOrdersAtom } from "../../stores/medicalOrdersStore";
import { ImagingOrder } from "../../types/medicalOrder";

const ImagingRequestsPage: React.FC = () => {
  const [orders] = useAtom(medicalOrdersAtom);
  const [requests] = useAtom(imagingRequestsAtom);
  const [, addRequest] = useAtom(addImagingRequestAtom);
  const [, updateRequest] = useAtom(updateImagingRequestAtom);

  const imagingOrders = orders.filter(
    (order) => order.tipo === "imagenologia" && order.estado === "pendiente"
  ) as ImagingOrder[];

  const pendingRequests = useMemo(() => {
    const existingRequestOrderIds = requests.map((r) => r.ordenMedicaId);
    const newOrders = imagingOrders.filter((order) => !existingRequestOrderIds.includes(order.id));

    const newRequests: ImagingRequest[] = newOrders.map((order) => ({
      id: `ir-${Date.now()}-${order.id}`,
      ordenMedicaId: order.id,
      pacienteId: order.pacienteId,
      pacienteNombre: order.pacienteNombre,
      estudio: order.estudio,
      region: order.region,
      fechaSolicitud: order.fechaCreacion,
      estado: "pendiente",
    }));

    newRequests.forEach((req) => addRequest(req));

    return [...requests, ...newRequests].filter((r) => r.estado === "pendiente" || r.estado === "en_proceso");
  }, [orders, requests, addRequest]);

  const handleStartStudy = (requestId: string): void => {
    updateRequest(requestId, {
      estado: "en_proceso",
      fechaEstudio: new Date().toISOString().split("T")[0],
    });
  };

  const statusColors: Record<ImagingRequest["estado"], "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
    pendiente: "warning",
    en_proceso: "info",
    programado: "info",
    realizado: "primary",
    completado: "success",
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Solicitudes Estudios
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total de solicitudes: {pendingRequests.length}
        </Typography>
      </Paper>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Paciente</TableCell>
              <TableCell>Estudio</TableCell>
              <TableCell>Región</TableCell>
              <TableCell>Fecha Solicitud</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingRequests.map((request) => (
              <TableRow key={request.id} hover>
                <TableCell>{request.pacienteNombre}</TableCell>
                <TableCell>{request.estudio}</TableCell>
                <TableCell>{request.region}</TableCell>
                <TableCell>
                  {new Date(request.fechaSolicitud).toLocaleDateString("es-ES")}
                </TableCell>
                <TableCell>
                  <Chip label={request.estado} color={statusColors[request.estado]} size="small" />
                </TableCell>
                <TableCell>
                  {request.estado === "pendiente" && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleStartStudy(request.id)}
                    >
                      Iniciar Estudio
                    </Button>
                  )}
                  {request.estado === "en_proceso" && (
                    <Chip label="En proceso" color="info" size="small" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ImagingRequestsPage;

