import { get, post, put, deleteApi } from './api';

export interface Usuario {
  idUsuario: number;
  nombreUsuario: string;
  passwordHash: string;
  rol: string;
  activo: boolean;
  fechaCreacion: string;
}

export const fetchUsuarios = async () => get('/api/usuarios');
export const fetchUsuario = async (id: number) => get(`/api/usuarios/${id}`);
export const createUsuario = async (data: Usuario) => post('/api/usuarios', data);
export const updateUsuario = async (id: number, data: Usuario) => put(`/api/usuarios/${id}`, data);
export const deleteUsuario = async (id: number) => deleteApi(`/api/usuarios/${id}`);