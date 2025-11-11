export interface NursingNote {
  id: string;
  pacienteId: string;
  fecha: string;
  hora: string;
  contenido: string;
  tipo: "evolucion" | "procedimiento" | "observacion" | "incidente";
  registradoPor: string;
}

