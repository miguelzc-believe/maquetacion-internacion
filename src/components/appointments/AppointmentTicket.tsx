import React from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import { Print } from "@mui/icons-material";
import { Appointment } from "../../types/appointment";

interface AppointmentTicketProps {
  appointment: Appointment;
  onPrint: () => void;
}

const AppointmentTicket: React.FC<AppointmentTicketProps> = ({
  appointment,
  onPrint,
}) => {
  return (
    <>
      <Box
        sx={{
          display: "block",
          "@media print": {
            display: "none",
          },
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 3,
            maxWidth: 400,
            mx: "auto",
            mb: 2,
          }}
        >
          <Typography variant="h6" align="center" gutterBottom>
            TICKET DE CITA MÉDICA
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Número de Ficha:
            </Typography>
            <Typography variant="h6" gutterBottom>
              {appointment.numeroFicha}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Paciente:
            </Typography>
            <Typography variant="body1" gutterBottom>
              {appointment.pacienteNombre}
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Médico:
            </Typography>
            <Typography variant="body1" gutterBottom>
              {appointment.doctorNombre}
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Especialidad:
            </Typography>
            <Typography variant="body1" gutterBottom>
              {appointment.especialidad}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Fecha:
            </Typography>
            <Typography variant="body1" gutterBottom>
              {new Date(appointment.fecha).toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Hora:
            </Typography>
            <Typography variant="body1" gutterBottom>
              {appointment.horaInicio} - {appointment.horaFin}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="caption" align="center" display="block">
            Gracias por su preferencia
          </Typography>
        </Paper>
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<Print />}
            onClick={onPrint}
            fullWidth
          >
            Imprimir Ticket
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "none",
          "@media print": {
            display: "block",
          },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            maxWidth: 400,
            mx: "auto",
            border: "2px solid #000",
            boxShadow: "none",
          }}
        >
          <Typography variant="h6" align="center" gutterBottom>
            TICKET DE CITA MÉDICA
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Número de Ficha:
            </Typography>
            <Typography variant="h6" gutterBottom>
              {appointment.numeroFicha}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Paciente:
            </Typography>
            <Typography variant="body1" gutterBottom>
              {appointment.pacienteNombre}
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Médico:
            </Typography>
            <Typography variant="body1" gutterBottom>
              {appointment.doctorNombre}
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Especialidad:
            </Typography>
            <Typography variant="body1" gutterBottom>
              {appointment.especialidad}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Fecha:
            </Typography>
            <Typography variant="body1" gutterBottom>
              {new Date(appointment.fecha).toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Hora:
            </Typography>
            <Typography variant="body1" gutterBottom>
              {appointment.horaInicio} - {appointment.horaFin}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="caption" align="center" display="block">
            Gracias por su preferencia
          </Typography>
        </Paper>
      </Box>
    </>
  );
};

export default AppointmentTicket;
