import React, { useState, useMemo } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  CalendarToday,
  CalendarMonth,
  ViewWeek,
  Today,
} from "@mui/icons-material";
import { Appointment } from "../../types/appointment";

interface AppointmentCalendarProps {
  appointments: Appointment[];
}

type ViewMode = "month" | "week" | "day";

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  appointments,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("month");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const handlePreviousMonth = (): void => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = (): void => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handlePreviousWeek = (): void => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = (): void => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handlePreviousDay = (): void => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = (): void => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const handleViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newViewMode: ViewMode | null
  ): void => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  const getAppointmentsForDate = (date: Date): Appointment[] => {
    const dateStr = date.toISOString().split("T")[0];
    return appointments.filter((apt) => apt.fecha === dateStr);
  };

  const handleDateClick = (day: number): void => {
    const date = new Date(year, month, day);
    setSelectedDate(date);
    setOpenDialog(true);
  };

  const isToday = (day: number): boolean => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  const calendarDays = useMemo(() => {
    const days: Array<number | null> = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  }, [startingDayOfWeek, daysInMonth]);

  const weekDates = useMemo((): Date[] => {
    const dates: Date[] = [];
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(startOfWeek);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [currentDate]);

  const getWeekRange = (): string => {
    const firstDay = weekDates[0];
    const lastDay = weekDates[6];
    return `${firstDay.getDate()}/${
      firstDay.getMonth() + 1
    } - ${lastDay.getDate()}/${
      lastDay.getMonth() + 1
    }/${lastDay.getFullYear()}`;
  };

  const selectedDateAppointments = useMemo(() => {
    if (!selectedDate) return [];
    const dateStr = selectedDate.toISOString().split("T")[0];
    return appointments.filter((apt) => apt.fecha === dateStr);
  }, [selectedDate, appointments]);

  const dayAppointments = useMemo(() => {
    const dateStr = currentDate.toISOString().split("T")[0];
    return appointments.filter((apt) => apt.fecha === dateStr);
  }, [currentDate, appointments]);

  const renderMonthView = (): React.ReactElement => {
    return (
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <IconButton onClick={handlePreviousMonth}>
            <ChevronLeft />
          </IconButton>
          <Typography variant="h5" component="h2">
            {monthNames[month]} {year}
          </Typography>
          <IconButton onClick={handleNextMonth}>
            <ChevronRight />
          </IconButton>
        </Box>
        <Grid container spacing={0.5}>
          {weekDays.map((day) => (
            <Grid item xs={12 / 7} key={day}>
              <Paper
                elevation={0}
                sx={{
                  p: 1,
                  textAlign: "center",
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                }}
              >
                <Typography variant="caption" fontWeight="bold">
                  {day}
                </Typography>
              </Paper>
            </Grid>
          ))}
          {calendarDays.map((day, index) => {
            if (day === null) {
              return (
                <Grid item xs={12 / 7} key={`empty-${index}`}>
                  <Box sx={{ height: 80 }} />
                </Grid>
              );
            }
            const date = new Date(year, month, day);
            const dayAppointments = getAppointmentsForDate(date);
            const today = isToday(day);

            return (
              <Grid item xs={12 / 7} key={day}>
                <Paper
                  elevation={today ? 3 : 1}
                  sx={{
                    p: 1,
                    minHeight: 80,
                    cursor: "pointer",
                    backgroundColor: today
                      ? "primary.light"
                      : "background.paper",
                    border: today ? "2px solid" : "1px solid",
                    borderColor: today ? "primary.main" : "divider",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                  onClick={() => handleDateClick(day)}
                >
                  <Typography
                    variant="body2"
                    fontWeight={today ? "bold" : "normal"}
                    align="center"
                  >
                    {day}
                  </Typography>
                  {dayAppointments.length > 0 && (
                    <Box sx={{ mt: 0.5 }}>
                      <Chip
                        label={dayAppointments.length}
                        size="small"
                        color="primary"
                        sx={{ fontSize: "0.7rem", height: 20 }}
                      />
                    </Box>
                  )}
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </>
    );
  };

  const renderWeekView = (): React.ReactElement => {
    return (
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <IconButton onClick={handlePreviousWeek}>
            <ChevronLeft />
          </IconButton>
          <Typography variant="h5" component="h2">
            Semana del {getWeekRange()}
          </Typography>
          <IconButton onClick={handleNextWeek}>
            <ChevronRight />
          </IconButton>
        </Box>
        <Grid container spacing={1}>
          {weekDays.map((day, index) => (
            <Grid item xs={12 / 7} key={day}>
              <Paper
                elevation={0}
                sx={{
                  p: 1,
                  textAlign: "center",
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                }}
              >
                <Typography variant="caption" fontWeight="bold">
                  {day}
                </Typography>
              </Paper>
            </Grid>
          ))}
          {weekDates.map((date, index) => {
            const dateAppointments = getAppointmentsForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            const isCurrentMonth = date.getMonth() === month;

            return (
              <Grid item xs={12 / 7} key={index}>
                <Paper
                  elevation={isToday ? 3 : 1}
                  sx={{
                    p: 1,
                    minHeight: 150,
                    cursor: "pointer",
                    backgroundColor: isToday
                      ? "primary.light"
                      : "background.paper",
                    border: isToday ? "2px solid" : "1px solid",
                    borderColor: isToday ? "primary.main" : "divider",
                    opacity: isCurrentMonth ? 1 : 0.5,
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                  onClick={() => {
                    setSelectedDate(date);
                    setOpenDialog(true);
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={isToday ? "bold" : "normal"}
                    align="center"
                  >
                    {date.getDate()}
                  </Typography>
                  {dateAppointments.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      {dateAppointments.slice(0, 3).map((apt) => (
                        <Chip
                          key={apt.id}
                          label={`${apt.horaInicio} - ${
                            apt.doctorNombre.split(" ")[1]
                          }`}
                          size="small"
                          color="primary"
                          sx={{
                            fontSize: "0.65rem",
                            height: 18,
                            mb: 0.5,
                            display: "block",
                            width: "100%",
                          }}
                        />
                      ))}
                      {dateAppointments.length > 3 && (
                        <Typography variant="caption" color="text.secondary">
                          +{dateAppointments.length - 3} más
                        </Typography>
                      )}
                    </Box>
                  )}
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </>
    );
  };

  const renderDayView = (): React.ReactElement => {
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <IconButton onClick={handlePreviousDay}>
            <ChevronLeft />
          </IconButton>
          <Typography variant="h5" component="h2">
            {currentDate.toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
          <IconButton onClick={handleNextDay}>
            <ChevronRight />
          </IconButton>
        </Box>
        <Paper elevation={1} sx={{ p: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {hours.map((hour) => {
              const hourAppointments = dayAppointments.filter((apt) => {
                const aptStartHour = parseInt(apt.horaInicio.split(":")[0]);
                return aptStartHour === hour;
              });

              return (
                <Box
                  key={hour}
                  sx={{
                    display: "flex",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    pb: 1,
                    minHeight: 60,
                  }}
                >
                  <Box sx={{ minWidth: 80, pt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {hour.toString().padStart(2, "0")}:00
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, pl: 2 }}>
                    {hourAppointments.map((apt) => (
                      <Paper
                        key={apt.id}
                        elevation={1}
                        sx={{
                          p: 1,
                          mb: 1,
                          backgroundColor: "primary.light",
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: "primary.main",
                            color: "primary.contrastText",
                          },
                        }}
                        onClick={() => {
                          setSelectedDate(currentDate);
                          setOpenDialog(true);
                        }}
                      >
                        <Typography variant="body2" fontWeight="bold">
                          {apt.horaInicio} - {apt.horaFin}
                        </Typography>
                        <Typography variant="caption" display="block">
                          {apt.doctorNombre} - {apt.especialidad}
                        </Typography>
                        <Typography variant="caption" display="block">
                          Ficha: {apt.numeroFicha}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Paper>
      </>
    );
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box sx={{ flex: 1 }} />
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="vista del calendario"
            size="small"
          >
            <ToggleButton value="month" aria-label="vista mensual">
              <CalendarMonth sx={{ mr: 1 }} />
              Mes
            </ToggleButton>
            <ToggleButton value="week" aria-label="vista semanal">
              <ViewWeek sx={{ mr: 1 }} />
              Semana
            </ToggleButton>
            <ToggleButton value="day" aria-label="vista diaria">
              <Today sx={{ mr: 1 }} />
              Día
            </ToggleButton>
          </ToggleButtonGroup>
          <Box sx={{ flex: 1 }} />
        </Box>
        <Divider sx={{ mb: 3 }} />
        {viewMode === "month" && renderMonthView()}
        {viewMode === "week" && renderWeekView()}
        {viewMode === "day" && renderDayView()}
      </Paper>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarToday />
            <Typography variant="h6">
              {selectedDate
                ? selectedDate.toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : ""}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedDateAppointments.length === 0 ? (
            <Typography color="text.secondary">
              No hay citas registradas para esta fecha
            </Typography>
          ) : (
            <List>
              {selectedDateAppointments.map((appointment) => (
                <ListItem key={appointment.id}>
                  <ListItemText
                    primary={`${appointment.horaInicio} - ${appointment.horaFin}`}
                    secondary={
                      <Box>
                        <Typography variant="body2">
                          {appointment.pacienteNombre}
                        </Typography>
                        <Typography variant="body2">
                          {appointment.doctorNombre}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {appointment.especialidad} - Ficha:{" "}
                          {appointment.numeroFicha}
                        </Typography>
                      </Box>
                    }
                  />
                  <Chip
                    label={appointment.estado}
                    size="small"
                    color={
                      appointment.estado === "confirmada"
                        ? "success"
                        : appointment.estado === "cancelada"
                        ? "error"
                        : "default"
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentCalendar;
