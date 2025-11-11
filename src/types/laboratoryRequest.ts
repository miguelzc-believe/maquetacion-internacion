export interface LaboratoryRequest {
  id: string;
  ordenMedicaId: string;
  pacienteId: string;
  pacienteNombre: string;
  estudio: string;
  fechaSolicitud: string;
  estado: "pendiente" | "muestra_recolectada" | "en_proceso" | "completado";
  muestra?: string;
  horaRecoleccion?: string;
  fechaRecoleccion?: string;
  resultados?: string;
  fechaResultados?: string;
  observaciones?: string;
}

