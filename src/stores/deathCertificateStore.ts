import { atom } from "jotai";
import { DeathCertificate } from "../types/deathCertificate";

const getStoredCertificates = (): DeathCertificate[] => {
  try {
    const stored = localStorage.getItem("deathCertificates");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading death certificates:", error);
  }
  return [];
};

const saveCertificates = (certificates: DeathCertificate[]): void => {
  try {
    localStorage.setItem("deathCertificates", JSON.stringify(certificates));
  } catch (error) {
    console.error("Error saving death certificates:", error);
  }
};

export const deathCertificatesAtom = atom<DeathCertificate[]>(getStoredCertificates());

export const addDeathCertificateAtom = atom(
  null,
  (get, set, certificate: DeathCertificate) => {
    const certificates = get(deathCertificatesAtom);
    const newCertificates = [...certificates, certificate];
    set(deathCertificatesAtom, newCertificates);
    saveCertificates(newCertificates);
  }
);

