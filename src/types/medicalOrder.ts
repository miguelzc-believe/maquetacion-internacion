export type MedicalOrderType = "medicamento" | "laboratorio" | "imagenologia" | "procedimiento" | "dieta" | "otro";

export type MedicalOrderStatus = "pendiente" | "en_proceso" | "completada" | "cancelada";

export interface MedicalOrder {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  tipo: MedicalOrderType;
  descripcion: string;
  fechaCreacion: string;
  fechaEjecucion?: string;
  medicoId: string;
  medicoNombre: string;
  estado: MedicalOrderStatus;
  observaciones?: string;
  prioridad: "normal" | "urgente" | "critica";
}

export interface MedicationOrder extends MedicalOrder {
  tipo: "medicamento";
  medicamento: string;
  dosis: string;
  frecuencia: string;
  via: string;
  duracion: string;
}

export interface LaboratoryOrder extends MedicalOrder {
  tipo: "laboratorio";
  estudio: string;
  muestra?: string;
  horaRecoleccion?: string;
}

export interface ImagingOrder extends MedicalOrder {
  tipo: "imagenologia";
  estudio: string;
  region: string;
  indicaciones?: string;
}

