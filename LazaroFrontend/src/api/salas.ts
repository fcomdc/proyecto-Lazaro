import { get, post, put, deleteApi } from './api';

export interface Sala {
  idSala?: number;
  nombre: string;
  ubicacion?: string;
  capacidad: number;
  estado: string;
}

export const fetchSalas = async () => get('/api/salas');
export const fetchSala = async (id: number) => get(`/api/salas/${id}`);
export const createSala = async (data: Sala) => post('/api/salas', data);
export const updateSala = async (id: number, data: Sala) => put(`/api/salas/${id}`, data);
export const deleteSala = async (id: number) => deleteApi(`/api/salas/${id}`);
