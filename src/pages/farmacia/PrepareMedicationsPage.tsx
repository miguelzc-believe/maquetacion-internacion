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
  Stack,
} from "@mui/material";
import { useAtom } from "jotai";
import { pharmacyRequestsAtom, updatePharmacyRequestAtom } from "../../stores/pharmacyStore";
import { PharmacyRequest } from "../../types/pharmacyRequest";

const PrepareMedicationsPage: React.FC = () => {
  const [requests] = useAtom(pharmacyRequestsAtom);
  const [, updateRequest] = useAtom(updatePharmacyRequestAtom);

  const preparingRequests = useMemo(
    () => requests.filter((r) => r.estado === "preparando" || r.estado === "listo"),
    [requests]
  );

  const handleMarkReady = (requestId: string): void => {
    updateRequest(requestId, {
      estado: "listo",
    });
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
          Preparar Medicamentos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Medicamentos en preparación: {preparingRequests.length}
        </Typography>
      </Paper>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Paciente</TableCell>
              <TableCell>Ubicación</TableCell>
              <TableCell>Medicamentos</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {preparingRequests.map((request) => (
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
                  <Chip label={request.estado} color={statusColors[request.estado]} size="small" />
                </TableCell>
                <TableCell>
                  {request.estado === "preparando" && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleMarkReady(request.id)}
                    >
                      Marcar Listo
                    </Button>
                  )}
                  {request.estado === "listo" && (
                    <Chip label="Listo para entrega" color="success" size="small" />
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

export default PrepareMedicationsPage;

