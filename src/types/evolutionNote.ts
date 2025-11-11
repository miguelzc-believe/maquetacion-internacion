export interface EvolutionNote {
  id: string;
  pacienteId: string;
  fecha: string;
  hora: string;
  motivoConsulta?: string;
  sintomas: string;
  examenFisico: string;
  diagnostico: string;
  planTratamiento: string;
  observaciones?: string;
  medicoId: string;
  medicoNombre: string;
}

