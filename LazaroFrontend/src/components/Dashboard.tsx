import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { fetchPacientes } from '../api/pacientes';
import { fetchMedicos } from '../api/medicos';
import { fetchCitas } from '../api/citas';
import { fetchEmergencias } from '../api/emergencias';
import { fetchSalas } from '../api/salas';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    pacientes: 0,
    medicos: 0,
    citas: 0,
    emergencias: 0,
    salas: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pac, med, cit, eme, sal] = await Promise.allSettled([
        fetchPacientes(),
        fetchMedicos(),
        fetchCitas(),
        fetchEmergencias(),
        fetchSalas(),
      ]);

      setStats({
        pacientes: pac.status === 'fulfilled' && Array.isArray(pac.value) ? pac.value.length : 0,
        medicos: med.status === 'fulfilled' && Array.isArray(med.value) ? med.value.length : 0,
        citas: cit.status === 'fulfilled' && Array.isArray(cit.value) ? cit.value.length : 0,
        emergencias: eme.status === 'fulfilled' && Array.isArray(eme.value) ? eme.value.length : 0,
        salas: sal.status === 'fulfilled' && Array.isArray(sal.value) ? sal.value.length : 0,
      });
    } catch (e) {
      console.error('Error cargando estadisticas:', e);
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
      <Text style={styles.headerTitle}>🏥 Sistema Médico Lázaro</Text>
      <Text style={styles.headerSubtitle}>Panel General de Administración Hospitalaria</Text>

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
          <Text style={styles.cardLabel}>Salas Registradas</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.refreshButton} onPress={loadData}>
        <Text style={styles.refreshButtonText}>🔄 Actualizar Estadísticas</Text>
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardIcon: {
    fontSize: 28,
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  cardLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  refreshButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Dashboard;
