import React, { useState } from "react";
import {
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import { AdmissionFormData } from "../../types/admission";
import PatientDataStep from "./PatientDataStep";
import InsuranceDataStep from "./InsuranceDataStep";
import EmergencyContactStep from "./EmergencyContactStep";
import AccountResponsibleStep from "./AccountResponsibleStep";

const steps = [
  "Datos del Paciente",
  "Datos del Seguro",
  "Contacto de Emergencia",
  "Responsable de la Cuenta",
];

const initialFormData: AdmissionFormData = {
  patientData: {
    nombre: "Juan",
    apellidoPaterno: "Pérez",
    apellidoMaterno: "García",
    fechaNacimiento: "1985-03-15",
    sexo: "masculino",
    estadoCivil: "casado",
    tipoSeguro: "seguro_social",
  },
  insuranceData: {
    categoria: "A",
    numeroMatricula: "123456",
    numeroCarpeta: "CAR-2024-001",
    matricula: "MAT-789",
    empresa: "Seguro Social Nacional",
    telefono: "555-1234",
    direccion: "Av. Principal 123, Ciudad",
    nombreAsegurado: "Juan Pérez García",
  },
  emergencyContact: {
    nombreCompleto: "María Pérez García",
    direccion: "Av. Principal 123, Ciudad",
    telefono: "555-5678",
    email: "maria.perez@email.com",
    parentesco: "esposa",
    telefonoEmergencia: "555-9999",
  },
  accountResponsible: {
    nombreCompleto: "Juan Pérez García",
    documento: "12345678",
    lugarNacimiento: "Ciudad Capital",
    fechaNacimiento: "1985-03-15",
  },
};

const AdmissionForm: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<AdmissionFormData>(initialFormData);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleNext = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = (): void => {
    console.log("Formulario enviado:", formData);
    setShowSuccess(true);
  };

  const handleCloseSuccess = (): void => {
    setShowSuccess(false);
  };

  const handlePatientDataChange = (data: typeof formData.patientData): void => {
    setFormData({
      ...formData,
      patientData: data,
    });
  };

  const handleInsuranceDataChange = (
    data: typeof formData.insuranceData
  ): void => {
    setFormData({
      ...formData,
      insuranceData: data,
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

  const handleAccountResponsibleChange = (
    data: typeof formData.accountResponsible
  ): void => {
    setFormData({
      ...formData,
      accountResponsible: data,
    });
  };

  const renderStepContent = (step: number): React.ReactElement => {
    switch (step) {
      case 0:
        return (
          <PatientDataStep
            data={formData.patientData}
            onChange={handlePatientDataChange}
          />
        );
      case 1:
        return (
          <InsuranceDataStep
            data={formData.insuranceData}
            onChange={handleInsuranceDataChange}
          />
        );
      case 2:
        return (
          <EmergencyContactStep
            data={formData.emergencyContact}
            onChange={handleEmergencyContactChange}
          />
        );
      case 3:
        return (
          <AccountResponsibleStep
            data={formData.accountResponsible}
            onChange={handleAccountResponsibleChange}
          />
        );
      default:
        return <Box />;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Admisión a Internación
        </Typography>
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
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Atrás
          </Button>
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button onClick={handleSubmit} variant="contained">
                Enviar
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
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          sx={{ width: "100%" }}
        >
          Admisión registrada exitosamente
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdmissionForm;
