import { get, post, put, deleteApi } from './api';

export interface HistorialClinico {
  idHistorial?: number;
  idPaciente: number;
  idMedico?: number;
  idCita?: number;
  idIngreso?: number;
  fechaHora?: string;
  motivo?: string;
  diagnostico?: string;
  observaciones?: string;
}

export const fetchHistoriales = async () => get('/api/historialclinico');
export const fetchHistorial = async (id: number) => get(`/api/historialclinico/${id}`);
export const createHistorial = async (data: HistorialClinico) => post('/api/historialclinico', data);
export const updateHistorial = async (id: number, data: HistorialClinico) => put(`/api/historialclinico/${id}`, data);
export const deleteHistorial = async (id: number) => deleteApi(`/api/historialclinico/${id}`);
