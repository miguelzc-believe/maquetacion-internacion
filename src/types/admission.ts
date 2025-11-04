export interface PatientData {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  sexo: string;
  estadoCivil: string;
  tipoSeguro: string;
}

export interface InsuranceData {
  categoria: string;
  numeroMatricula: string;
  numeroCarpeta: string;
  matricula: string;
  empresa: string;
  telefono: string;
  direccion: string;
  nombreAsegurado: string;
}

export interface EmergencyContact {
  nombreCompleto: string;
  direccion: string;
  telefono: string;
  email: string;
  parentesco: string;
  telefonoEmergencia: string;
}

export interface AccountResponsible {
  nombreCompleto: string;
  documento: string;
  lugarNacimiento: string;
  fechaNacimiento: string;
}

export interface AdmissionFormData {
  patientData: PatientData;
  insuranceData: InsuranceData;
  emergencyContact: EmergencyContact;
  accountResponsible: AccountResponsible;
}
