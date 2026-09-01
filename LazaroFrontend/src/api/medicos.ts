import { get, post, put, deleteApi } from './api';

export interface Medico {
  idMedico: number;
  idEspecialidad: number;
  nombre: string;
  apellido: string;
  numeroLicencia: string;
  telefono: string;
  email: string;
  anosExperiencia: number;
  disponible: boolean;
  activo: boolean;
}

export const fetchMedicos = async () => get('/api/medicos');
export const fetchMedico = async (id: number) => get(`/api/medicos/${id}`);
export const createMedico = async (data: Medico) => post('/api/medicos', data);
export const updateMedico = async (id: number, data: Medico) => put(`/api/medicos/${id}`, data);
export const deleteMedico = async (id: number) => deleteApi(`/api/medicos/${id}`);