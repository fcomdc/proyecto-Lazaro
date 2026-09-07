import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import { fetchCitas, createCita, Cita } from '../../api/citas';
import { fetchMedicos, Medico } from '../../api/medicos';

const PatientAppointments: React.FC = () => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  // Formulario para solicitar cita
  const [selectedMedicoId, setSelectedMedicoId] = useState<number | null>(null);
  const [fechaCita, setFechaCita] = useState('');
  const [motivo, setMotivo] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [citasData, medicosData] = await Promise.allSettled([
        fetchCitas(),
        fetchMedicos(),
      ]);

      if (citasData.status === 'fulfilled' && Array.isArray(citasData.value)) {
        setCitas(citasData.value);
      }
      if (
        medicosData.status === 'fulfilled' &&
        Array.isArray(medicosData.value)
      ) {
        setMedicos(medicosData.value);
        if (medicosData.value.length > 0) {
          setSelectedMedicoId(medicosData.value[0].idMedico);
        }
      }
    } catch (err) {
      console.warn('Error cargando citas de paciente:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSolicitarCita = async () => {
    if (!selectedMedicoId || !motivo.trim()) {
      const msg =
        'Por favor selecciona un médico e indica el motivo de la consulta.';
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Campos requeridos', msg);
      return;
    }

    setSaving(true);
    try {
      const nuevaCita: any = {
        idPaciente: 1, // Paciente actual
        idMedico: selectedMedicoId,
        fechaHora:
          fechaCita || new Date(Date.now() + 86400000 * 2).toISOString(),
        motivo: motivo.trim(),
        estado: 'Pendiente',
      };

      await createCita(nuevaCita);
      const okMsg = '¡Tu solicitud de cita ha sido registrada!';
      if (Platform.OS === 'web') window.alert(okMsg);
      else Alert.alert('Éxito', okMsg);

      setModalVisible(false);
      setMotivo('');
      loadData();
    } catch (err: any) {
      console.warn('Error al solicitar cita:', err);
      // Fallback local
      const mockCita: any = {
        idCita: Date.now(),
        idPaciente: 1,
        idMedico: selectedMedicoId,
        medico: medicos.find(m => m.idMedico === selectedMedicoId),
        fechaHora: fechaCita || new Date().toISOString(),
        motivo: motivo.trim(),
        estado: 'Pendiente',
      };
      setCitas(prev => [mockCita, ...prev]);
      setModalVisible(false);
      setMotivo('');
      const okMsg = '¡Cita registrada en modo demostración!';
      if (Platform.OS === 'web') window.alert(okMsg);
      else Alert.alert('Éxito', okMsg);
    } finally {
      setSaving(false);
    }
  };

  const renderCitaItem = ({ item }: { item: any }) => {
    const isPending = item.estado === 'Pendiente';
    const isConfirmed = item.estado === 'Confirmada';
    const doctorName =
      item.medico?.nombreCompleto || `Dr. Asignado (#${item.idMedico})`;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.doctorName}>👨‍⚕️ {doctorName}</Text>
          <View
            style={[
              styles.statusBadge,
              isPending && styles.badgePending,
              isConfirmed && styles.badgeConfirmed,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                isPending && styles.textPending,
                isConfirmed && styles.textConfirmed,
              ]}
            >
              {item.estado || 'Programada'}
            </Text>
          </View>
        </View>

        <Text style={styles.dateText}>
          📅{' '}
          {item.fechaHora
            ? new Date(item.fechaHora).toLocaleString()
            : 'Fecha por confirmar'}
        </Text>

        <Text style={styles.reasonText}>
          <Text style={styles.reasonLabel}>Motivo: </Text>
          {item.motivo || 'Consulta Médica'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.pageTitle}>Mis Citas Médicas</Text>
          <Text style={styles.pageSubtitle}>
            Consulta tus turnos y próximas visitas
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addBtnText}>+ Solicitar Cita</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Cargando citas...</Text>
        </View>
      ) : (
        <FlatList
          data={citas}
          keyExtractor={(item, index) =>
            item.idCita ? item.idCita.toString() : index.toString()
          }
          renderItem={renderCitaItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📅</Text>
              <Text style={styles.emptyTitle}>No tienes citas registradas</Text>
              <Text style={styles.emptyDesc}>
                Presiona "Solicitar Cita" para pedir una nueva consulta con
                nuestros especialistas.
              </Text>
            </View>
          }
        />
      )}

      {/* Modal para solicitar cita */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Solicitar Nueva Cita</Text>
            <Text style={styles.modalSubtitle}>
              Selecciona el médico y describe tu molestia
            </Text>

            <ScrollView style={{ maxHeight: 360 }}>
              <Text style={styles.label}>Médico / Especialista</Text>
              {medicos.length > 0 ? (
                <View style={styles.medicosSelector}>
                  {medicos.slice(0, 5).map(m => (
                    <TouchableOpacity
                      key={m.idMedico}
                      style={[
                        styles.medicoOption,
                        selectedMedicoId === m.idMedico &&
                          styles.medicoOptionSelected,
                      ]}
                      onPress={() => setSelectedMedicoId(m.idMedico)}
                    >
                      <Text
                        style={[
                          styles.medicoOptionText,
                          selectedMedicoId === m.idMedico &&
                            styles.medicoOptionTextSelected,
                        ]}
                      >
                        {selectedMedicoId === m.idMedico ? '✓ ' : ''}
                        {m.nombre} {m.apellido}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text style={styles.noDataNote}>
                  Cargando médicos disponibles...
                </Text>
              )}

              <Text style={styles.label}>Motivo o Síntoma Principal *</Text>
              <TextInput
                style={[styles.input, { height: 75, textAlignVertical: 'top' }]}
                placeholder="Ej. Chequeo de rutina, dolor de cabeza constante..."
                placeholderTextColor="#999"
                multiline
                value={motivo}
                onChangeText={setMotivo}
              />

              <Text style={styles.label}>Fecha Preferida (Opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD (Ej. 2026-09-15)"
                placeholderTextColor="#999"
                value={fechaCita}
                onChangeText={setFechaCita}
              />
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
                disabled={saving}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, saving && styles.btnDisabled]}
                onPress={handleSolicitarCita}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveBtnText}>Enviar Solicitud</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fb',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a202c',
  },
  pageSubtitle: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
  addBtn: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  listContent: {
    padding: 20,
    gap: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a202c',
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgePending: {
    backgroundColor: '#fef3c7',
  },
  badgeConfirmed: {
    backgroundColor: '#d1fae5',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  textPending: {
    color: '#b45309',
  },
  textConfirmed: {
    color: '#047857',
  },
  dateText: {
    fontSize: 13,
    color: '#4a5568',
    marginBottom: 6,
  },
  reasonText: {
    fontSize: 13,
    color: '#2d3748',
  },
  reasonLabel: {
    fontWeight: '600',
    color: '#718096',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#718096',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 22,
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#2d3748',
    backgroundColor: '#f8fafc',
  },
  medicosSelector: {
    gap: 6,
    marginBottom: 8,
  },
  medicoOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  medicoOptionSelected: {
    borderColor: '#0066cc',
    backgroundColor: '#e8f0fe',
  },
  medicoOptionText: {
    fontSize: 13,
    color: '#4a5568',
  },
  medicoOptionTextSelected: {
    color: '#0066cc',
    fontWeight: '700',
  },
  noDataNote: {
    fontSize: 12,
    color: '#718096',
    fontStyle: 'italic',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 20,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e0',
  },
  cancelBtnText: {
    color: '#4a5568',
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: '#0066cc',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  saveBtnText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  btnDisabled: {
    opacity: 0.6,
  },
});

export default PatientAppointments;
