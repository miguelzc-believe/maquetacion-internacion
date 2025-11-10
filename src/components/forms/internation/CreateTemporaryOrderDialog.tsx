import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Autocomplete,
  MenuItem,
} from "@mui/material";
import { Patient, getPatientFullName, patients } from "../../../utils/patients";
import { doctors } from "../../../utils/doctors";
import { createTemporaryOrder } from "../../../utils/admissionOrders";
import { AdmissionOrder } from "../../../types/admissionOrder";

interface CreateTemporaryOrderDialogProps {
  open: boolean;
  onClose: () => void;
  onOrderCreated: (order: AdmissionOrder) => void;
}

const CreateTemporaryOrderDialog: React.FC<CreateTemporaryOrderDialogProps> = ({
  open,
  onClose,
  onOrderCreated,
}) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [medicoSolicitante, setMedicoSolicitante] = useState("");
  const [medicoACargo, setMedicoACargo] = useState("");
  const [diagnostico, setDiagnostico] = useState("");

  const handleCreate = (): void => {
    if (!selectedPatient || !medicoSolicitante || !medicoACargo || !diagnostico) {
      return;
    }

    const patientName = getPatientFullName(selectedPatient);
    const newOrder = createTemporaryOrder(
      patientName,
      selectedPatient.id,
      medicoSolicitante,
      medicoACargo,
      diagnostico
    );

    onOrderCreated(newOrder);
    handleClose();
  };

  const handleClose = (): void => {
    setSelectedPatient(null);
    setMedicoSolicitante("");
    setMedicoACargo("");
    setDiagnostico("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Crear Orden de Internación Temporal</Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}>
          <Autocomplete
            options={patients}
            getOptionLabel={(option) => getPatientFullName(option)}
            value={selectedPatient}
            onChange={(_event, newValue) => setSelectedPatient(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Buscar Paciente"
                placeholder="Seleccione un paciente"
                required
              />
            )}
          />
          <TextField
            fullWidth
            select
            label="Médico que Solicita"
            value={medicoSolicitante}
            onChange={(e) => setMedicoSolicitante(e.target.value)}
            required
          >
            {doctors.map((doctor) => (
              <MenuItem key={doctor.id} value={doctor.nombre}>
                {doctor.nombre}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            select
            label="Médico a Cargo"
            value={medicoACargo}
            onChange={(e) => setMedicoACargo(e.target.value)}
            required
          >
            {doctors.map((doctor) => (
              <MenuItem key={doctor.id} value={doctor.nombre}>
                {doctor.nombre}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Diagnóstico"
            value={diagnostico}
            onChange={(e) => setDiagnostico(e.target.value)}
            multiline
            rows={3}
            required
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Cancelar
        </Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          disabled={!selectedPatient || !medicoSolicitante || !medicoACargo || !diagnostico}
        >
          Crear Orden Temporal
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTemporaryOrderDialog;

