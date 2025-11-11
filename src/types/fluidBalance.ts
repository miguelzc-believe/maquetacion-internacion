export interface FluidBalance {
  id: string;
  pacienteId: string;
  fecha: string;
  hora: string;
  ingresos: {
    viaOral: number;
    viaVenosa: number;
    otros: number;
    total: number;
  };
  egresos: {
    orina: number;
    heces: number;
    vomito: number;
    drenajes: number;
    otros: number;
    total: number;
  };
  balance: number;
  observaciones?: string;
  registradoPor: string;
}

