import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Alert, Platform, Modal, TextInput, ScrollView } from 'react-native';
import { fetchEmergencias, createEmergencia, Emergencia } from '../api/emergencias';

const EmergencyList: React.FC = () => {
  const [emergencias, setEmergencias] = useState<Emergencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    idPaciente: '1',
    descripcion: '',
    prioridad: 'alta',
    ambulanciaSolicitada: true,
  });

  const loadEmergencias = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEmergencias();
      setEmergencias(data || []);
    } catch (err: any) {
      console.error('Error cargando emergencias:', err);
      setError(err.message || 'Error al cargar emergencias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmergencias();
  }, []);

  const handleCreate = async () => {
    if (!form.idPaciente) {
      const msg = 'Por favor ingresa el ID del Paciente.';
      if (Platform.OS === 'web') window.alert(msg); else Alert.alert('Campo requerido', msg);
      return;
    }

    setSaving(true);
    try {
      await createEmergencia({
        idPaciente: parseInt(form.idPaciente) || 1,
        descripcion: form.descripcion || 'Alerta de Emergencia Médica',
        prioridad: form.prioridad,
        estado: 'pendiente',
        ambulanciaSolicitada: form.ambulanciaSolicitada,
        fechaHora: new Date().toISOString(),
      } as Emergencia);

      const msg = '¡Emergencia registrada exitosamente!';
      if (Platform.OS === 'web') window.alert(msg); else Alert.alert('Éxito', msg);

      setModalVisible(false);
      setForm({ idPaciente: '1', descripcion: '', prioridad: 'alta', ambulanciaSolicitada: true });
      loadEmergencias();
    } catch (err: any) {
      console.error('Error creando emergencia:', err);
      const msg = err.message || 'Error al registrar emergencia';
      if (Platform.OS === 'web') window.alert(msg); else Alert.alert('Error', msg);
    } finally {
      setSaving(false);
    }
  };

  const showDetail = (item: Emergencia) => {
    const msg = `Emergencia ID: ${item.idEmergencia}\nPaciente ID: ${item.idPaciente}\nPrioridad: ${item.prioridad}\nEstado: ${item.estado}\nAmbulancia: ${item.ambulanciaSolicitada ? 'Sí' : 'No'}\nDescripción: ${item.descripcion || 'Sin descripción'}`;
    if (Platform.OS === 'web') window.alert(msg); else Alert.alert('Detalle de Emergencia', msg);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#dc3545" />
        <Text style={styles.loadingText}>Cargando emergencias...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>🚨 Emergencias & Urgencias</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>➕ Nueva Emergencia</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.button} onPress={loadEmergencias}>
            <Text style={styles.buttonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : emergencias.length === 0 ? (
        <Text style={styles.emptyText}>No hay emergencias registradas actualmente.</Text>
      ) : (
        <FlatList
          data={emergencias}
          keyExtractor={(item, index) => (item.idEmergencia ? item.idEmergencia.toString() : index.toString())}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => showDetail(item)}>
              <View style={styles.rowBetween}>
                <Text style={styles.cardTitle}>Emergencia #{item.idEmergencia}</Text>
                <Text style={[styles.badge, item.prioridad === 'alta' ? styles.badgeHigh : styles.badgeNormal]}>
                  Prioridad {item.prioridad}
                </Text>
              </View>
              <Text style={styles.cardText}>Estado: {item.estado}</Text>
              <Text style={styles.cardText}>Ambulancia solicitada: {item.ambulanciaSolicitada ? '🚨 Sí' : 'No'}</Text>
              <Text style={styles.cardText}>Descripción: {item.descripcion || 'N/A'}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Modal Form */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Registrar Alerta de Emergencia</Text>

              <Text style={styles.label}>ID de Paciente *</Text>
              <TextInput style={styles.input} value={form.idPaciente} onChangeText={t => setForm({ ...form, idPaciente: t })} keyboardType="numeric" placeholder="1" />

              <Text style={styles.label}>Prioridad (alta / media / baja)</Text>
              <TextInput style={styles.input} value={form.prioridad} onChangeText={t => setForm({ ...form, prioridad: t })} placeholder="alta" />

              <Text style={styles.label}>Descripción de los Síntomas / Evento</Text>
              <TextInput style={styles.input} value={form.descripcion} onChangeText={t => setForm({ ...form, descripcion: t })} placeholder="Paciente presenta dolor torácico..." />

              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setModalVisible(false)}>
                  <Text style={styles.btnText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={handleCreate} disabled={saving}>
                  <Text style={styles.btnText}>{saving ? 'Guardando...' : 'Registrar'}</Text>
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
  title: { fontSize: 22, fontWeight: 'bold', color: '#dc3545' },
  addButton: { backgroundColor: '#dc3545', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  errorText: { fontSize: 16, color: 'red', marginBottom: 10 },
  emptyText: { fontSize: 14, color: '#666', marginTop: 10 },
  card: { padding: 15, borderRadius: 8, backgroundColor: '#fff5f5', borderWidth: 1, borderColor: '#feb2b2', marginBottom: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#c53030' },
  cardText: { fontSize: 14, color: '#4a5568', marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, fontSize: 12, fontWeight: 'bold', overflow: 'hidden' },
  badgeHigh: { backgroundColor: '#fed7d7', color: '#9b2c2c' },
  badgeNormal: { backgroundColor: '#feebc8', color: '#744210' },
  button: { backgroundColor: '#dc3545', padding: 10, borderRadius: 6 },
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
  saveBtn: { backgroundColor: '#dc3545' },
  btnText: { color: '#fff', fontWeight: 'bold' },
});

export default EmergencyList;
