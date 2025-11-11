export interface DeathCertificate {
  id: string;
  pacienteId: string;
  fechaDefuncion: string;
  horaDefuncion: string;
  causaMuerte: string;
  lugarDefuncion: string;
  medicoId: string;
  medicoNombre: string;
  observaciones?: string;
}

