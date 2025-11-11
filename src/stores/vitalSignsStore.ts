import { atom } from "jotai";
import { VitalSigns } from "../types/vitalSigns";

const getStoredVitalSigns = (): VitalSigns[] => {
  try {
    const stored = localStorage.getItem("vitalSigns");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading vital signs:", error);
  }
  return [];
};

const saveVitalSigns = (vitalSigns: VitalSigns[]): void => {
  try {
    localStorage.setItem("vitalSigns", JSON.stringify(vitalSigns));
  } catch (error) {
    console.error("Error saving vital signs:", error);
  }
};

export const vitalSignsAtom = atom<VitalSigns[]>(getStoredVitalSigns());

export const addVitalSignsAtom = atom(
  null,
  (get, set, vitalSigns: VitalSigns) => {
    const signs = get(vitalSignsAtom);
    const newSigns = [...signs, vitalSigns];
    set(vitalSignsAtom, newSigns);
    saveVitalSigns(newSigns);
  }
);

export const getVitalSignsByPatientAtom = atom((get) => {
  return (patientId: string): VitalSigns[] => {
    const signs = get(vitalSignsAtom);
    return signs.filter((sign) => sign.pacienteId === patientId);
  };
});

