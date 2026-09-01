import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Alert, Platform, Modal, TextInput, ScrollView } from 'react-native';
import { fetchTriajes, createTriaje, Triaje } from '../api/triajes';

const TriageList: React.FC = () => {
  const [triajes, setTriajes] = useState<Triaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    idEvaluacion: '1',
    nivel: 'Nivel 2 (Urgente)',
    temperatura: '36.5',
    frecuenciaCardiaca: '75',
    presionArterial: '120/80',
    saturacionOxigeno: '98',
    observaciones: '',
  });

  const loadTriajes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTriajes();
      setTriajes(data || []);
    } catch (err: any) {
      console.error('Error cargando triajes:', err);
      setError(err.message || 'Error al cargar triajes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTriajes();
  }, []);

  const handleCreate = async () => {
    if (!form.idEvaluacion || !form.nivel) {
      const msg = 'Por favor ingresa ID de Evaluación y Nivel de Triaje.';
      if (Platform.OS === 'web') window.alert(msg); else Alert.alert('Campo requerido', msg);
      return;
    }

    setSaving(true);
    try {
      await createTriaje({
        idEvaluacion: parseInt(form.idEvaluacion) || 1,
        nivel: form.nivel,
        temperatura: parseFloat(form.temperatura) || 36.5,
        frecuenciaCardiaca: parseInt(form.frecuenciaCardiaca) || 75,
        presionArterial: form.presionArterial || '120/80',
        saturacionOxigeno: parseFloat(form.saturacionOxigeno) || 98.0,
        observaciones: form.observaciones,
        fechaHora: new Date().toISOString(),
      } as Triaje);

      const msg = '¡Registro de Triaje guardado exitosamente!';
      if (Platform.OS === 'web') window.alert(msg); else Alert.alert('Éxito', msg);

      setModalVisible(false);
      setForm({ idEvaluacion: '1', nivel: 'Nivel 2 (Urgente)', temperatura: '36.5', frecuenciaCardiaca: '75', presionArterial: '120/80', saturacionOxigeno: '98', observaciones: '' });
      loadTriajes();
    } catch (err: any) {
      console.error('Error creando triaje:', err);
      const msg = err.message || 'Error al guardar triaje';
      if (Platform.OS === 'web') window.alert(msg); else Alert.alert('Error', msg);
    } finally {
      setSaving(false);
    }
  };

  const showDetail = (item: Triaje) => {
    const msg = `Triaje ID: ${item.idTriaje}\nNivel: ${item.nivel}\nTemperatura: ${item.temperatura || '-'} °C\nFrecuencia Cardíaca: ${item.frecuenciaCardiaca || '-'} bpm\nPresión Arterial: ${item.presionArterial || '-'}\nSaturación O2: ${item.saturacionOxigeno || '-'}%`;
    if (Platform.OS === 'web') window.alert(msg); else Alert.alert('Detalle de Triaje', msg);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ffc107" />
        <Text style={styles.loadingText}>Cargando registros de triaje...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>🩺 Triaje & Signos Vitales</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>➕ Nuevo Triaje</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.button} onPress={loadTriajes}>
            <Text style={styles.buttonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : triajes.length === 0 ? (
        <Text style={styles.emptyText}>No hay registros de triaje actualmente.</Text>
      ) : (
        <FlatList
          data={triajes}
          keyExtractor={(item, index) => (item.idTriaje ? item.idTriaje.toString() : index.toString())}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => showDetail(item)}>
              <View style={styles.rowBetween}>
                <Text style={styles.cardTitle}>Triaje #{item.idTriaje}</Text>
                <Text style={styles.badge}>Nivel: {item.nivel}</Text>
              </View>
              <Text style={styles.cardText}>🌡️ Temperatura: {item.temperatura ? `${item.temperatura} °C` : 'N/A'}</Text>
              <Text style={styles.cardText}>💓 Frecuencia Cardíaca: {item.frecuenciaCardiaca ? `${item.frecuenciaCardiaca} bpm` : 'N/A'}</Text>
              <Text style={styles.cardText}>🩸 Presión Arterial: {item.presionArterial || 'N/A'}</Text>
              <Text style={styles.cardText}>🫁 Sat. Oxígeno: {item.saturacionOxigeno ? `${item.saturacionOxigeno}%` : 'N/A'}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Modal Form */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Registrar Nuevos Signos Vitales (Triaje)</Text>

              <Text style={styles.label}>ID de Evaluación *</Text>
              <TextInput style={styles.input} value={form.idEvaluacion} onChangeText={t => setForm({ ...form, idEvaluacion: t })} keyboardType="numeric" placeholder="1" />

              <Text style={styles.label}>Nivel de Triaje</Text>
              <TextInput style={styles.input} value={form.nivel} onChangeText={t => setForm({ ...form, nivel: t })} placeholder="Nivel 1 (Crítico) / Nivel 2" />

              <Text style={styles.label}>Temperatura (°C)</Text>
              <TextInput style={styles.input} value={form.temperatura} onChangeText={t => setForm({ ...form, temperatura: t })} keyboardType="numeric" placeholder="36.5" />

              <Text style={styles.label}>Frecuencia Cardíaca (bpm)</Text>
              <TextInput style={styles.input} value={form.frecuenciaCardiaca} onChangeText={t => setForm({ ...form, frecuenciaCardiaca: t })} keyboardType="numeric" placeholder="75" />

              <Text style={styles.label}>Presión Arterial (mmHg)</Text>
              <TextInput style={styles.input} value={form.presionArterial} onChangeText={t => setForm({ ...form, presionArterial: t })} placeholder="120/80" />

              <Text style={styles.label}>Saturación de Oxígeno (%)</Text>
              <TextInput style={styles.input} value={form.saturacionOxigeno} onChangeText={t => setForm({ ...form, saturacionOxigeno: t })} keyboardType="numeric" placeholder="98" />

              <Text style={styles.label}>Observaciones</Text>
              <TextInput style={styles.input} value={form.observaciones} onChangeText={t => setForm({ ...form, observaciones: t })} placeholder="Paciente normotenso..." />

              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setModalVisible(false)}>
                  <Text style={styles.btnText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={handleCreate} disabled={saving}>
                  <Text style={styles.btnText}>{saving ? 'Guardando...' : 'Guardar Triaje'}</Text>
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
  title: { fontSize: 22, fontWeight: 'bold', color: '#856404' },
  addButton: { backgroundColor: '#ffc107', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  addButtonText: { color: '#212529', fontWeight: 'bold' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  errorText: { fontSize: 16, color: 'red', marginBottom: 10 },
  emptyText: { fontSize: 14, color: '#666', marginTop: 10 },
  card: { padding: 15, borderRadius: 8, backgroundColor: '#fffdf0', borderWidth: 1, borderColor: '#ffeeba', marginBottom: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#856404' },
  cardText: { fontSize: 14, color: '#495057', marginTop: 2 },
  badge: { backgroundColor: '#ffe8a1', color: '#533f03', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, fontSize: 12, fontWeight: 'bold', overflow: 'hidden' },
  button: { backgroundColor: '#ffc107', padding: 10, borderRadius: 6 },
  buttonText: { color: '#212529', fontWeight: 'bold' },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 500, backgroundColor: '#fff', borderRadius: 10, padding: 20, maxHeight: '90%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  label: { fontSize: 14, fontWeight: 'bold', marginTop: 8, color: '#555' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginTop: 4, fontSize: 14 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 },
  modalBtn: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 6, marginLeft: 10 },
  cancelBtn: { backgroundColor: '#6c757d' },
  saveBtn: { backgroundColor: '#ffc107' },
  btnText: { color: '#212529', fontWeight: 'bold' },
});

export default TriageList;
