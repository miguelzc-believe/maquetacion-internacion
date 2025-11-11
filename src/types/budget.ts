export interface BudgetItem {
  concepto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface PatientBudget {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  fechaIngreso: string;
  fechaAlta?: string;
  items: BudgetItem[];
  subtotal: number;
  descuentos: number;
  total: number;
  estado: "borrador" | "revisado" | "aprobado" | "en_caja" | "pagado";
  observaciones?: string;
}

