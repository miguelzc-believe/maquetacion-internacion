export interface ImagingRequest {
  id: string;
  ordenMedicaId: string;
  pacienteId: string;
  pacienteNombre: string;
  estudio: string;
  region: string;
  fechaSolicitud: string;
  estado: "pendiente" | "programado" | "realizado" | "completado" | "en_proceso";
  fechaProgramada?: string;
  fechaRealizacion?: string;
  fechaEstudio?: string;
  informe?: string;
  fechaInforme?: string;
  indicaciones?: string;
  observaciones?: string;
}

