import React, { useState, useEffect } from "react";
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
  Button,
  Chip,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { refreshOrders } from "../utils/admissionOrders";
import { AdmissionOrder } from "../types/admissionOrder";
import InternationProcessForm from "../components/forms/internation/InternationProcessForm";
import CreateTemporaryOrderDialog from "../components/forms/internation/CreateTemporaryOrderDialog";

const OrdenesInternacionPage: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<AdmissionOrder | null>(
    null
  );
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [orders, setOrders] = useState<AdmissionOrder[]>(refreshOrders());

  useEffect(() => {
    setOrders(refreshOrders());
  }, [selectedOrder]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleRowClick = (order: AdmissionOrder): void => {
    setSelectedOrder(order);
  };

  const handleCloseForm = (): void => {
    setSelectedOrder(null);
  };

  const handleComplete = (): void => {
    setSelectedOrder(null);
  };

  const handleOrderCreated = (order: AdmissionOrder): void => {
    setSelectedOrder(order);
    setShowCreateDialog(false);
  };

  if (selectedOrder) {
    return (
      <InternationProcessForm
        orderId={selectedOrder.id}
        patientName={selectedOrder.pacienteNombre}
        onClose={handleCloseForm}
        onComplete={handleComplete}
      />
    );
  }

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h4" component="h1">
            Órdenes de Internación
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowCreateDialog(true)}
          >
            Nueva Orden de Internación
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Total de órdenes: {orders.length}
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
              <TableCell>
                <Typography variant="subtitle2" fontWeight="bold">
                  Estado
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order: AdmissionOrder) => (
              <TableRow
                key={order.id}
                hover
                onClick={() => handleRowClick(order)}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
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
                <TableCell>
                  {order.temporal && (
                    <Chip label="Temporal" color="warning" size="small" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CreateTemporaryOrderDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onOrderCreated={handleOrderCreated}
      />
    </Box>
  );
};

export default OrdenesInternacionPage;

