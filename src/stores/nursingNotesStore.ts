import { atom } from "jotai";
import { NursingNote } from "../types/nursingNote";

const getStoredNotes = (): NursingNote[] => {
  try {
    const stored = localStorage.getItem("nursingNotes");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading nursing notes:", error);
  }
  return [];
};

const saveNotes = (notes: NursingNote[]): void => {
  try {
    localStorage.setItem("nursingNotes", JSON.stringify(notes));
  } catch (error) {
    console.error("Error saving nursing notes:", error);
  }
};

export const nursingNotesAtom = atom<NursingNote[]>(getStoredNotes());

export const addNursingNoteAtom = atom(
  null,
  (get, set, note: NursingNote) => {
    const notes = get(nursingNotesAtom);
    const newNotes = [...notes, note];
    set(nursingNotesAtom, newNotes);
    saveNotes(newNotes);
  }
);

export const getNursingNotesByPatientAtom = atom((get) => {
  return (patientId: string): NursingNote[] => {
    const notes = get(nursingNotesAtom);
    return notes.filter((note) => note.pacienteId === patientId);
  };
});

