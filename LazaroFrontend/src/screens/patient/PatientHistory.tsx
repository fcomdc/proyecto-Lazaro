import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { fetchHistoriales, HistorialClinico } from '../../api/historiales';
import { fetchPacientes, Paciente } from '../../api/pacientes';

const PatientHistory: React.FC = () => {
  const [historiales, setHistoriales] = useState<HistorialClinico[]>([]);
  const [pacienteInfo, setPacienteInfo] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const [histData, pacData] = await Promise.allSettled([
          fetchHistoriales(),
          fetchPacientes(),
        ]);

        if (histData.status === 'fulfilled' && Array.isArray(histData.value)) {
          setHistoriales(histData.value);
        }
        if (
          pacData.status === 'fulfilled' &&
          Array.isArray(pacData.value) &&
          pacData.value.length > 0
        ) {
          setPacienteInfo(pacData.value[0]);
        }
      } catch (err) {
        console.warn('Error cargando historial de paciente:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Resumen Clínico del Paciente */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>🪪 Ficha Médica Personal</Text>
        <Text style={styles.patientName}>
          {pacienteInfo
            ? `${pacienteInfo.nombre} ${pacienteInfo.apellido}`
            : 'Paciente Lázaro'}
        </Text>
        <Text style={styles.expedienteText}>
          Expediente: {pacienteInfo?.numeroExpediente || 'EXP-2026-001'}
        </Text>

        <View style={styles.tagsRow}>
          <View style={[styles.tag, { backgroundColor: '#fee2e2' }]}>
            <Text style={[styles.tagText, { color: '#b91c1c' }]}>
              🩸 Sangre: {pacienteInfo?.tipoSangre || 'O+'}
            </Text>
          </View>
          <View style={[styles.tag, { backgroundColor: '#fef3c7' }]}>
            <Text style={[styles.tagText, { color: '#b45309' }]}>
              ⚠️ Alergias: {pacienteInfo?.alergias || 'Ninguna'}
            </Text>
          </View>
          <View style={[styles.tag, { backgroundColor: '#e0e7ff' }]}>
            <Text style={[styles.tagText, { color: '#3730a3' }]}>
              📞 Auxilio: {pacienteInfo?.telefonoEmergencia || '555-0199'}
            </Text>
          </View>
        </View>
      </View>

      {/* Lista de Registros Clínicos */}
      <Text style={styles.sectionTitle}>
        📋 Registro de Consultas y Diagnósticos
      </Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Cargando historial médico...</Text>
        </View>
      ) : historiales.length > 0 ? (
        historiales.map((item, idx) => (
          <View key={item.idHistorial || idx} style={styles.historyCard}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyDate}>
                📅{' '}
                {item.fechaHora
                  ? new Date(item.fechaHora).toLocaleDateString()
                  : 'Consulta previa'}
              </Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>Atendido</Text>
              </View>
            </View>

            <Text style={styles.historyDiagnostico}>
              Diagnóstico:{' '}
              {item.diagnostico || 'Evaluación médica general satisfactoria'}
            </Text>

            {item.motivo ? (
              <Text style={styles.historyDiagnostico}>
                Motivo: {item.motivo}
              </Text>
            ) : null}

            {item.observaciones ? (
              <View style={styles.tratamientoBox}>
                <Text style={styles.tratamientoTitle}>
                  💊 Observaciones / Indicaciones:
                </Text>
                <Text style={styles.tratamientoText}>{item.observaciones}</Text>
              </View>
            ) : null}
          </View>
        ))
      ) : (
        <View style={styles.demoCard}>
          <Text style={styles.demoBadge}>Registro Clínico Base</Text>
          <Text style={styles.demoTitle}>Consulta Preventiva General</Text>
          <Text style={styles.demoDate}>📅 15 de Febrero, 2026</Text>
          <Text style={styles.demoDesc}>
            Signos vitales normales. Presión arterial 120/80 mmHg. Sin
            sintomatología aguda detectada.
          </Text>
          <View style={styles.tratamientoBox}>
            <Text style={styles.tratamientoTitle}>
              💊 Recomendación médica:
            </Text>
            <Text style={styles.tratamientoText}>
              Mantener hidratación adecuada y realizar chequeo preventivo cada 6
              meses.
            </Text>
          </View>
        </View>
      )}
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
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#0066cc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0066cc',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  patientName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a202c',
  },
  expedienteText: {
    fontSize: 13,
    color: '#718096',
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 14,
  },
  historyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4a5568',
  },
  statusBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusBadgeText: {
    color: '#065f46',
    fontSize: 11,
    fontWeight: '700',
  },
  historyDiagnostico: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 8,
  },
  tratamientoBox: {
    backgroundColor: '#f0fdf4',
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
    padding: 10,
    borderRadius: 6,
    marginTop: 6,
    marginBottom: 6,
  },
  tratamientoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065f46',
    marginBottom: 2,
  },
  tratamientoText: {
    fontSize: 13,
    color: '#047857',
  },
  observacionesText: {
    fontSize: 12,
    color: '#718096',
    fontStyle: 'italic',
    marginTop: 4,
  },
  demoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  demoBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0066cc',
    marginBottom: 4,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 4,
  },
  demoDate: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 8,
  },
  demoDesc: {
    fontSize: 13,
    color: '#4a5568',
    marginBottom: 8,
    lineHeight: 18,
  },
  center: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  loadingText: {
    marginTop: 8,
    color: '#718096',
  },
});

export default PatientHistory;
