import { atom } from "jotai";
import { PharmacyRequest } from "../types/pharmacyRequest";

const getStoredRequests = (): PharmacyRequest[] => {
  try {
    const stored = localStorage.getItem("pharmacyRequests");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading pharmacy requests:", error);
  }
  return [];
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

