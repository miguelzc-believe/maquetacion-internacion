import { atom } from "jotai";
import { MedicalOrder } from "../types/medicalOrder";

const getStoredOrders = (): MedicalOrder[] => {
  try {
    const stored = localStorage.getItem("medicalOrders");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading medical orders:", error);
  }
  return [];
};

const saveOrders = (orders: MedicalOrder[]): void => {
  try {
    localStorage.setItem("medicalOrders", JSON.stringify(orders));
  } catch (error) {
    console.error("Error saving medical orders:", error);
  }
};

export const medicalOrdersAtom = atom<MedicalOrder[]>(getStoredOrders());

export const addMedicalOrderAtom = atom(
  null,
  (get, set, order: MedicalOrder) => {
    const orders = get(medicalOrdersAtom);
    const newOrders = [...orders, order];
    set(medicalOrdersAtom, newOrders);
    saveOrders(newOrders);
  }
);

export const updateMedicalOrderAtom = atom(
  null,
  (get, set, orderId: string, updates: Partial<MedicalOrder>) => {
    const orders = get(medicalOrdersAtom);
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, ...updates } : order
    );
    set(medicalOrdersAtom, updatedOrders);
    saveOrders(updatedOrders);
  }
);

export const getMedicalOrdersByPatientAtom = atom((get) => {
  return (patientId: string): MedicalOrder[] => {
    const orders = get(medicalOrdersAtom);
    return orders.filter((order) => order.pacienteId === patientId);
  };
});

export const getMedicalOrdersByTypeAtom = atom((get) => {
  return (type: MedicalOrder["tipo"]): MedicalOrder[] => {
    const orders = get(medicalOrdersAtom);
    return orders.filter((order) => order.tipo === type && order.estado !== "completada" && order.estado !== "cancelada");
  };
});

