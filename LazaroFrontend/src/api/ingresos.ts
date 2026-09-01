import { get, post, put, deleteApi } from './api';

export interface Ingreso {
  idIngreso?: number;
  idPaciente: number;
  idMedicoResponsable?: number;
  idSala?: number;
  idEmergencia?: number;
  fechaIngreso?: string;
  fechaAlta?: string;
  motivoIngreso?: string;
  diagnostico?: string;
  estado: string;
}

export const fetchIngresos = async () => get('/api/ingresos');
export const fetchIngreso = async (id: number) => get(`/api/ingresos/${id}`);
export const createIngreso = async (data: Ingreso) => post('/api/ingresos', data);
export const updateIngreso = async (id: number, data: Ingreso) => put(`/api/ingresos/${id}`, data);
export const deleteIngreso = async (id: number) => deleteApi(`/api/ingresos/${id}`);
