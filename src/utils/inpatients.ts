import { Inpatient } from "../types/inpatient";

export const inpatients: Inpatient[] = [
  {
    id: "inp1",
    pacienteId: "pat1",
    pacienteNombre: "Juan Pérez García",
    fechaIngreso: "2024-01-15",
    fechaNacimiento: "1985-03-15",
    edad: 39,
    diagnostico: "Neumonía bilateral",
    estado: "estable",
    medicoResponsable: "Dr. Carlos Mendoza",
    habitacion: "201",
    cama: "A",
    observaciones: "Paciente responde bien al tratamiento antibiótico",
    alergias: ["Penicilina"],
    medicamentos: ["Amoxicilina 500mg", "Paracetamol 1g"],
  },
  {
    id: "inp2",
    pacienteId: "pat2",
    pacienteNombre: "María López Rodríguez",
    fechaIngreso: "2024-01-18",
    fechaNacimiento: "1990-07-22",
    edad: 33,
    diagnostico: "Apendicitis aguda post-operatorio",
    estado: "mejorando",
    medicoResponsable: "Dr. Luis Pérez",
    habitacion: "205",
    cama: "B",
    observaciones: "Recuperación post-quirúrgica sin complicaciones",
    alergias: [],
    medicamentos: ["Metamizol 500mg", "Amoxicilina 875mg"],
  },
  {
    id: "inp3",
    pacienteId: "pat3",
    pacienteNombre: "Carlos Martínez Sánchez",
    fechaIngreso: "2024-01-20",
    fechaNacimiento: "1978-11-05",
    edad: 45,
    diagnostico: "Insuficiencia cardíaca",
    estado: "grave",
    medicoResponsable: "Dr. Carlos Mendoza",
    habitacion: "301",
    cama: "A",
    observaciones: "Requiere monitoreo constante de signos vitales",
    alergias: ["Ibuprofeno"],
    medicamentos: ["Furosemida 40mg", "Enalapril 10mg", "Digoxina 0.25mg"],
  },
  {
    id: "inp4",
    pacienteId: "pat4",
    pacienteNombre: "Ana González Fernández",
    fechaIngreso: "2024-01-22",
    fechaNacimiento: "1992-04-18",
    edad: 31,
    diagnostico: "Gastroenteritis severa",
    estado: "estable",
    medicoResponsable: "Dra. Ana López",
    habitacion: "202",
    cama: "A",
    observaciones: "Hidratación intravenosa, tolerancia oral mejorando",
    alergias: ["Sulfonamidas"],
    medicamentos: ["Sueros IV", "Loperamida 2mg"],
  },
];

export const getInpatientsByDoctor = (doctorName: string): Inpatient[] => {
  return inpatients.filter((inpatient) => inpatient.medicoResponsable === doctorName);
};

export const getInpatientById = (id: string): Inpatient | undefined => {
  return inpatients.find((inpatient) => inpatient.id === id);
};
