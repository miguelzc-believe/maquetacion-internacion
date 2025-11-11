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
} from "@mui/material";
import { useAtom } from "jotai";
import { imagingRequestsAtom } from "../../stores/imagingStore";
import { ImagingRequest } from "../../types/imagingRequest";

const PerformStudyPage: React.FC = () => {
  const [requests] = useAtom(imagingRequestsAtom);

  const inProgressStudies = useMemo(
    () => requests.filter((r) => r.estado === "en_proceso"),
    [requests]
  );

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Realizar Estudio
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Estudios en proceso: {inProgressStudies.length}
        </Typography>
      </Paper>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Paciente</TableCell>
              <TableCell>Estudio</TableCell>
              <TableCell>Región</TableCell>
              <TableCell>Fecha Estudio</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inProgressStudies.map((request) => (
              <TableRow key={request.id} hover>
                <TableCell>{request.pacienteNombre}</TableCell>
                <TableCell>{request.estudio}</TableCell>
                <TableCell>{request.region}</TableCell>
                <TableCell>
                  {request.fechaEstudio
                    ? new Date(request.fechaEstudio).toLocaleDateString("es-ES")
                    : "-"}
                </TableCell>
                <TableCell>
                  <Chip label={request.estado} color="info" size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PerformStudyPage;

