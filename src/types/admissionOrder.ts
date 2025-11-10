export interface AdmissionOrder {
  id: string;
  pacienteNombre: string;
  pacienteId?: string;
  medicoSolicitante: string;
  medicoACargo: string;
  fechaAgendamiento: string;
  diagnostico: string;
  temporal?: boolean;
}

