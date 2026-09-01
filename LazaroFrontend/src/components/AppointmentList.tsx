import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Alert, Platform, Modal, TextInput, ScrollView } from 'react-native';
import { fetchCitas, createCita, Cita } from '../api/citas';

const AppointmentList: React.FC = () => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    idPaciente: '1',
    idMedico: '1',
    fechaHora: new Date().toISOString().slice(0, 16),
    motivo: '',
    observaciones: '',
  });

  const loadCitas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCitas();
      setCitas(data || []);
    } catch (err: any) {
      console.error('Error cargando citas:', err);
      setError(err.message || 'Error al cargar citas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCitas();
  }, []);

  const handleCreate = async () => {
    if (!form.idPaciente || !form.idMedico) {
      const msg = 'Por favor ingresa ID de Paciente e ID de Médico.';
      if (Platform.OS === 'web') window.alert(msg); else Alert.alert('Campo requerido', msg);
      return;
    }

    setSaving(true);
    try {
      await createCita({
        idPaciente: parseInt(form.idPaciente) || 1,
        idMedico: parseInt(form.idMedico) || 1,
        fechaHora: new Date(form.fechaHora).toISOString(),
        motivo: form.motivo || 'Consulta General',
        estado: 'programada',
        observaciones: form.observaciones,
      } as Cita);

      const msg = '¡Cita médica agendada exitosamente!';
      if (Platform.OS === 'web') window.alert(msg); else Alert.alert('Éxito', msg);

      setModalVisible(false);
      setForm({ idPaciente: '1', idMedico: '1', fechaHora: new Date().toISOString().slice(0, 16), motivo: '', observaciones: '' });
      loadCitas();
    } catch (err: any) {
      console.error('Error agendando cita:', err);
      const msg = err.message || 'Error al agendar cita';
      if (Platform.OS === 'web') window.alert(msg); else Alert.alert('Error', msg);
    } finally {
      setSaving(false);
    }
  };

  const showDetail = (cita: Cita) => {
    const msg = `Cita ID: ${cita.idCita}\nPaciente ID: ${cita.idPaciente}\nMédico ID: ${cita.idMedico}\nEstado: ${cita.estado}\nMotivo: ${cita.motivo || 'N/A'}`;
    if (Platform.OS === 'web') window.alert(msg); else Alert.alert('Detalle de Cita', msg);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Cargando citas médicas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>📅 Citas Médicas</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>➕ Agendar Cita</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.button} onPress={loadCitas}>
            <Text style={styles.buttonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : citas.length === 0 ? (
        <Text style={styles.emptyText}>No hay citas programadas actualmente.</Text>
      ) : (
        <FlatList
          data={citas}
          keyExtractor={(item, index) => (item.idCita ? item.idCita.toString() : index.toString())}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => showDetail(item)}>
              <View style={styles.rowBetween}>
                <Text style={styles.cardTitle}>Cita #{item.idCita || '-'}</Text>
                <Text style={[styles.badge, item.estado === 'programada' ? styles.badgeActive : styles.badgeInactive]}>
                  {item.estado}
                </Text>
              </View>
              <Text style={styles.cardText}>Fecha/Hora: {new Date(item.fechaHora).toLocaleString()}</Text>
              <Text style={styles.cardText}>Motivo: {item.motivo || 'Sin motivo especificado'}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Modal Form */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Agendar Nueva Cita Médica</Text>

              <Text style={styles.label}>ID de Paciente *</Text>
              <TextInput style={styles.input} value={form.idPaciente} onChangeText={t => setForm({ ...form, idPaciente: t })} keyboardType="numeric" placeholder="1" />

              <Text style={styles.label}>ID de Médico *</Text>
              <TextInput style={styles.input} value={form.idMedico} onChangeText={t => setForm({ ...form, idMedico: t })} keyboardType="numeric" placeholder="1" />

              <Text style={styles.label}>Motivo de Consulta</Text>
              <TextInput style={styles.input} value={form.motivo} onChangeText={t => setForm({ ...form, motivo: t })} placeholder="Revisión general" />

              <Text style={styles.label}>Observaciones</Text>
              <TextInput style={styles.input} value={form.observaciones} onChangeText={t => setForm({ ...form, observaciones: t })} placeholder="Paciente requiere ayuno..." />

              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setModalVisible(false)}>
                  <Text style={styles.btnText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={handleCreate} disabled={saving}>
                  <Text style={styles.btnText}>{saving ? 'Guardando...' : 'Agendar'}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#007bff' },
  addButton: { backgroundColor: '#28a745', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  errorText: { fontSize: 16, color: 'red', marginBottom: 10 },
  emptyText: { fontSize: 14, color: '#666', marginTop: 10 },
  card: { padding: 15, borderRadius: 8, backgroundColor: '#f8f9fa', borderWidth: 1, borderColor: '#dee2e6', marginBottom: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#007bff' },
  cardText: { fontSize: 14, color: '#555', marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, fontSize: 12, fontWeight: 'bold', overflow: 'hidden' },
  badgeActive: { backgroundColor: '#d4edda', color: '#155724' },
  badgeInactive: { backgroundColor: '#fff3cd', color: '#856404' },
  button: { backgroundColor: '#007bff', padding: 10, borderRadius: 6 },
  buttonText: { color: '#fff', fontWeight: 'bold' },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 500, backgroundColor: '#fff', borderRadius: 10, padding: 20, maxHeight: '90%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  label: { fontSize: 14, fontWeight: 'bold', marginTop: 8, color: '#555' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginTop: 4, fontSize: 14 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 },
  modalBtn: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 6, marginLeft: 10 },
  cancelBtn: { backgroundColor: '#6c757d' },
  saveBtn: { backgroundColor: '#28a745' },
  btnText: { color: '#fff', fontWeight: 'bold' },
});

export default AppointmentList;
