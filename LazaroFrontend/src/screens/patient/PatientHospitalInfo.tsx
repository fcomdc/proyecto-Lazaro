import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const PatientHospitalInfo: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.banner}>
        <Text style={styles.bannerIcon}>🏥</Text>
        <Text style={styles.bannerTitle}>Hospital Central Lázaro</Text>
        <Text style={styles.bannerSubtitle}>
          Comprometidos con tu salud y bienestar
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📍 Ubicación e Instalaciones</Text>
        <Text style={styles.cardText}>
          <Text style={styles.bold}>Dirección:</Text> Av. Médica Central #500,
          Sector Norte
        </Text>
        <Text style={styles.cardText}>
          <Text style={styles.bold}>Horario de Consulta Externa:</Text> Lunes a
          Sábado de 7:00 AM a 8:00 PM
        </Text>
        <Text style={styles.cardText}>
          <Text style={styles.bold}>Servicio de Urgencias:</Text> Abierto las 24
          horas, los 365 días del año
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>⏰ Horarios de Visita</Text>
        <View style={styles.itemRow}>
          <Text style={styles.itemBullet}>•</Text>
          <Text style={styles.itemText}>
            Hospitalización General: 10:00 AM - 12:00 PM y 4:00 PM - 7:00 PM
          </Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.itemBullet}>•</Text>
          <Text style={styles.itemText}>
            Cuidados Intensivos (UCI): 11:00 AM - 12:00 PM y 5:00 PM - 6:00 PM
          </Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.itemBullet}>•</Text>
          <Text style={styles.itemText}>
            Máximo 2 familiares por paciente en habitación.
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🩺 Especialidades Disponibles</Text>
        <Text style={styles.servicesGrid}>
          Cardiología • Pediatría • Cirugía General • Traumatología • Neurología
          • Ginecología • Medicina Interna • Dermatología
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>ℹ️ Requisitos para Atención</Text>
        <Text style={styles.itemText}>
          Para consulta programada, presenta tu documento de identificación
          oficial y número de expediente Lázaro. En caso de emergencia, serás
          ingresado de inmediato a través del área de triaje.
        </Text>
      </View>
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
  banner: {
    backgroundColor: '#0066cc',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  bannerIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#e0f2fe',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 13,
    color: '#4a5568',
    marginBottom: 6,
    lineHeight: 19,
  },
  bold: {
    fontWeight: '700',
    color: '#2d3748',
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  itemBullet: {
    color: '#0066cc',
    fontSize: 16,
    marginRight: 6,
  },
  itemText: {
    flex: 1,
    fontSize: 13,
    color: '#4a5568',
    lineHeight: 19,
  },
  servicesGrid: {
    fontSize: 13,
    color: '#0284c7',
    lineHeight: 22,
    fontWeight: '600',
  },
});

export default PatientHospitalInfo;
