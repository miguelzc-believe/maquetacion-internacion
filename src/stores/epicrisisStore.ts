import { atom } from "jotai";
import { Epicrisis } from "../types/epicrisis";

const getStoredEpicrisis = (): Epicrisis[] => {
  try {
    const stored = localStorage.getItem("epicrisis");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading epicrisis:", error);
  }
  return [];
};

const saveEpicrisis = (epicrisis: Epicrisis[]): void => {
  try {
    localStorage.setItem("epicrisis", JSON.stringify(epicrisis));
  } catch (error) {
    console.error("Error saving epicrisis:", error);
  }
};

export const epicrisisAtom = atom<Epicrisis[]>(getStoredEpicrisis());

export const addEpicrisisAtom = atom(
  null,
  (get, set, epicrisis: Epicrisis) => {
    const epicrisisList = get(epicrisisAtom);
    const newEpicrisis = [...epicrisisList, epicrisis];
    set(epicrisisAtom, newEpicrisis);
    saveEpicrisis(newEpicrisis);
  }
);

