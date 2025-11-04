import { Doctor } from "../types/appointment";

export const doctors: Doctor[] = [
  {
    id: "doc1",
    nombre: "Dr. Carlos Mendoza",
    especialidad: "cardiologia",
    maxTickets: 10,
  },
  {
    id: "doc2",
    nombre: "Dra. Ana López",
    especialidad: "pediatria",
    maxTickets: 10,
  },
  {
    id: "doc3",
    nombre: "Dr. Roberto Silva",
    especialidad: "dermatologia",
    maxTickets: 10,
  },
  {
    id: "doc4",
    nombre: "Dra. María González",
    especialidad: "ginecologia",
    maxTickets: 10,
  },
  {
    id: "doc5",
    nombre: "Dr. Luis Pérez",
    especialidad: "neurologia",
    maxTickets: 10,
  },
  {
    id: "doc6",
    nombre: "Dra. Carmen Ruiz",
    especialidad: "ortopedia",
    maxTickets: 10,
  },
  {
    id: "doc7",
    nombre: "Dr. Fernando Torres",
    especialidad: "oftalmologia",
    maxTickets: 10,
  },
  {
    id: "doc8",
    nombre: "Dra. Patricia Vargas",
    especialidad: "medicina_general",
    maxTickets: 10,
  },
];

export const getDoctorById = (id: string): Doctor | undefined => {
  return doctors.find((doctor) => doctor.id === id);
};

export const getDoctorsBySpecialty = (specialtyId: string): Doctor[] => {
  return doctors.filter((doctor) => doctor.especialidad === specialtyId);
};
