import { get, post, put, deleteApi } from './api';

export interface Cita {
  idCita?: number;
  idPaciente: number;
  idMedico: number;
  fechaHora: string;
  motivo?: string;
  estado: string;
  observaciones?: string;
  fechaCreacion?: string;
}

export const fetchCitas = async () => get('/api/citas');
export const fetchCita = async (id: number) => get(`/api/citas/${id}`);
export const createCita = async (data: Cita) => post('/api/citas', data);
export const updateCita = async (id: number, data: Cita) => put(`/api/citas/${id}`, data);
export const deleteCita = async (id: number) => deleteApi(`/api/citas/${id}`);
