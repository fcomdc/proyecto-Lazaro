import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AdminDashboard from '../screens/admin/AdminDashboard';
import PatientList from '../screens/admin/PatientList';
import DoctorList from '../screens/admin/DoctorList';
import SpecialtyList from '../screens/admin/SpecialtyList';
import AppointmentList from '../screens/admin/AppointmentList';
import EmergencyList from '../screens/admin/EmergencyList';
import RoomList from '../screens/admin/RoomList';
import MedicalHistoryList from '../screens/admin/MedicalHistoryList';
import UserList from '../screens/admin/UserList';

const Tab = createBottomTabNavigator();

const screenOptions = {
  tabBarActiveTintColor: '#007bff',
  tabBarInactiveTintColor: '#6c757d',
  headerStyle: {
    backgroundColor: '#007bff',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold' as const,
  },
  tabBarStyle: {
    backgroundColor: '#ffffff',
    borderTopColor: '#dee2e6',
  },
};

const AdminNavigator: React.FC = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Inicio"
        component={AdminDashboard}
        options={{
          title: '🏠 Dashboard',
          headerTitle: 'Hospital Lázaro - Panel General',
        }}
      />
      <Tab.Screen
        name="Pacientes"
        component={PatientList}
        options={{ title: '👤 Pacientes', headerTitle: 'Gestión de Pacientes' }}
      />
      <Tab.Screen
        name="Médicos"
        component={DoctorList}
        options={{
          title: '👨‍⚕️ Médicos',
          headerTitle: 'Gestión de Personal Médico',
        }}
      />
      <Tab.Screen
        name="Especialidades"
        component={SpecialtyList}
        options={{
          title: '🩺 Especialidades',
          headerTitle: 'Especialidades Médicas',
        }}
      />
      <Tab.Screen
        name="Citas"
        component={AppointmentList}
        options={{
          title: '📅 Citas',
          headerTitle: 'Control Hospitalario de Citas',
        }}
      />
      <Tab.Screen
        name="Emergencias"
        component={EmergencyList}
        options={{
          title: '🚨 Emergencias',
          headerTitle: 'Supervisión de Emergencias',
        }}
      />
      <Tab.Screen
        name="Salas"
        component={RoomList}
        options={{
          title: '🏥 Hospitalización',
          headerTitle: 'Gestión de Salas y Camas',
        }}
      />
      <Tab.Screen
        name="Historial"
        component={MedicalHistoryList}
        options={{
          title: '📜 Expedientes',
          headerTitle: 'Historiales Clínicos',
        }}
      />
      <Tab.Screen
        name="Usuarios"
        component={UserList}
        options={{ title: '⚙️ Usuarios', headerTitle: 'Cuentas y Roles' }}
      />
    </Tab.Navigator>
  );
};

export default AdminNavigator;
