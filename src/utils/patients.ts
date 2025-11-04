export interface Patient {
  id: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  documento: string;
  fechaNacimiento: string;
  telefono: string;
}

export const patients: Patient[] = [
  {
    id: "pat1",
    nombre: "Juan",
    apellidoPaterno: "Pérez",
    apellidoMaterno: "García",
    documento: "12345678",
    fechaNacimiento: "1985-03-15",
    telefono: "555-1234",
  },
  {
    id: "pat2",
    nombre: "María",
    apellidoPaterno: "López",
    apellidoMaterno: "Rodríguez",
    documento: "23456789",
    fechaNacimiento: "1990-07-22",
    telefono: "555-5678",
  },
  {
    id: "pat3",
    nombre: "Carlos",
    apellidoPaterno: "Martínez",
    apellidoMaterno: "Sánchez",
    documento: "34567890",
    fechaNacimiento: "1978-11-05",
    telefono: "555-9012",
  },
  {
    id: "pat4",
    nombre: "Ana",
    apellidoPaterno: "González",
    apellidoMaterno: "Fernández",
    documento: "45678901",
    fechaNacimiento: "1992-04-18",
    telefono: "555-3456",
  },
  {
    id: "pat5",
    nombre: "Roberto",
    apellidoPaterno: "Silva",
    apellidoMaterno: "Torres",
    documento: "56789012",
    fechaNacimiento: "1988-09-30",
    telefono: "555-7890",
  },
];

export const getPatientById = (id: string): Patient | undefined => {
  return patients.find((patient) => patient.id === id);
};

export const getPatientFullName = (patient: Patient): string => {
  return `${patient.nombre} ${patient.apellidoPaterno} ${patient.apellidoMaterno}`;
};
