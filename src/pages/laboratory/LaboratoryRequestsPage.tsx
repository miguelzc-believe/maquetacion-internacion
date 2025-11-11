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
import { laboratoryRequestsAtom, addLaboratoryRequestAtom, updateLaboratoryRequestAtom } from "../../stores/laboratoryStore";
import { LaboratoryRequest } from "../../types/laboratoryRequest";
import { medicalOrdersAtom } from "../../stores/medicalOrdersStore";
import { LaboratoryOrder } from "../../types/medicalOrder";

const LaboratoryRequestsPage: React.FC = () => {
  const [orders] = useAtom(medicalOrdersAtom);
  const [requests] = useAtom(laboratoryRequestsAtom);
  const [, addRequest] = useAtom(addLaboratoryRequestAtom);
  const [, updateRequest] = useAtom(updateLaboratoryRequestAtom);

  const labOrders = orders.filter(
    (order) => order.tipo === "laboratorio" && order.estado === "pendiente"
  ) as LaboratoryOrder[];

  const pendingRequests = useMemo(() => {
    const existingRequestOrderIds = requests.map((r) => r.ordenMedicaId);
    const newOrders = labOrders.filter((order) => !existingRequestOrderIds.includes(order.id));

    const newRequests: LaboratoryRequest[] = newOrders.map((order) => ({
      id: `lr-${Date.now()}-${order.id}`,
      ordenMedicaId: order.id,
      pacienteId: order.pacienteId,
      pacienteNombre: order.pacienteNombre,
      estudio: order.estudio,
      fechaSolicitud: order.fechaCreacion,
      estado: "pendiente",
    }));

    newRequests.forEach((req) => addRequest(req));

    return [...requests, ...newRequests].filter((r) => r.estado === "pendiente" || r.estado === "muestra_recolectada");
  }, [orders, requests, addRequest]);

  const handleStartCollection = (requestId: string): void => {
    updateRequest(requestId, {
      estado: "muestra_recolectada",
      fechaRecoleccion: new Date().toISOString().split("T")[0],
      horaRecoleccion: new Date().toTimeString().split(" ")[0].substring(0, 5),
    });
  };

  const statusColors: Record<LaboratoryRequest["estado"], "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
    pendiente: "warning",
    muestra_recolectada: "info",
    en_proceso: "primary",
    completado: "success",
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Solicitudes Lab
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
                      onClick={() => handleStartCollection(request.id)}
                    >
                      Recolectar Muestra
                    </Button>
                  )}
                  {request.estado === "muestra_recolectada" && (
                    <Chip label="Muestra recolectada" color="info" size="small" />
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

export default LaboratoryRequestsPage;

