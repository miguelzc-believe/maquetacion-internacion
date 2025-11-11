import React from "react";
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from "@mui/material";
import { useAtom } from "jotai";
import { medicalOrdersAtom } from "../../stores/medicalOrdersStore";
import { MedicalOrder } from "../../types/medicalOrder";
import { inpatients } from "../../utils/inpatients";

const MedicalOrdersNursingPage: React.FC = () => {
  const [orders] = useAtom(medicalOrdersAtom);

  const inpatientIds = inpatients.map((p) => p.id);
  const inpatientOrders = orders.filter((order) => 
    inpatientIds.includes(order.pacienteId) && 
    order.estado !== "completada" && 
    order.estado !== "cancelada"
  );

  const statusColors: Record<MedicalOrder["estado"], "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
    pendiente: "warning",
    en_proceso: "info",
    completada: "success",
    cancelada: "error",
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Órdenes Médicas
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total de órdenes pendientes: {inpatientOrders.length}
        </Typography>
      </Paper>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Paciente</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Prioridad</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inpatientOrders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>{order.pacienteNombre}</TableCell>
                <TableCell>{order.tipo}</TableCell>
                <TableCell>{order.descripcion}</TableCell>
                <TableCell>
                  {new Date(order.fechaCreacion).toLocaleDateString("es-ES")}
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.estado}
                    color={statusColors[order.estado]}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.prioridad}
                    color={order.prioridad === "critica" ? "error" : order.prioridad === "urgente" ? "warning" : "default"}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MedicalOrdersNursingPage;

