import { atom } from "jotai";
import { EvolutionNote } from "../types/evolutionNote";

const getStoredNotes = (): EvolutionNote[] => {
  try {
    const stored = localStorage.getItem("evolutionNotes");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading evolution notes:", error);
  }
  return [];
};

const saveNotes = (notes: EvolutionNote[]): void => {
  try {
    localStorage.setItem("evolutionNotes", JSON.stringify(notes));
  } catch (error) {
    console.error("Error saving evolution notes:", error);
  }
};

export const evolutionNotesAtom = atom<EvolutionNote[]>(getStoredNotes());

export const addEvolutionNoteAtom = atom(
  null,
  (get, set, note: EvolutionNote) => {
    const notes = get(evolutionNotesAtom);
    const newNotes = [...notes, note];
    set(evolutionNotesAtom, newNotes);
    saveNotes(newNotes);
  }
);

export const getEvolutionNotesByPatientAtom = atom((get) => {
  return (patientId: string): EvolutionNote[] => {
    const notes = get(evolutionNotesAtom);
    return notes.filter((note) => note.pacienteId === patientId);
  };
});

