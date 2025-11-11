export interface PharmacyRequest {
  id: string;
  ordenMedicaId: string;
  pacienteId: string;
  pacienteNombre: string;
  medicamento: string;
  dosis: string;
  cantidad: number;
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

