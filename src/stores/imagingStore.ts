import { atom } from "jotai";
import { ImagingRequest } from "../types/imagingRequest";

const getStoredRequests = (): ImagingRequest[] => {
  try {
    const stored = localStorage.getItem("imagingRequests");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading imaging requests:", error);
  }
  return [];
};

const saveRequests = (requests: ImagingRequest[]): void => {
  try {
    localStorage.setItem("imagingRequests", JSON.stringify(requests));
  } catch (error) {
    console.error("Error saving imaging requests:", error);
  }
};

export const imagingRequestsAtom = atom<ImagingRequest[]>(getStoredRequests());

export const addImagingRequestAtom = atom(
  null,
  (get, set, request: ImagingRequest) => {
    const requests = get(imagingRequestsAtom);
    const newRequests = [...requests, request];
    set(imagingRequestsAtom, newRequests);
    saveRequests(newRequests);
  }
);

export const updateImagingRequestAtom = atom(
  null,
  (get, set, requestId: string, updates: Partial<ImagingRequest>) => {
    const requests = get(imagingRequestsAtom);
    const updatedRequests = requests.map((request) =>
      request.id === requestId ? { ...request, ...updates } : request
    );
    set(imagingRequestsAtom, updatedRequests);
    saveRequests(updatedRequests);
  }
);

export const getImagingRequestsByStatusAtom = atom((get) => {
  return (status: ImagingRequest["estado"]): ImagingRequest[] => {
    const requests = get(imagingRequestsAtom);
    return requests.filter((request) => request.estado === status);
  };
});

