import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material";
import { AppointmentFormData, Appointment } from "../../types/appointment";
import { doctors, getDoctorById } from "../../utils/doctors";
import { specialties } from "../../utils/specialties";
import { getDoctorsBySpecialty } from "../../utils/doctors";
import { patients, getPatientById, getPatientFullName } from "../../utils/patients";

interface AppointmentFormProps {
  onSubmit: (appointment: Appointment) => void;
  existingAppointments: Appointment[];
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  onSubmit,
  existingAppointments,
}) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    pacienteId: "",
    doctorId: "",
    especialidad: "",
    fecha: "",
    horaInicio: "",
    horaFin: "",
    numeroFicha: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [availableDoctors, setAvailableDoctors] = useState(doctors);

  useEffect(() => {
    if (formData.especialidad) {
      const filtered = getDoctorsBySpecialty(formData.especialidad);
      setAvailableDoctors(filtered);
      if (formData.doctorId) {
        const currentDoctor = getDoctorById(formData.doctorId);
        if (!currentDoctor || currentDoctor.especialidad !== formData.especialidad) {
          setFormData((prev) => ({ ...prev, doctorId: "" }));
        }
      }
    } else {
      setAvailableDoctors(doctors);
    }
  }, [formData.especialidad]);

  const selectedDoctor = useMemo(() => {
    return getDoctorById(formData.doctorId);
  }, [formData.doctorId]);

  const appointmentsForDate = useMemo(() => {
    if (!formData.fecha || !formData.doctorId) return [];
    return existingAppointments.filter(
      (apt) =>
        apt.fecha === formData.fecha &&
        apt.doctorId === formData.doctorId &&
        apt.estado !== "cancelada"
    );
  }, [formData.fecha, formData.doctorId, existingAppointments]);

  const availableTickets = useMemo(() => {
    if (!selectedDoctor) return 0;
    return Math.max(0, selectedDoctor.maxTickets - appointmentsForDate.length);
  }, [selectedDoctor, appointmentsForDate.length]);

  const handleChange =
    (field: keyof AppointmentFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setFormData({
        ...formData,
        [field]: event.target.value,
      });
      if (errors[field]) {
        setErrors({
          ...errors,
          [field]: "",
        });
      }
    };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.pacienteId) {
      newErrors.pacienteId = "Seleccione un paciente";
    }
    if (!formData.doctorId) {
      newErrors.doctorId = "Seleccione un médico";
    }
    if (!formData.especialidad) {
      newErrors.especialidad = "Seleccione una especialidad";
    }
    if (!formData.fecha) {
      newErrors.fecha = "Seleccione una fecha";
    } else {
      const selectedDate = new Date(formData.fecha);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.fecha = "No se pueden registrar citas en fechas pasadas";
      }
    }
    if (!formData.horaInicio) {
      newErrors.horaInicio = "Seleccione hora de inicio";
    }
    if (!formData.horaFin) {
      newErrors.horaFin = "Seleccione hora de fin";
    }
    if (formData.horaInicio && formData.horaFin) {
      if (formData.horaFin <= formData.horaInicio) {
        newErrors.horaFin = "La hora de fin debe ser mayor que la hora de inicio";
      }
    }
    if (!formData.numeroFicha) {
      newErrors.numeroFicha = "Ingrese el número de ficha";
    }

    if (availableTickets <= 0) {
      newErrors.doctorId =
        "El médico ha alcanzado el límite de tickets para esta fecha";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (): void => {
    if (!validateForm() || !selectedDoctor) return;

    const selectedPatient = getPatientById(formData.pacienteId);
    if (!selectedPatient) return;

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      doctorId: formData.doctorId,
      doctorNombre: selectedDoctor.nombre,
      especialidad: specialties.find((s) => s.id === formData.especialidad)
        ?.nombre || formData.especialidad,
      fecha: formData.fecha,
      horaInicio: formData.horaInicio,
      horaFin: formData.horaFin,
      numeroFicha: formData.numeroFicha,
      pacienteId: formData.pacienteId,
      pacienteNombre: getPatientFullName(selectedPatient),
      estado: "confirmada",
    };

    onSubmit(newAppointment);
    setFormData({
      pacienteId: "",
      doctorId: "",
      especialidad: "",
      fecha: "",
      horaInicio: "",
      horaFin: "",
      numeroFicha: "",
    });
    setShowSuccess(true);
  };

  const handleCloseSuccess = (): void => {
    setShowSuccess(false);
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Registrar Nueva Cita
        </Typography>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Paciente"
              value={formData.pacienteId}
              onChange={handleChange("pacienteId")}
              error={!!errors.pacienteId}
              helperText={errors.pacienteId}
              required
            >
              {patients.map((patient) => (
                <MenuItem key={patient.id} value={patient.id}>
                  {getPatientFullName(patient)} - {patient.documento}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Especialidad"
              value={formData.especialidad}
              onChange={handleChange("especialidad")}
              error={!!errors.especialidad}
              helperText={errors.especialidad}
              required
            >
              {specialties.map((specialty) => (
                <MenuItem key={specialty.id} value={specialty.id}>
                  {specialty.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Médico"
              value={formData.doctorId}
              onChange={handleChange("doctorId")}
              error={!!errors.doctorId}
              helperText={errors.doctorId || (selectedDoctor && `Tickets disponibles: ${availableTickets}`)}
              required
              disabled={!formData.especialidad}
            >
              {availableDoctors.map((doctor) => (
                <MenuItem key={doctor.id} value={doctor.id}>
                  {doctor.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fecha"
              type="date"
              value={formData.fecha}
              onChange={handleChange("fecha")}
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.fecha}
              helperText={errors.fecha}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Hora de Inicio"
              type="time"
              value={formData.horaInicio}
              onChange={handleChange("horaInicio")}
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.horaInicio}
              helperText={errors.horaInicio}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Hora de Fin"
              type="time"
              value={formData.horaFin}
              onChange={handleChange("horaFin")}
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.horaFin}
              helperText={errors.horaFin}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Número de Ficha"
              value={formData.numeroFicha}
              onChange={handleChange("numeroFicha")}
              error={!!errors.numeroFicha}
              helperText={errors.numeroFicha}
              required
            />
          </Grid>
          {selectedDoctor && formData.fecha && (
            <Grid item xs={12}>
              <Alert severity="info">
                Tickets disponibles para {selectedDoctor.nombre} el{" "}
                {new Date(formData.fecha).toLocaleDateString("es-ES")}:{" "}
                {availableTickets} de {selectedDoctor.maxTickets}
              </Alert>
            </Grid>
          )}
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              fullWidth
              size="large"
            >
              Confirmar Cita
            </Button>
          </Grid>
        </Grid>
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
          Cita registrada exitosamente
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AppointmentForm;
