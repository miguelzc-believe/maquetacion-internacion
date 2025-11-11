import { atom } from "jotai";
import { PatientBudget } from "../types/budget";

const getStoredBudgets = (): PatientBudget[] => {
  try {
    const stored = localStorage.getItem("patientBudgets");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading budgets:", error);
  }
  return [];
};

const saveBudgets = (budgets: PatientBudget[]): void => {
  try {
    localStorage.setItem("patientBudgets", JSON.stringify(budgets));
  } catch (error) {
    console.error("Error saving budgets:", error);
  }
};

export const patientBudgetsAtom = atom<PatientBudget[]>(getStoredBudgets());

export const addPatientBudgetAtom = atom(
  null,
  (get, set, budget: PatientBudget) => {
    const budgets = get(patientBudgetsAtom);
    const newBudgets = [...budgets, budget];
    set(patientBudgetsAtom, newBudgets);
    saveBudgets(newBudgets);
  }
);

export const updatePatientBudgetAtom = atom(
  null,
  (get, set, budgetId: string, updates: Partial<PatientBudget>) => {
    const budgets = get(patientBudgetsAtom);
    const updatedBudgets = budgets.map((budget) =>
      budget.id === budgetId ? { ...budget, ...updates } : budget
    );
    set(patientBudgetsAtom, updatedBudgets);
    saveBudgets(updatedBudgets);
  }
);

