import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { fetchCitas, Cita } from '../../api/citas';

interface Props {
  navigation: any;
}

const PatientHome: React.FC<Props> = ({ navigation }) => {
  const { usuario } = useAuth();
  const [proximaCita, setProximaCita] = useState<Cita | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadCitas = async () => {
      try {
        const data = await fetchCitas();
        if (Array.isArray(data) && data.length > 0) {
          // Filtrar citas pendientes o tomar la primera
          const pendientes = data.filter((c: any) => c.estado !== 'Cancelada');
          setProximaCita(pendientes.length > 0 ? pendientes[0] : data[0]);
        }
      } catch (err) {
        console.warn('Error cargando citas de paciente:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCitas();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header con Bienvenida */}
      <View style={styles.welcomeCard}>
        <View style={styles.welcomeTextContainer}>
          <Text style={styles.greeting}>
            ¡Hola, {usuario?.nombreUsuario || 'Paciente'}! 👋
          </Text>
          <Text style={styles.subtitle}>
            Bienvenido al portal de salud de Lázaro
          </Text>
        </View>
        <TouchableOpacity
          style={styles.profileBadge}
          onPress={() => navigation.navigate('Perfil')}
        >
          <Text style={styles.profileBadgeText}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Banner de Emergencia Rápida */}
      <TouchableOpacity
        style={styles.emergencyBanner}
        onPress={() => navigation.navigate('Emergencia')}
      >
        <View style={styles.emergencyIconBox}>
          <Text style={styles.emergencyIcon}>🚨</Text>
        </View>
        <View style={styles.emergencyInfo}>
          <Text style={styles.emergencyTitle}>¿Tienes una Emergencia?</Text>
          <Text style={styles.emergencyDesc}>
            Presiona aquí para solicitar atención inmediata y enviar tus datos
          </Text>
        </View>
        <Text style={styles.emergencyArrow}>➔</Text>
      </TouchableOpacity>

      {/* Tarjeta de Próxima Cita */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>📅 Tu Próxima Cita</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Citas')}>
          <Text style={styles.sectionLink}>Ver todas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.appointmentCard}>
        {loading ? (
          <ActivityIndicator color="#0066cc" />
        ) : proximaCita ? (
          <View>
            <View style={styles.aptHeaderRow}>
              <View style={styles.aptBadge}>
                <Text style={styles.aptBadgeText}>
                  {proximaCita.estado || 'Confirmada'}
                </Text>
              </View>
              <Text style={styles.aptDate}>
                {proximaCita.fechaHora
                  ? new Date(proximaCita.fechaHora).toLocaleDateString()
                  : 'Próximamente'}
              </Text>
            </View>
            <Text style={styles.aptDoctor}>
              👨‍⚕️{' '}
              {(proximaCita as any).medico?.nombreCompleto ||
                `Médico Asignado #${proximaCita.idMedico}`}
            </Text>
            <Text style={styles.aptReason}>
              Motivo: {proximaCita.motivo || 'Consulta Médica General'}
            </Text>
          </View>
        ) : (
          <View style={styles.noAptContainer}>
            <Text style={styles.noAptText}>
              No tienes citas programadas actualmente.
            </Text>
            <TouchableOpacity
              style={styles.scheduleBtn}
              onPress={() => navigation.navigate('Citas')}
            >
              <Text style={styles.scheduleBtnText}>+ Solicitar una Cita</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Accesos Rápidos Principales */}
      <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 14 }]}>
        ⚡ Accesos Rápidos
      </Text>

      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.gridCard}
          onPress={() => navigation.navigate('Citas')}
        >
          <View style={[styles.gridIconCircle, { backgroundColor: '#e8f0fe' }]}>
            <Text style={styles.gridIcon}>📅</Text>
          </View>
          <Text style={styles.gridTitle}>Mis Citas</Text>
          <Text style={styles.gridSubtitle}>Consultar y agendar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gridCard}
          onPress={() => navigation.navigate('Historial')}
        >
          <View style={[styles.gridIconCircle, { backgroundColor: '#e6f4ea' }]}>
            <Text style={styles.gridIcon}>📜</Text>
          </View>
          <Text style={styles.gridTitle}>Historial</Text>
          <Text style={styles.gridSubtitle}>Recetas y diagnósticos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gridCard}
          onPress={() => navigation.navigate('Médicos')}
        >
          <View style={[styles.gridIconCircle, { backgroundColor: '#fef7e0' }]}>
            <Text style={styles.gridIcon}>👨‍⚕️</Text>
          </View>
          <Text style={styles.gridTitle}>Médicos</Text>
          <Text style={styles.gridSubtitle}>Directorio y horarios</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gridCard}
          onPress={() => navigation.navigate('Hospital')}
        >
          <View style={[styles.gridIconCircle, { backgroundColor: '#fce8e6' }]}>
            <Text style={styles.gridIcon}>🏥</Text>
          </View>
          <Text style={styles.gridTitle}>Hospital</Text>
          <Text style={styles.gridSubtitle}>Guía y servicios</Text>
        </TouchableOpacity>
      </View>

      {/* Consejos Preventivos */}
      <View style={styles.tipCard}>
        <Text style={styles.tipBadge}>💡 Consejo de Salud</Text>
        <Text style={styles.tipTitle}>
          Mantén actualizados tus datos médicos
        </Text>
        <Text style={styles.tipDesc}>
          Registrar tus alergias y contactos de emergencia en tu perfil ayuda a
          los médicos a atenderte con mayor rapidez y precisión ante cualquier
          eventualidad.
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
    paddingBottom: 35,
  },
  welcomeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0066cc',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#0066cc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 13,
    color: '#d0e5ff',
    marginTop: 4,
  },
  profileBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileBadgeText: {
    fontSize: 20,
  },
  emergencyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc3545',
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
    shadowColor: '#dc3545',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  emergencyIconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  emergencyIcon: {
    fontSize: 24,
  },
  emergencyInfo: {
    flex: 1,
  },
  emergencyTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  emergencyDesc: {
    color: '#ffe5e5',
    fontSize: 11,
    marginTop: 2,
  },
  emergencyArrow: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a202c',
  },
  sectionLink: {
    fontSize: 13,
    color: '#0066cc',
    fontWeight: '600',
  },
  appointmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  aptHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  aptBadge: {
    backgroundColor: '#e6f4ea',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  aptBadgeText: {
    color: '#1e7e34',
    fontSize: 12,
    fontWeight: '700',
  },
  aptDate: {
    fontSize: 13,
    color: '#718096',
    fontWeight: '600',
  },
  aptDoctor: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 4,
  },
  aptReason: {
    fontSize: 13,
    color: '#4a5568',
  },
  noAptContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  noAptText: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 12,
  },
  scheduleBtn: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 8,
  },
  scheduleBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 4,
  },
  gridIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  gridIcon: {
    fontSize: 22,
  },
  gridTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 2,
  },
  gridSubtitle: {
    fontSize: 11,
    color: '#718096',
  },
  tipCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 18,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  tipBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#b45309',
    marginBottom: 4,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 4,
  },
  tipDesc: {
    fontSize: 12,
    color: '#4a5568',
    lineHeight: 18,
  },
});

export default PatientHome;
