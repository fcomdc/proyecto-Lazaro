import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Dashboard from '../components/Dashboard';
import PatientList from '../components/PatientList';
import DoctorList from '../components/DoctorList';
import AppointmentList from '../components/AppointmentList';
import EmergencyList from '../components/EmergencyList';
import TriageList from '../components/TriageList';
import HospitalizationList from '../components/HospitalizationList';
import MedicalHistoryList from '../components/MedicalHistoryList';
import UserList from '../components/UserList';

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
  },
};

const AppNavigator = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Inicio"
        component={Dashboard}
        options={{ title: '🏠 Inicio' }}
      />
      <Tab.Screen
        name="Pacientes"
        component={PatientList}
        options={{ title: '👤 Pacientes' }}
      />
      <Tab.Screen
        name="Médicos"
        component={DoctorList}
        options={{ title: '👨‍⚕️ Médicos' }}
      />
      <Tab.Screen
        name="Citas"
        component={AppointmentList}
        options={{ title: '📅 Citas' }}
      />
      <Tab.Screen
        name="Emergencias"
        component={EmergencyList}
        options={{ title: '🚨 Emergencias' }}
      />
      <Tab.Screen
        name="Triaje"
        component={TriageList}
        options={{ title: '🩺 Triaje' }}
      />
      <Tab.Screen
        name="Salas"
        component={HospitalizationList}
        options={{ title: '🏥 Hospitalización' }}
      />
      <Tab.Screen
        name="Historial"
        component={MedicalHistoryList}
        options={{ title: '📜 Historial' }}
      />
      <Tab.Screen
        name="Usuarios"
        component={UserList}
        options={{ title: '⚙️ Usuarios' }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
