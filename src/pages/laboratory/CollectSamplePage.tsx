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
  MenuItem,
} from "@mui/material";
import { useAtom } from "jotai";
import { laboratoryRequestsAtom, updateLaboratoryRequestAtom } from "../../stores/laboratoryStore";
import { LaboratoryRequest } from "../../types/laboratoryRequest";

const CollectSamplePage: React.FC = () => {
  const [requests] = useAtom(laboratoryRequestsAtom);
  const [, updateRequest] = useAtom(updateLaboratoryRequestAtom);
  const [open, setOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LaboratoryRequest | null>(null);
  const [sampleData, setSampleData] = useState({ muestra: "", hora: "" });

  const pendingSamples = requests.filter((r) => r.estado === "pendiente");

  const handleOpen = (request: LaboratoryRequest): void => {
    setSelectedRequest(request);
    const now = new Date();
    setSampleData({
      muestra: "",
      hora: now.toTimeString().split(" ")[0].substring(0, 5),
    });
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
    setSelectedRequest(null);
    setSampleData({ muestra: "", hora: "" });
  };

  const handleSubmit = (): void => {
    if (!selectedRequest || !sampleData.muestra) return;

    updateRequest(selectedRequest.id, {
      estado: "muestra_recolectada",
      muestra: sampleData.muestra,
      fechaRecoleccion: new Date().toISOString().split("T")[0],
      horaRecoleccion: sampleData.hora,
    });

    handleClose();
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Recolectar Muestra
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Muestras pendientes de recolección: {pendingSamples.length}
        </Typography>
      </Paper>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Paciente</TableCell>
              <TableCell>Estudio</TableCell>
              <TableCell>Fecha Solicitud</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingSamples.map((request) => (
              <TableRow key={request.id} hover>
                <TableCell>{request.pacienteNombre}</TableCell>
                <TableCell>{request.estudio}</TableCell>
                <TableCell>
                  {new Date(request.fechaSolicitud).toLocaleDateString("es-ES")}
                </TableCell>
                <TableCell>
                  <Button variant="contained" size="small" onClick={() => handleOpen(request)}>
                    Recolectar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Recolectar Muestra</DialogTitle>
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
                  select
                  label="Tipo de Muestra"
                  value={sampleData.muestra}
                  onChange={(e) => setSampleData({ ...sampleData, muestra: e.target.value })}
                  required
                >
                  <MenuItem value="sangre">Sangre</MenuItem>
                  <MenuItem value="orina">Orina</MenuItem>
                  <MenuItem value="heces">Heces</MenuItem>
                  <MenuItem value="esputo">Esputo</MenuItem>
                  <MenuItem value="otro">Otro</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Hora de Recolección"
                  type="time"
                  value={sampleData.hora}
                  onChange={(e) => setSampleData({ ...sampleData, hora: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!sampleData.muestra || !sampleData.hora}>
            Registrar Recolección
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CollectSamplePage;

