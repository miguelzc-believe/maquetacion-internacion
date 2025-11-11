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
  TextField,
  Grid,
  Chip,
} from "@mui/material";
import { useAtom } from "jotai";
import { imagingRequestsAtom, updateImagingRequestAtom } from "../../stores/imagingStore";
import { ImagingRequest } from "../../types/imagingRequest";

const ReportsPage: React.FC = () => {
  const [requests] = useAtom(imagingRequestsAtom);
  const [, updateRequest] = useAtom(updateImagingRequestAtom);
  const [open, setOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ImagingRequest | null>(null);
  const [informe, setInforme] = useState("");

  const readyForReport = requests.filter((r) => r.estado === "en_proceso");

  const handleOpen = (request: ImagingRequest): void => {
    setSelectedRequest(request);
    setInforme(request.informe || "");
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
    setSelectedRequest(null);
    setInforme("");
  };

  const handleSubmit = (): void => {
    if (!selectedRequest || !informe) return;

    updateRequest(selectedRequest.id, {
      estado: "completado",
      informe,
      fechaInforme: new Date().toISOString().split("T")[0],
    });

    handleClose();
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Informes
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Estudios listos para registrar informe: {readyForReport.length}
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
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {readyForReport.map((request) => (
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
                  <Chip
                    label={request.estado}
                    color={request.estado === "completado" ? "success" : "info"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button variant="contained" size="small" onClick={() => handleOpen(request)}>
                    Registrar Informe
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Registrar Informe</DialogTitle>
        <DialogContent dividers>
          {selectedRequest && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Paciente:</strong> {selectedRequest.pacienteNombre}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Estudio:</strong> {selectedRequest.estudio}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Región:</strong> {selectedRequest.region}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Informe del Estudio"
                  value={informe}
                  onChange={(e) => setInforme(e.target.value)}
                  multiline
                  rows={10}
                  required
                  placeholder="Ingrese el informe del estudio de imagen..."
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!informe}>
            Guardar Informe
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportsPage;

