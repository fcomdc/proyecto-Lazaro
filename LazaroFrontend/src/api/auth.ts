import { post } from './api';
import { Usuario } from './usuarios';

export interface UsuarioAuth {
  idUsuario: number;
  nombreUsuario: string;
  rol:
    | 'ADMINISTRADOR'
    | 'PACIENTE'
    | 'MEDICO'
    | 'ENFERMERO'
    | 'RECEPCIONISTA'
    | string;
  email?: string;
  activo: boolean;
}

export interface LoginPayload {
  nombreUsuario: string;
  password: string;
}

export const loginApi = async (
  credentials: LoginPayload,
): Promise<UsuarioAuth> => {
  return post('/api/usuarios/login', credentials);
};

export const registerApi = async (
  usuario: Partial<Usuario>,
): Promise<UsuarioAuth> => {
  return post('/api/usuarios', usuario);
};
