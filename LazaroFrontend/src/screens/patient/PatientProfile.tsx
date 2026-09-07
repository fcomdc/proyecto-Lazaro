import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

const PatientProfile: React.FC = () => {
  const { usuario, logout, loginAsDemo } = useAuth();

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('¿Deseas cerrar sesión?')) {
        logout();
      }
    } else {
      Alert.alert('Cerrar Sesión', '¿Estás seguro de que deseas salir?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Salir', style: 'destructive', onPress: logout },
      ]);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarIcon}>👤</Text>
        </View>
        <Text style={styles.userName}>
          {usuario?.nombreUsuario || 'Paciente'}
        </Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>Rol: {usuario?.rol || 'PACIENTE'}</Text>
        </View>
        <Text style={styles.emailText}>
          {usuario?.email || 'paciente@hospital-lazaro.com'}
        </Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>⚙️ Preferencias y Seguridad</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Estado de la cuenta:</Text>
          <Text style={[styles.infoValue, { color: '#16a34a' }]}>
            Activa y Verificada ✅
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tipo de acceso:</Text>
          <Text style={styles.infoValue}>Portal Personal de Pacientes</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Notificaciones SMS:</Text>
          <Text style={styles.infoValue}>Habilitadas</Text>
        </View>
      </View>

      {/* Selector de modo demostración */}
      <View style={styles.demoCard}>
        <Text style={styles.demoTitle}>
          🔄 Conmutador de Rol (Demo de Tesis)
        </Text>
        <Text style={styles.demoDesc}>
          Según el PDF de arquitectura, puedes cambiar al panel de
          administración hospitalaria para evaluar el sistema con perfil de
          Administrador:
        </Text>
        <TouchableOpacity
          style={styles.switchRoleBtn}
          onPress={() => loginAsDemo('ADMINISTRADOR')}
        >
          <Text style={styles.switchRoleBtnText}>
            🛡️ Cambiar a Panel Administrador
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutBtnText}>🚪 Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fb',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarIcon: {
    fontSize: 40,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a202c',
  },
  roleBadge: {
    backgroundColor: '#e6f4ea',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e7e34',
  },
  emailText: {
    fontSize: 13,
    color: '#718096',
    marginTop: 6,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
  },
  demoCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 4,
  },
  demoDesc: {
    fontSize: 12,
    color: '#3b82f6',
    marginBottom: 12,
    lineHeight: 16,
  },
  switchRoleBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  switchRoleBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  logoutBtn: {
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default PatientProfile;
