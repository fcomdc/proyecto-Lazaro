import React, { createContext, useContext, useState } from 'react';
import { UsuarioAuth, loginApi } from '../api/auth';

interface AuthContextType {
  usuario: UsuarioAuth | null;
  loading: boolean;
  login: (
    nombreUsuario: string,
    password: string,
  ) => Promise<{ success: boolean; message?: string }>;
  loginAsDemo: (rol: 'ADMINISTRADOR' | 'PACIENTE' | 'MEDICO') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [usuario, setUsuario] = useState<UsuarioAuth | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Intentar login real en backend; si falla por red o modo offline, permitir demo
  const login = async (
    nombreUsuario: string,
    password: string,
  ): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    try {
      // Intentar primero con la API de backend
      const res = await loginApi({ nombreUsuario, password });
      if (res && res.nombreUsuario) {
        setUsuario(res);
        setLoading(false);
        return { success: true };
      }
    } catch (err: any) {
      console.warn(
        'Backend login no respondió o falló, verificando credenciales demo...',
        err?.message,
      );
    }

    // Modo de contingencia / Demo para pruebas inmediatas si backend no está disponible
    const userClean = nombreUsuario.trim().toLowerCase();
    if (userClean === 'admin' || userClean === 'administrador') {
      const adminUser: UsuarioAuth = {
        idUsuario: 1,
        nombreUsuario: 'admin',
        rol: 'ADMINISTRADOR',
        email: 'admin@hospital-lazaro.com',
        activo: true,
      };
      setUsuario(adminUser);
      setLoading(false);
      return { success: true };
    }

    if (
      userClean === 'paciente' ||
      userClean === 'juan' ||
      userClean.startsWith('pac')
    ) {
      const patientUser: UsuarioAuth = {
        idUsuario: 2,
        nombreUsuario: nombreUsuario || 'paciente',
        rol: 'PACIENTE',
        email: 'paciente@gmail.com',
        activo: true,
      };
      setUsuario(patientUser);
      setLoading(false);
      return { success: true };
    }

    if (userClean === 'medico' || userClean === 'doctor') {
      const doctorUser: UsuarioAuth = {
        idUsuario: 3,
        nombreUsuario: 'dr_martinez',
        rol: 'MEDICO',
        email: 'martinez@hospital-lazaro.com',
        activo: true,
      };
      setUsuario(doctorUser);
      setLoading(false);
      return { success: true };
    }

    setLoading(false);
    return {
      success: false,
      message:
        'Usuario no reconocido. Prueba con "admin" o "paciente" para acceso rápido demo.',
    };
  };

  const loginAsDemo = (rol: 'ADMINISTRADOR' | 'PACIENTE' | 'MEDICO') => {
    if (rol === 'ADMINISTRADOR') {
      setUsuario({
        idUsuario: 1,
        nombreUsuario: 'admin',
        rol: 'ADMINISTRADOR',
        email: 'admin@hospital-lazaro.com',
        activo: true,
      });
    } else if (rol === 'PACIENTE') {
      setUsuario({
        idUsuario: 2,
        nombreUsuario: 'Juan Pérez',
        rol: 'PACIENTE',
        email: 'juan.perez@gmail.com',
        activo: true,
      });
    } else {
      setUsuario({
        idUsuario: 3,
        nombreUsuario: 'Dr. Carlos Mendoza',
        rol: 'MEDICO',
        email: 'dr.mendoza@hospital-lazaro.com',
        activo: true,
      });
    }
  };

  const logout = () => {
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{ usuario, loading, login, loginAsDemo, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
