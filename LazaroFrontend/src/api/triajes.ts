import { get, post, put, deleteApi } from './api';

export interface Triaje {
  idTriaje?: number;
  idEvaluacion: number;
  nivel: string;
  temperatura?: number;
  frecuenciaCardiaca?: number;
  presionArterial?: string;
  saturacionOxigeno?: number;
  observaciones?: string;
  fechaHora?: string;
}

export const fetchTriajes = async () => get('/api/triajes');
export const fetchTriaje = async (id: number) => get(`/api/triajes/${id}`);
export const createTriaje = async (data: Triaje) => post('/api/triajes', data);
export const updateTriaje = async (id: number, data: Triaje) => put(`/api/triajes/${id}`, data);
export const deleteTriaje = async (id: number) => deleteApi(`/api/triajes/${id}`);
