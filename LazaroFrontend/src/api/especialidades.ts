import { get, post, put, deleteApi } from './api';

export interface Especialidad {
  idEspecialidad?: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export const fetchEspecialidades = async () => get('/api/especialidades');
export const fetchEspecialidad = async (id: number) => get(`/api/especialidades/${id}`);
export const createEspecialidad = async (data: Especialidad) => post('/api/especialidades', data);
export const updateEspecialidad = async (id: number, data: Especialidad) => put(`/api/especialidades/${id}`, data);
export const deleteEspecialidad = async (id: number) => deleteApi(`/api/especialidades/${id}`);
