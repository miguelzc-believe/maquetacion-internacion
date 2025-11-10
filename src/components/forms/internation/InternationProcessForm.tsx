import React, { useState } from "react";
import {
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { InternationProcessData } from "../../../types/internationProcess";
import InternationPatientDataStep from "./InternationPatientDataStep";
import InternationEmergencyContactStep from "./InternationEmergencyContactStep";
import ConsentDocumentsStep from "./ConsentDocumentsStep";
import BedAssignmentStep from "./BedAssignmentStep";
import { updateOrder } from "../../../utils/admissionOrders";

interface InternationProcessFormProps {
  orderId: string;
  patientName: string;
  onClose: () => void;
  onComplete: () => void;
}

const steps = [
  "Datos del Paciente",
  "Datos de Contacto de Emergencia",
  "Documentos de Consentimiento",
  "Asignación de Cama",
];

const InternationProcessForm: React.FC<InternationProcessFormProps> = ({
  orderId,
  patientName,
  onClose,
  onComplete,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<InternationProcessData>({
    orderId,
    patientData: {
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      fechaNacimiento: "",
      sexo: "",
      documento: "",
      direccion: "",
      telefono: "",
      email: "",
    },
    emergencyContact: {
      nombreCompleto: "",
      direccion: "",
      telefono: "",
      email: "",
      parentesco: "",
      telefonoEmergencia: "",
    },
    consentDocuments: {
      consentimientoInformado: null,
      consentimientoQuirurgico: null,
      consentimientoAnestesico: null,
    },
    bedAssignment: {
      habitacion: "",
      cama: "",
    },
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleNext = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = (): void => {
    console.log("Proceso de internación completado:", formData);
    
    updateOrder(orderId, {
      temporal: false,
    });
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onComplete();
      onClose();
    }, 2000);
  };

  const handleCloseSuccess = (): void => {
    setShowSuccess(false);
  };

  const handlePatientDataChange = (
    data: typeof formData.patientData
  ): void => {
    setFormData({
      ...formData,
      patientData: data,
    });
  };

  const handleEmergencyContactChange = (
    data: typeof formData.emergencyContact
  ): void => {
    setFormData({
      ...formData,
      emergencyContact: data,
    });
  };

  const handleConsentDocumentsChange = (
    data: typeof formData.consentDocuments
  ): void => {
    setFormData({
      ...formData,
      consentDocuments: data,
    });
  };

  const handleBedAssignmentChange = (
    data: typeof formData.bedAssignment
  ): void => {
    setFormData({
      ...formData,
      bedAssignment: data,
    });
  };

  const renderStepContent = (step: number): React.ReactElement => {
    switch (step) {
      case 0:
        return (
          <InternationPatientDataStep
            data={formData.patientData}
            onChange={handlePatientDataChange}
          />
        );
      case 1:
        return (
          <InternationEmergencyContactStep
            data={formData.emergencyContact}
            onChange={handleEmergencyContactChange}
          />
        );
      case 2:
        return (
          <ConsentDocumentsStep
            data={formData.consentDocuments}
            onChange={handleConsentDocumentsChange}
          />
        );
      case 3:
        return (
          <BedAssignmentStep
            data={formData.bedAssignment}
            onChange={handleBedAssignmentChange}
          />
        );
      default:
        return <Box />;
    }
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={onClose}
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Volver
          </Button>
          <Typography variant="h4" component="h1">
            Proceso de Internación - {patientName}
          </Typography>
        </Box>
        <Stepper activeStep={activeStep} sx={{ mt: 4, mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 4, mb: 4, minHeight: 400 }}>
          {renderStepContent(activeStep)}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button onClick={onClose} variant="outlined">
            Cancelar
          </Button>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Atrás
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button onClick={handleSubmit} variant="contained">
                Guardar y Finalizar
              </Button>
            ) : (
              <Button onClick={handleNext} variant="contained">
                Siguiente
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          sx={{ width: "100%" }}
        >
          Proceso de internación completado exitosamente
        </Alert>
      </Snackbar>
    </>
  );
};

export default InternationProcessForm;

