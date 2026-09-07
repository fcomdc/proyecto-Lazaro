import React from 'react';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import PatientNavigator from './PatientNavigator';
import AdminNavigator from './AdminNavigator';

const AppNavigator: React.FC = () => {
  const { usuario } = useAuth();

  // Si no hay sesión iniciada, mostrar flujo de Autenticación
  if (!usuario) {
    return <AuthNavigator />;
  }

  // Según la sección 6 del PDF:
  if (usuario.rol === 'ADMINISTRADOR') {
    return <AdminNavigator />;
  }

  if (usuario.rol === 'PACIENTE') {
    return <PatientNavigator />;
  }

  // Roles hospitalarios autorizados (Médico, Recepcionista, Enfermero)
  return <AdminNavigator />;
};

export default AppNavigator;
