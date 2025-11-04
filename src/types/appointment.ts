export type AppointmentStatus = "pendiente" | "confirmada" | "cancelada";

export interface Doctor {
  id: string;
  nombre: string;
  especialidad: string;
  maxTickets: number;
}

export interface Specialty {
  id: string;
  nombre: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorNombre: string;
  especialidad: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  numeroFicha: string;
  estado: AppointmentStatus;
}

export interface AppointmentFormData {
  doctorId: string;
  especialidad: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  numeroFicha: string;
}
