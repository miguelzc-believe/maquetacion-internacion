import { atom } from "jotai";
import { LaboratoryRequest } from "../types/laboratoryRequest";

const getStoredRequests = (): LaboratoryRequest[] => {
  try {
    const stored = localStorage.getItem("laboratoryRequests");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading laboratory requests:", error);
  }
  return [];
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

