import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import PatientHome from '../screens/patient/PatientHome';
import PatientAppointments from '../screens/patient/PatientAppointments';
import PatientHistory from '../screens/patient/PatientHistory';
import Emergency from '../screens/patient/Emergency';
import PatientDoctors from '../screens/patient/PatientDoctors';
import PatientHospitalInfo from '../screens/patient/PatientHospitalInfo';
import PatientProfile from '../screens/patient/PatientProfile';

const Tab = createBottomTabNavigator();

const screenOptions = {
  tabBarActiveTintColor: '#0066cc',
  tabBarInactiveTintColor: '#64748b',
  headerStyle: {
    backgroundColor: '#0066cc',
  },
  headerTintColor: '#ffffff',
  headerTitleStyle: {
    fontWeight: 'bold' as const,
  },
  tabBarStyle: {
    backgroundColor: '#ffffff',
    borderTopColor: '#e2e8f0',
  },
};

const PatientNavigator: React.FC = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Inicio"
        component={PatientHome}
        options={{
          title: 'Inicio',
          tabBarLabel: 'Inicio',
          headerTitle: 'Lázaro Salud - Paciente',
        }}
      />
      <Tab.Screen
        name="Citas"
        component={PatientAppointments}
        options={{
          title: 'Mis Citas',
          tabBarLabel: 'Citas',
          headerTitle: 'Mis Citas Médicas',
        }}
      />
      <Tab.Screen
        name="Historial"
        component={PatientHistory}
        options={{
          title: 'Historial',
          tabBarLabel: 'Historial',
          headerTitle: 'Historial Clínico',
        }}
      />
      <Tab.Screen
        name="Emergencia"
        component={Emergency}
        options={{
          title: 'Emergencia',
          tabBarLabel: '🚨 SOS',
          tabBarActiveTintColor: '#dc3545',
          headerTitle: '🚨 Centro de Emergencias',
          headerStyle: {
            backgroundColor: '#dc3545',
          },
        }}
      />
      <Tab.Screen
        name="Médicos"
        component={PatientDoctors}
        options={{
          title: 'Médicos',
          tabBarLabel: 'Médicos',
          headerTitle: 'Directorio de Médicos',
        }}
      />
      <Tab.Screen
        name="Hospital"
        component={PatientHospitalInfo}
        options={{
          title: 'Hospital',
          tabBarLabel: 'Hospital',
          headerTitle: 'Información del Hospital',
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={PatientProfile}
        options={{
          title: 'Perfil',
          tabBarLabel: 'Perfil',
          headerTitle: 'Mi Cuenta',
        }}
      />
    </Tab.Navigator>
  );
};

export default PatientNavigator;
