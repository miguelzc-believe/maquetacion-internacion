export interface Epicrisis {
  id: string;
  pacienteId: string;
  fechaIngreso: string;
  fechaAlta: string;
  motivoIngreso: string;
  diagnosticoIngreso: string;
  diagnosticoAlta: string;
  evolucion: string;
  procedimientosRealizados: string[];
  medicamentosSuministrados: string[];
  recomendaciones: string;
  medicoId: string;
  medicoNombre: string;
  tipoAlta: "alta_medica" | "alta_voluntaria" | "traslado" | "defuncion";
}

