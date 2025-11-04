export type InpatientStatus = "estable" | "grave" | "critico" | "mejorando" | "alta";

export interface Inpatient {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  fechaIngreso: string;
  fechaNacimiento: string;
  edad: number;
  diagnostico: string;
  estado: InpatientStatus;
  medicoResponsable: string;
  habitacion: string;
  cama: string;
  observaciones: string;
  alergias: string[];
  medicamentos: string[];
}
