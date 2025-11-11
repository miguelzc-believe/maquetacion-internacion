import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Chip,
  Tabs,
  Tab,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAtom } from "jotai";
import { medicalOrdersAtom, addMedicalOrderAtom } from "../../stores/medicalOrdersStore";
import { MedicalOrder, MedicationOrder, LaboratoryOrder, ImagingOrder } from "../../types/medicalOrder";
import { inpatients } from "../../utils/inpatients";
import { doctors } from "../../utils/doctors";
import { useRole } from "../../contexts/RoleContext";

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

const MedicalOrdersDoctorPage: React.FC = () => {
  const { selectedRole } = useRole();
  const [orders] = useAtom(medicalOrdersAtom);
  const [, addOrder] = useAtom(addMedicalOrderAtom);
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [formData, setFormData] = useState<Partial<MedicalOrder>>({
    tipo: "medicamento",
    descripcion: "",
    prioridad: "normal",
  });

  const handleOpen = (patientId: string): void => {
    setSelectedPatientId(patientId);
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
    setSelectedPatientId("");
    setFormData({
      tipo: "medicamento",
      descripcion: "",
      prioridad: "normal",
    });
    setTabValue(0);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number): void => {
    setTabValue(newValue);
    const tipos: MedicalOrder["tipo"][] = ["medicamento", "laboratorio", "imagenologia"];
    setFormData({ ...formData, tipo: tipos[newValue] });
  };

  const handleSubmit = (): void => {
    if (!selectedPatientId || !formData.descripcion) return;

    const patient = inpatients.find((p) => p.id === selectedPatientId);
    if (!patient) return;

    const doctor = doctors[0];
    const now = new Date();

    let newOrder: MedicalOrder;

    if (formData.tipo === "medicamento") {
      const medOrder = formData as Partial<MedicationOrder>;
      newOrder = {
        id: `mo-${Date.now()}`,
        pacienteId: selectedPatientId,
        pacienteNombre: patient.pacienteNombre,
        tipo: "medicamento",
        descripcion: formData.descripcion,
        fechaCreacion: now.toISOString().split("T")[0],
        medicoId: doctor.id,
        medicoNombre: doctor.nombre,
        estado: "pendiente",
        prioridad: formData.prioridad || "normal",
        medicamento: medOrder.medicamento || "",
        dosis: medOrder.dosis || "",
        frecuencia: medOrder.frecuencia || "",
        via: medOrder.via || "",
        duracion: medOrder.duracion || "",
      } as MedicationOrder;
    } else if (formData.tipo === "laboratorio") {
      newOrder = {
        id: `mo-${Date.now()}`,
        pacienteId: selectedPatientId,
        pacienteNombre: patient.pacienteNombre,
        tipo: "laboratorio",
        descripcion: formData.descripcion,
        fechaCreacion: now.toISOString().split("T")[0],
        medicoId: doctor.id,
        medicoNombre: doctor.nombre,
        estado: "pendiente",
        prioridad: formData.prioridad || "normal",
        estudio: (formData as Partial<LaboratoryOrder>).estudio || "",
      } as LaboratoryOrder;
    } else {
      newOrder = {
        id: `mo-${Date.now()}`,
        pacienteId: selectedPatientId,
        pacienteNombre: patient.pacienteNombre,
        tipo: "imagenologia",
        descripcion: formData.descripcion,
        fechaCreacion: now.toISOString().split("T")[0],
        medicoId: doctor.id,
        medicoNombre: doctor.nombre,
        estado: "pendiente",
        prioridad: formData.prioridad || "normal",
        estudio: (formData as Partial<ImagingOrder>).estudio || "",
        region: (formData as Partial<ImagingOrder>).region || "",
      } as ImagingOrder;
    }

    addOrder(newOrder);
    handleClose();
  };

  const patientOrders = orders.filter((order) => order.pacienteId === selectedPatientId);

  const statusColors: Record<MedicalOrder["estado"], "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
    pendiente: "warning",
    en_proceso: "info",
    completada: "success",
    cancelada: "error",
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h4" component="h1">
            Órdenes Médicas
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Seleccione un paciente para crear órdenes médicas
        </Typography>
        <Grid container spacing={2}>
          {inpatients.map((patient) => (
            <Grid item xs={12} sm={6} md={4} key={patient.id}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {patient.pacienteNombre}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Habitación: {patient.habitacion} - Cama {patient.cama}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => handleOpen(patient.id)}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Nueva Orden
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Crear Orden Médica</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Medicamento" />
              <Tab label="Laboratorio" />
              <Tab label="Imagenología" />
            </Tabs>
          </Box>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Prioridad"
                value={formData.prioridad}
                onChange={(e) =>
                  setFormData({ ...formData, prioridad: e.target.value as MedicalOrder["prioridad"] })
                }
              >
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="urgente">Urgente</MenuItem>
                <MenuItem value="critica">Crítica</MenuItem>
              </TextField>
            </Grid>

            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Medicamento"
                    value={(formData as Partial<MedicationOrder>).medicamento || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, medicamento: e.target.value } as Partial<MedicationOrder>)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Dosis"
                    value={(formData as Partial<MedicationOrder>).dosis || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, dosis: e.target.value } as Partial<MedicationOrder>)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Frecuencia"
                    value={(formData as Partial<MedicationOrder>).frecuencia || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, frecuencia: e.target.value } as Partial<MedicationOrder>)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Vía"
                    value={(formData as Partial<MedicationOrder>).via || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, via: e.target.value } as Partial<MedicationOrder>)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Duración"
                    value={(formData as Partial<MedicationOrder>).duracion || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, duracion: e.target.value } as Partial<MedicationOrder>)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descripción"
                    multiline
                    rows={3}
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Estudio"
                    value={(formData as Partial<LaboratoryOrder>).estudio || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, estudio: e.target.value } as Partial<LaboratoryOrder>)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descripción"
                    multiline
                    rows={3}
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Estudio"
                    value={(formData as Partial<ImagingOrder>).estudio || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, estudio: e.target.value } as Partial<ImagingOrder>)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Región"
                    value={(formData as Partial<ImagingOrder>).region || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, region: e.target.value } as Partial<ImagingOrder>)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descripción"
                    multiline
                    rows={3}
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  />
                </Grid>
              </Grid>
            </TabPanel>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!formData.descripcion}>
            Crear Orden
          </Button>
        </DialogActions>
      </Dialog>

      {selectedPatientId && patientOrders.length > 0 && (
        <TableContainer component={Paper} elevation={3} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Prioridad</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patientOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    {new Date(order.fechaCreacion).toLocaleDateString("es-ES")}
                  </TableCell>
                  <TableCell>{order.tipo}</TableCell>
                  <TableCell>{order.descripcion}</TableCell>
                  <TableCell>
                    <Chip label={order.estado} color={statusColors[order.estado]} size="small" />
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
      )}
    </Box>
  );
};

export default MedicalOrdersDoctorPage;

