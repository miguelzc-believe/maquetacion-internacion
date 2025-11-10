import React from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { admissionOrders } from "../utils/admissionOrders";
import { AdmissionOrder } from "../types/admissionOrder";

const OrdenesInternacionPage: React.FC = () => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Órdenes de Internación
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Total de órdenes: {admissionOrders.length}
        </Typography>
      </Paper>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" fontWeight="bold">
                  Nombre del Paciente
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight="bold">
                  Médico que Solicita
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight="bold">
                  Médico a Cargo
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight="bold">
                  Fecha de Agendamiento
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight="bold">
                  Diagnóstico
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {admissionOrders.map((order: AdmissionOrder) => (
              <TableRow key={order.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {order.pacienteNombre}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {order.medicoSolicitante}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{order.medicoACargo}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(order.fechaAgendamiento)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{order.diagnostico}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OrdenesInternacionPage;

