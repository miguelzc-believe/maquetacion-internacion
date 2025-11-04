import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, Container } from "@mui/material";
import { Appointment } from "../../types/appointment";
import AppointmentForm from "./AppointmentForm";
import AppointmentCalendar from "./AppointmentCalendar";
import AppointmentTicket from "./AppointmentTicket";

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

const AppointmentsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [ticketAppointment, setTicketAppointment] = useState<Appointment | null>(null);
  const [showTicket, setShowTicket] = useState(false);

  useEffect(() => {
    const storedAppointments = localStorage.getItem("appointments");
    if (storedAppointments) {
      try {
        setAppointments(JSON.parse(storedAppointments));
      } catch (error) {
        console.error("Error loading appointments:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (appointments.length > 0) {
      localStorage.setItem("appointments", JSON.stringify(appointments));
    }
  }, [appointments]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number): void => {
    setTabValue(newValue);
  };

  const handleAppointmentSubmit = (appointment: Appointment): void => {
    setAppointments((prev) => [...prev, appointment]);
    setTicketAppointment(appointment);
    setShowTicket(true);
    setTabValue(1);
  };

  const handlePrintTicket = (): void => {
    window.print();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Registrar Cita" />
          <Tab label="Calendario" />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <AppointmentForm
          onSubmit={handleAppointmentSubmit}
          existingAppointments={appointments}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <AppointmentCalendar appointments={appointments} />
      </TabPanel>
      {showTicket && ticketAppointment && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1300,
            p: 2,
          }}
          onClick={() => setShowTicket(false)}
        >
          <Box
            sx={{
              backgroundColor: "background.paper",
              p: 3,
              borderRadius: 2,
              maxWidth: 500,
              width: "100%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <AppointmentTicket
              appointment={ticketAppointment}
              onPrint={handlePrintTicket}
            />
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default AppointmentsPage;
