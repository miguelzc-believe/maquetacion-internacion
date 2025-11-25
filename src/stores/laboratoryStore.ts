import { atom } from "jotai";
import { LaboratoryRequest } from "../types/laboratoryRequest";

const mockLaboratoryRequests: LaboratoryRequest[] = [
  {
    id: "lr-1",
    ordenMedicaId: "om-lab-1",
    pacienteId: "p-1",
    pacienteNombre: "Juan Pérez",
    estudio: "Hemograma completo",
    fechaSolicitud: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    estado: "muestra_recolectada",
    muestra: "Sangre venosa",
    fechaRecoleccion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    horaRecoleccion: "08:30",
  },
  {
    id: "lr-2",
    ordenMedicaId: "om-lab-2",
    pacienteId: "p-2",
    pacienteNombre: "María González",
    estudio: "Glicemia en ayunas",
    fechaSolicitud: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    estado: "muestra_recolectada",
    muestra: "Sangre venosa",
    fechaRecoleccion: new Date().toISOString().split("T")[0],
    horaRecoleccion: "07:15",
  },
  {
    id: "lr-3",
    ordenMedicaId: "om-lab-3",
    pacienteId: "p-3",
    pacienteNombre: "Carlos Rodríguez",
    estudio: "Perfil lipídico",
    fechaSolicitud: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    estado: "en_proceso",
    muestra: "Sangre venosa",
    fechaRecoleccion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    horaRecoleccion: "09:00",
  },
  {
    id: "lr-4",
    ordenMedicaId: "om-lab-4",
    pacienteId: "p-4",
    pacienteNombre: "Ana Martínez",
    estudio: "Urocultivo",
    fechaSolicitud: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    estado: "pendiente",
  },
  {
    id: "lr-5",
    ordenMedicaId: "om-lab-5",
    pacienteId: "p-5",
    pacienteNombre: "Luis Fernández",
    estudio: "Creatinina y Urea",
    fechaSolicitud: new Date().toISOString().split("T")[0],
    estado: "pendiente",
  },
];

const getStoredRequests = (): LaboratoryRequest[] => {
  try {
    const stored = localStorage.getItem("laboratoryRequests");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Error loading laboratory requests:", error);
  }
  return mockLaboratoryRequests;
};

const saveRequests = (requests: LaboratoryRequest[]): void => {
  try {
    localStorage.setItem("laboratoryRequests", JSON.stringify(requests));
  } catch (error) {
    console.error("Error saving laboratory requests:", error);
  }
};

export const laboratoryRequestsAtom = atom<LaboratoryRequest[]>(getStoredRequests());

export const addLaboratoryRequestAtom = atom(
  null,
  (get, set, request: LaboratoryRequest) => {
    const requests = get(laboratoryRequestsAtom);
    const newRequests = [...requests, request];
    set(laboratoryRequestsAtom, newRequests);
    saveRequests(newRequests);
  }
);

export const updateLaboratoryRequestAtom = atom(
  null,
  (get, set, requestId: string, updates: Partial<LaboratoryRequest>) => {
    const requests = get(laboratoryRequestsAtom);
    const updatedRequests = requests.map((request) =>
      request.id === requestId ? { ...request, ...updates } : request
    );
    set(laboratoryRequestsAtom, updatedRequests);
    saveRequests(updatedRequests);
  }
);

export const getLaboratoryRequestsByStatusAtom = atom((get) => {
  return (status: LaboratoryRequest["estado"]): LaboratoryRequest[] => {
    const requests = get(laboratoryRequestsAtom);
    return requests.filter((request) => request.estado === status);
  };
});

