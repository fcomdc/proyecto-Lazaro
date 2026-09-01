import { get, post, put, deleteApi } from './api';

export interface Emergencia {
  idEmergencia?: number;
  idPaciente: number;
  idEvaluacion?: number;
  fechaHora?: string;
  latitud?: number;
  longitud?: number;
  descripcion?: string;
  prioridad: string;
  estado: string;
  ambulanciaSolicitada: boolean;
  fechaVerificacion?: string;
  verificadoPor?: number;
}

export const fetchEmergencias = async () => get('/api/emergencias');
export const fetchEmergencia = async (id: number) => get(`/api/emergencias/${id}`);
export const createEmergencia = async (data: Emergencia) => post('/api/emergencias', data);
export const updateEmergencia = async (id: number, data: Emergencia) => put(`/api/emergencias/${id}`, data);
export const deleteEmergencia = async (id: number) => deleteApi(`/api/emergencias/${id}`);
