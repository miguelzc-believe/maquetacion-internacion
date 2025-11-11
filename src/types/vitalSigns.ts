export interface VitalSigns {
  id: string;
  pacienteId: string;
  fecha: string;
  hora: string;
  temperatura: number;
  presionArterialSistolica: number;
  presionArterialDiastolica: number;
  frecuenciaCardiaca: number;
  frecuenciaRespiratoria: number;
  saturacionOxigeno: number;
  peso?: number;
  talla?: number;
  imc?: number;
  observaciones?: string;
  registradoPor: string;
}

