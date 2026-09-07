import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import { fetchPacientes } from '../../api/pacientes';
import { fetchMedicos } from '../../api/medicos';
import { fetchCitas } from '../../api/citas';
import { fetchEmergencias } from '../../api/emergencias';
import { fetchSalas } from '../../api/salas';
import { fetchEspecialidades } from '../../api/especialidades';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard: React.FC = () => {
  const { usuario, logout, loginAsDemo } = useAuth();
  const [stats, setStats] = useState({
    pacientes: 0,
    medicos: 0,
    citas: 0,
    emergencias: 0,
    salas: 0,
    especialidades: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);

    try {
      const [pac, med, cit, eme, sal, esp] = await Promise.allSettled([
        fetchPacientes(),
        fetchMedicos(),
        fetchCitas(),
        fetchEmergencias(),
        fetchSalas(),
        fetchEspecialidades(),
      ]);

      setStats({
        pacientes:
          pac.status === 'fulfilled' && Array.isArray(pac.value)
            ? pac.value.length
            : 0,
        medicos:
          med.status === 'fulfilled' && Array.isArray(med.value)
            ? med.value.length
            : 0,
        citas:
          cit.status === 'fulfilled' && Array.isArray(cit.value)
            ? cit.value.length
            : 0,
        emergencias:
          eme.status === 'fulfilled' && Array.isArray(eme.value)
            ? eme.value.length
            : 0,
        salas:
          sal.status === 'fulfilled' && Array.isArray(sal.value)
            ? sal.value.length
            : 0,
        especialidades:
          esp.status === 'fulfilled' && Array.isArray(esp.value)
            ? esp.value.length
            : 0,
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Cargando panel de control...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Barra Superior de Control de Sesión */}
      <View style={styles.topControlCard}>
        <View>
          <Text style={styles.adminBadge}>🛡️ PANEL ADMINISTRATIVO</Text>
          <Text style={styles.adminUser}>
            Usuario:{' '}
            <Text style={{ fontWeight: 'bold' }}>
              {usuario?.nombreUsuario || 'Administrador'}
            </Text>
          </Text>
        </View>
        <View style={styles.topBtnRow}>
          <TouchableOpacity
            style={styles.switchDemoBtn}
            onPress={() => loginAsDemo('PACIENTE')}
          >
            <Text style={styles.switchDemoBtnText}>👤 Ver App Paciente</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutTopBtn} onPress={logout}>
            <Text style={styles.logoutTopBtnText}>🚪 Salir</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.headerTitle}>🏥 Sistema Médico Lázaro</Text>
      <Text style={styles.headerSubtitle}>
        Supervisión Hospitalaria, Capacidad y Servicios
      </Text>

      <View style={styles.grid}>
        <View style={[styles.card, { borderLeftColor: '#007bff' }]}>
          <Text style={styles.cardIcon}>👤</Text>
          <Text style={styles.cardValue}>{stats.pacientes}</Text>
          <Text style={styles.cardLabel}>Pacientes Registrados</Text>
        </View>

        <View style={[styles.card, { borderLeftColor: '#28a745' }]}>
          <Text style={styles.cardIcon}>👨‍⚕️</Text>
          <Text style={styles.cardValue}>{stats.medicos}</Text>
          <Text style={styles.cardLabel}>Médicos Activos</Text>
        </View>

        <View style={[styles.card, { borderLeftColor: '#6f42c1' }]}>
          <Text style={styles.cardIcon}>🩺</Text>
          <Text style={styles.cardValue}>{stats.especialidades}</Text>
          <Text style={styles.cardLabel}>Especialidades</Text>
        </View>

        <View style={[styles.card, { borderLeftColor: '#ffc107' }]}>
          <Text style={styles.cardIcon}>📅</Text>
          <Text style={styles.cardValue}>{stats.citas}</Text>
          <Text style={styles.cardLabel}>Citas Programadas</Text>
        </View>

        <View style={[styles.card, { borderLeftColor: '#dc3545' }]}>
          <Text style={styles.cardIcon}>🚨</Text>
          <Text style={styles.cardValue}>{stats.emergencias}</Text>
          <Text style={styles.cardLabel}>Emergencias Registradas</Text>
        </View>

        <View style={[styles.card, { borderLeftColor: '#17a2b8' }]}>
          <Text style={styles.cardIcon}>🏥</Text>
          <Text style={styles.cardValue}>{stats.salas}</Text>
          <Text style={styles.cardLabel}>Salas y Camas</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.refreshButton} onPress={loadData}>
        <Text style={styles.refreshButtonText}>🔄 Actualizar Indicadores</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  topControlCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  adminBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0066cc',
    letterSpacing: 0.5,
  },
  adminUser: {
    fontSize: 13,
    color: '#475569',
    marginTop: 2,
  },
  topBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  switchDemoBtn: {
    backgroundColor: '#e6f4ea',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#34a853',
  },
  switchDemoBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1e7e34',
  },
  logoutTopBtn: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  logoutTopBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#b91c1c',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 14,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardIcon: {
    fontSize: 26,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  cardLabel: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  refreshButton: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default AdminDashboard;
