export interface InternationPatientData {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  sexo: string;
  documento: string;
  direccion: string;
  telefono: string;
  email: string;
}

export interface InternationEmergencyContact {
  nombreCompleto: string;
  direccion: string;
  telefono: string;
  email: string;
  parentesco: string;
  telefonoEmergencia: string;
}

export interface InternationConsentDocuments {
  consentimientoInformado: File | null;
  consentimientoQuirurgico: File | null;
  consentimientoAnestesico: File | null;
}

import { InsuranceData } from "./admission";

export interface BedAssignment {
  habitacion: string;
  cama: string;
}

export interface InternationProcessData {
  orderId: string;
  patientData: InternationPatientData;
  emergencyContact: InternationEmergencyContact;
  insuranceData: InsuranceData;
  consentDocuments: InternationConsentDocuments;
  bedAssignment: BedAssignment;
}

