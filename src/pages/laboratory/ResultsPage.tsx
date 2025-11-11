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
import { laboratoryRequestsAtom, updateLaboratoryRequestAtom } from "../../stores/laboratoryStore";
import { LaboratoryRequest } from "../../types/laboratoryRequest";

const ResultsPage: React.FC = () => {
  const [requests] = useAtom(laboratoryRequestsAtom);
  const [, updateRequest] = useAtom(updateLaboratoryRequestAtom);
  const [open, setOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LaboratoryRequest | null>(null);
  const [resultados, setResultados] = useState("");

  const readyForResults = requests.filter(
    (r) => r.estado === "muestra_recolectada" || r.estado === "en_proceso"
  );

  const handleOpen = (request: LaboratoryRequest): void => {
    setSelectedRequest(request);
    setResultados(request.resultados || "");
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
    setSelectedRequest(null);
    setResultados("");
  };

  const handleSubmit = (): void => {
    if (!selectedRequest || !resultados) return;

    updateRequest(selectedRequest.id, {
      estado: "completado",
      resultados,
      fechaResultados: new Date().toISOString().split("T")[0],
    });

    handleClose();
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Resultados
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Estudios listos para registrar resultados: {readyForResults.length}
        </Typography>
      </Paper>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Paciente</TableCell>
              <TableCell>Estudio</TableCell>
              <TableCell>Muestra</TableCell>
              <TableCell>Fecha Recolección</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {readyForResults.map((request) => (
              <TableRow key={request.id} hover>
                <TableCell>{request.pacienteNombre}</TableCell>
                <TableCell>{request.estudio}</TableCell>
                <TableCell>{request.muestra || "-"}</TableCell>
                <TableCell>
                  {request.fechaRecoleccion
                    ? new Date(request.fechaRecoleccion).toLocaleDateString("es-ES")
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
                    Registrar Resultados
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Registrar Resultados</DialogTitle>
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
                <TextField
                  fullWidth
                  label="Resultados"
                  value={resultados}
                  onChange={(e) => setResultados(e.target.value)}
                  multiline
                  rows={10}
                  required
                  placeholder="Ingrese los resultados del estudio..."
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!resultados}>
            Guardar Resultados
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResultsPage;

