import React, { useState, useMemo } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Tabs,
  Tab,
} from "@mui/material";
import { useAtom } from "jotai";
import { laboratoryRequestsAtom, addLaboratoryRequestAtom, updateLaboratoryRequestAtom } from "../../stores/laboratoryStore";
import { LaboratoryRequest } from "../../types/laboratoryRequest";
import { medicalOrdersAtom } from "../../stores/medicalOrdersStore";
import { LaboratoryOrder } from "../../types/medicalOrder";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const LaboratoryPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [orders] = useAtom(medicalOrdersAtom);
  const [requests] = useAtom(laboratoryRequestsAtom);
  const [, addRequest] = useAtom(addLaboratoryRequestAtom);
  const [, updateRequest] = useAtom(updateLaboratoryRequestAtom);
  const [open, setOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LaboratoryRequest | null>(null);
  const [resultados, setResultados] = useState("");

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

  const readyForResults = useMemo(() => {
    return requests.filter(
      (r) => r.estado === "muestra_recolectada" || r.estado === "en_proceso"
    );
  }, [requests]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number): void => {
    setTabValue(newValue);
  };

  const handleStartCollection = (requestId: string): void => {
    updateRequest(requestId, {
      estado: "muestra_recolectada",
      fechaRecoleccion: new Date().toISOString().split("T")[0],
      horaRecoleccion: new Date().toTimeString().split(" ")[0].substring(0, 5),
    });
  };

  const handleOpenResults = (request: LaboratoryRequest): void => {
    setSelectedRequest(request);
    setResultados(request.resultados || "");
    setOpen(true);
  };

  const handleCloseResults = (): void => {
    setOpen(false);
    setSelectedRequest(null);
    setResultados("");
  };

  const handleSubmitResults = (): void => {
    if (!selectedRequest || !resultados) return;

    updateRequest(selectedRequest.id, {
      estado: "completado",
      resultados,
      fechaResultados: new Date().toISOString().split("T")[0],
    });

    handleCloseResults();
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
          Laboratorio
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Solicitudes" />
            <Tab label="Resultados" />
          </Tabs>
        </Box>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
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
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
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
                    <Button variant="contained" size="small" onClick={() => handleOpenResults(request)}>
                      Registrar Resultados
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <Dialog open={open} onClose={handleCloseResults} maxWidth="md" fullWidth>
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
          <Button onClick={handleCloseResults}>Cancelar</Button>
          <Button onClick={handleSubmitResults} variant="contained" disabled={!resultados}>
            Guardar Resultados
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LaboratoryPage;

