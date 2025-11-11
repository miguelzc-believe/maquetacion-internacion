import { atom } from "jotai";
import { FluidBalance } from "../types/fluidBalance";

const getStoredFluidBalance = (): FluidBalance[] => {
  try {
    const stored = localStorage.getItem("fluidBalance");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading fluid balance:", error);
  }
  return [];
};

const saveFluidBalance = (fluidBalance: FluidBalance[]): void => {
  try {
    localStorage.setItem("fluidBalance", JSON.stringify(fluidBalance));
  } catch (error) {
    console.error("Error saving fluid balance:", error);
  }
};

export const fluidBalanceAtom = atom<FluidBalance[]>(getStoredFluidBalance());

export const addFluidBalanceAtom = atom(
  null,
  (get, set, fluidBalance: FluidBalance) => {
    const balances = get(fluidBalanceAtom);
    const newBalances = [...balances, fluidBalance];
    set(fluidBalanceAtom, newBalances);
    saveFluidBalance(newBalances);
  }
);

export const getFluidBalanceByPatientAtom = atom((get) => {
  return (patientId: string): FluidBalance[] => {
    const balances = get(fluidBalanceAtom);
    return balances.filter((balance) => balance.pacienteId === patientId);
  };
});

