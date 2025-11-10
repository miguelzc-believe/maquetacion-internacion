import { AdmissionOrder } from "../types/admissionOrder";

const initialOrders: AdmissionOrder[] = [
  {
    id: "1",
    pacienteNombre: "Juan Pérez",
    medicoSolicitante: "Dr. Carlos García",
    medicoACargo: "Dr. María López",
    fechaAgendamiento: "2024-01-15",
    diagnostico: "Neumonía bilateral",
    temporal: false,
  },
  {
    id: "2",
    pacienteNombre: "Ana Martínez",
    medicoSolicitante: "Dr. Roberto Sánchez",
    medicoACargo: "Dr. María López",
    fechaAgendamiento: "2024-01-16",
    diagnostico: "Fractura de cadera",
    temporal: false,
  },
  {
    id: "3",
    pacienteNombre: "Luis Rodríguez",
    medicoSolicitante: "Dr. Carlos García",
    medicoACargo: "Dr. José Fernández",
    fechaAgendamiento: "2024-01-17",
    diagnostico: "Apendicitis aguda",
    temporal: false,
  },
  {
    id: "4",
    pacienteNombre: "Carmen Silva",
    medicoSolicitante: "Dr. Roberto Sánchez",
    medicoACargo: "Dr. María López",
    fechaAgendamiento: "2024-01-18",
    diagnostico: "Insuficiencia cardíaca",
    temporal: false,
  },
  {
    id: "5",
    pacienteNombre: "Pedro González",
    medicoSolicitante: "Dr. José Fernández",
    medicoACargo: "Dr. José Fernández",
    fechaAgendamiento: "2024-01-19",
    diagnostico: "Colecistitis",
    temporal: false,
  },
];

let admissionOrdersList: AdmissionOrder[] = [...initialOrders];

const getStoredOrders = (): AdmissionOrder[] => {
  try {
    const stored = localStorage.getItem("admissionOrders");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading admission orders:", error);
  }
  return [...initialOrders];
};

const saveOrders = (orders: AdmissionOrder[]): void => {
  try {
    localStorage.setItem("admissionOrders", JSON.stringify(orders));
  } catch (error) {
    console.error("Error saving admission orders:", error);
  }
};

admissionOrdersList = getStoredOrders();

export const admissionOrders = admissionOrdersList;

export const getOrderByPatientId = (patientId: string): AdmissionOrder | undefined => {
  return admissionOrdersList.find(
    (order) => order.pacienteId === patientId && !order.temporal
  );
};

export const getOrderByPatientName = (patientName: string): AdmissionOrder | undefined => {
  return admissionOrdersList.find(
    (order) => order.pacienteNombre.toLowerCase() === patientName.toLowerCase() && !order.temporal
  );
};

export const createTemporaryOrder = (
  pacienteNombre: string,
  pacienteId: string,
  medicoSolicitante: string,
  medicoACargo: string,
  diagnostico: string
): AdmissionOrder => {
  const newOrder: AdmissionOrder = {
    id: `temp-${Date.now()}`,
    pacienteNombre,
    pacienteId,
    medicoSolicitante,
    medicoACargo,
    fechaAgendamiento: new Date().toISOString().split("T")[0],
    diagnostico,
    temporal: true,
  };
  admissionOrdersList = [...admissionOrdersList, newOrder];
  saveOrders(admissionOrdersList);
  return newOrder;
};

export const addOrder = (order: AdmissionOrder): void => {
  admissionOrdersList = [...admissionOrdersList, order];
  saveOrders(admissionOrdersList);
};

export const updateOrder = (orderId: string, updates: Partial<AdmissionOrder>): void => {
  admissionOrdersList = admissionOrdersList.map((order) =>
    order.id === orderId ? { ...order, ...updates } : order
  );
  saveOrders(admissionOrdersList);
};

export const refreshOrders = (): AdmissionOrder[] => {
  admissionOrdersList = getStoredOrders();
  return admissionOrdersList;
};

