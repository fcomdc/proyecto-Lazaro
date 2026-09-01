import { get, post, put, deleteApi } from './api';

export interface Paciente {
  idPaciente: number;
  numeroExpediente: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  genero: string;
  direccion: string;
  telefono: string;
  email: string;
  tipoSangre: string;
  alergias: string;
  contactoEmergencia: string;
  telefonoEmergencia: string;
  activo: boolean;
  fechaRegistro: string;
}

export const fetchPacientes = async () => get('/api/pacientes');
export const fetchPaciente = async (id: number) => get(`/api/pacientes/${id}`);
export const createPaciente = async (data: Paciente) => post('/api/pacientes', data);
export const updatePaciente = async (id: number, data: Paciente) => put(`/api/pacientes/${id}`, data);
export const deletePaciente = async (id: number) => deleteApi(`/api/pacientes/${id}`);