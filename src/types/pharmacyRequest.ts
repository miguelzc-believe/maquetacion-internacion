export interface MedicationItem {
  medicamento: string;
  dosis: string;
  cantidad: number;
}

export interface PharmacyRequest {
  id: string;
  ordenMedicaId: string;
  pacienteId: string;
  pacienteNombre: string;
  habitacion: string;
  cama: string;
  enfermera: string;
  medicamentos: MedicationItem[];
  cantidadTotalDia: number;
  fechaSolicitud: string;
  estado: "pendiente" | "preparando" | "listo" | "entregado" | "devuelto";
  fechaPreparacion?: string;
  fechaEntrega?: string;
  observaciones?: string;
  devolucion?: {
    cantidad: number;
    motivo: string;
    fecha: string;
  };
}

