import { atom } from "jotai";
import { PharmacyRequest } from "../types/pharmacyRequest";

const mockPharmacyRequests: PharmacyRequest[] = [
  {
    id: "pr-1",
    ordenMedicaId: "om-1",
    pacienteId: "p-1",
    pacienteNombre: "Juan Pérez",
    habitacion: "201",
    cama: "A",
    enfermera: "María López",
    medicamentos: [
      {
        medicamento: "Paracetamol 500mg",
        dosis: "1 tableta cada 8 horas",
        cantidad: 3,
      },
      {
        medicamento: "Ibuprofeno 400mg",
        dosis: "1 tableta cada 12 horas",
        cantidad: 2,
      },
    ],
    cantidadTotalDia: 5,
    fechaSolicitud: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    estado: "pendiente",
  },
  {
    id: "pr-2",
    ordenMedicaId: "om-2",
    pacienteId: "p-2",
    pacienteNombre: "María González",
    habitacion: "205",
    cama: "B",
    enfermera: "Carmen Ruiz",
    medicamentos: [
      {
        medicamento: "Amoxicilina 500mg",
        dosis: "1 cápsula cada 8 horas",
        cantidad: 3,
      },
      {
        medicamento: "Omeprazol 20mg",
        dosis: "1 cápsula en ayunas",
        cantidad: 1,
      },
    ],
    cantidadTotalDia: 4,
    fechaSolicitud: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    estado: "pendiente",
  },
  {
    id: "pr-3",
    ordenMedicaId: "om-3",
    pacienteId: "p-3",
    pacienteNombre: "Carlos Rodríguez",
    habitacion: "301",
    cama: "A",
    enfermera: "Ana García",
    medicamentos: [
      {
        medicamento: "Metformina 500mg",
        dosis: "1 tableta con las comidas",
        cantidad: 3,
      },
      {
        medicamento: "Losartán 50mg",
        dosis: "1 tableta en ayunas",
        cantidad: 1,
      },
      {
        medicamento: "Aspirina 100mg",
        dosis: "1 tableta al día",
        cantidad: 1,
      },
    ],
    cantidadTotalDia: 5,
    fechaSolicitud: new Date().toISOString().split("T")[0],
    estado: "pendiente",
  },
  {
    id: "pr-4",
    ordenMedicaId: "om-4",
    pacienteId: "p-4",
    pacienteNombre: "Ana Martínez",
    habitacion: "302",
    cama: "B",
    enfermera: "Laura Sánchez",
    medicamentos: [
      {
        medicamento: "Levotiroxina 100mcg",
        dosis: "1 tableta en ayunas",
        cantidad: 1,
      },
      {
        medicamento: "Atorvastatina 20mg",
        dosis: "1 tableta al día",
        cantidad: 1,
      },
    ],
    cantidadTotalDia: 2,
    fechaSolicitud: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    estado: "preparando",
    fechaPreparacion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  },
  {
    id: "pr-5",
    ordenMedicaId: "om-5",
    pacienteId: "p-5",
    pacienteNombre: "Luis Fernández",
    habitacion: "401",
    cama: "A",
    enfermera: "Patricia Torres",
    medicamentos: [
      {
        medicamento: "Insulina NPH",
        dosis: "20 unidades antes del desayuno",
        cantidad: 1,
      },
      {
        medicamento: "Insulina Rápida",
        dosis: "10 unidades antes de cada comida",
        cantidad: 3,
      },
    ],
    cantidadTotalDia: 4,
    fechaSolicitud: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    estado: "listo",
    fechaPreparacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  },
];

const getStoredRequests = (): PharmacyRequest[] => {
  try {
    const stored = localStorage.getItem("pharmacyRequests");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Error loading pharmacy requests:", error);
  }
  return mockPharmacyRequests;
};

const saveRequests = (requests: PharmacyRequest[]): void => {
  try {
    localStorage.setItem("pharmacyRequests", JSON.stringify(requests));
  } catch (error) {
    console.error("Error saving pharmacy requests:", error);
  }
};

export const pharmacyRequestsAtom = atom<PharmacyRequest[]>(getStoredRequests());

export const addPharmacyRequestAtom = atom(
  null,
  (get, set, request: PharmacyRequest) => {
    const requests = get(pharmacyRequestsAtom);
    const newRequests = [...requests, request];
    set(pharmacyRequestsAtom, newRequests);
    saveRequests(newRequests);
  }
);

export const updatePharmacyRequestAtom = atom(
  null,
  (get, set, requestId: string, updates: Partial<PharmacyRequest>) => {
    const requests = get(pharmacyRequestsAtom);
    const updatedRequests = requests.map((request) =>
      request.id === requestId ? { ...request, ...updates } : request
    );
    set(pharmacyRequestsAtom, updatedRequests);
    saveRequests(updatedRequests);
  }
);

export const getPharmacyRequestsByStatusAtom = atom((get) => {
  return (status: PharmacyRequest["estado"]): PharmacyRequest[] => {
    const requests = get(pharmacyRequestsAtom);
    return requests.filter((request) => request.estado === status);
  };
});

