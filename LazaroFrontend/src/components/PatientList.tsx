import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert, Platform, Modal, TextInput, StyleSheet, ScrollView } from 'react-native';
import { fetchPacientes, createPaciente, Paciente } from '../api/pacientes';

const PatientList: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [form, setForm] = useState({
    numeroExpediente: '',
    nombre: '',
    apellido: '',
    fechaNacimiento: new Date().toISOString().split('T')[0],
    genero: 'M',
    direccion: '',
    telefono: '',
    email: '',
    tipoSangre: 'O+',
    alergias: 'Ninguna',
    contactoEmergencia: '',
    telefonoEmergencia: '',
  });

  const loadPacientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPacientes();
      setPacientes(data || []);
    } catch (err: any) {
      console.error('Error cargando pacientes:', err);
      setError(err.message || 'Error al cargar pacientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPacientes();
  }, []);

  const handleCreate = async () => {
    if (!form.nombre || !form.apellido || !form.numeroExpediente) {
      const msg = 'Por favor completa el Expediente, Nombre y Apellido.';
      if (Platform.OS === 'web') window.alert(msg); else Alert.alert('Campo requerido', msg);
      return;
    }

    setSaving(true);
    try {
      await createPaciente({
        ...form,
        activo: true,
        fechaRegistro: new Date().toISOString(),
      } as Paciente);

      const msg = '¡Paciente registrado exitosamente!';
      if (Platform.OS === 'web') window.alert(msg); else Alert.alert('Éxito', msg);

      setModalVisible(false);
      setForm({
        numeroExpediente: '',
        nombre: '',
        apellido: '',
        fechaNacimiento: new Date().toISOString().split('T')[0],
        genero: 'M',
        direccion: '',
        telefono: '',
        email: '',
        tipoSangre: 'O+',
        alergias: 'Ninguna',
        contactoEmergencia: '',
        telefonoEmergencia: '',
      });
      loadPacientes();
    } catch (err: any) {
      console.error('Error creando paciente:', err);
      const msg = err.message || 'Error al registrar paciente';
      if (Platform.OS === 'web') window.alert(msg); else Alert.alert('Error', msg);
    } finally {
      setSaving(false);
    }
  };

  const showAlert = (patient: Paciente) => {
    const msg = `ID: ${patient.idPaciente}\nExpediente: ${patient.numeroExpediente}\nNombre: ${patient.nombre} ${patient.apellido}\nTeléfono: ${patient.telefono || 'N/A'}\nTipo de Sangre: ${patient.tipoSangre || 'N/A'}`;
    if (Platform.OS === 'web') {
      window.alert(msg);
    } else {
      Alert.alert('Paciente', msg);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Cargando pacientes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>👤 Registro de Pacientes</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>➕ Nuevo Paciente</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.button} onPress={loadPacientes}>
            <Text style={styles.buttonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : pacientes.length === 0 ? (
        <Text style={styles.emptyText}>No hay pacientes registrados.</Text>
      ) : (
        <FlatList
          data={pacientes}
          keyExtractor={(item, idx) => (item.idPaciente ? item.idPaciente.toString() : idx.toString())}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => showAlert(item)}>
              <Text style={styles.cardTitle}>{item.numeroExpediente} - {item.nombre} {item.apellido}</Text>
              <Text style={styles.cardSub}>Tel: {item.telefono || 'Sin teléfono'} | Sangre: {item.tipoSangre || 'N/A'}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Modal Form */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Registrar Nuevo Paciente</Text>

              <Text style={styles.label}>Nº Expediente *</Text>
              <TextInput style={styles.input} value={form.numeroExpediente} onChangeText={t => setForm({ ...form, numeroExpediente: t })} placeholder="EXP-1001" />

              <Text style={styles.label}>Nombre *</Text>
              <TextInput style={styles.input} value={form.nombre} onChangeText={t => setForm({ ...form, nombre: t })} placeholder="Juan" />

              <Text style={styles.label}>Apellido *</Text>
              <TextInput style={styles.input} value={form.apellido} onChangeText={t => setForm({ ...form, apellido: t })} placeholder="Pérez" />

              <Text style={styles.label}>Teléfono</Text>
              <TextInput style={styles.input} value={form.telefono} onChangeText={t => setForm({ ...form, telefono: t })} placeholder="555-1234" />

              <Text style={styles.label}>Email</Text>
              <TextInput style={styles.input} value={form.email} onChangeText={t => setForm({ ...form, email: t })} placeholder="paciente@correo.com" />

              <Text style={styles.label}>Tipo de Sangre</Text>
              <TextInput style={styles.input} value={form.tipoSangre} onChangeText={t => setForm({ ...form, tipoSangre: t })} placeholder="O+" />

              <Text style={styles.label}>Alergias</Text>
              <TextInput style={styles.input} value={form.alergias} onChangeText={t => setForm({ ...form, alergias: t })} placeholder="Penicilina..." />

              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setModalVisible(false)}>
                  <Text style={styles.btnText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={handleCreate} disabled={saving}>
                  <Text style={styles.btnText}>{saving ? 'Guardando...' : 'Guardar'}</Text>
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
  card: { padding: 15, borderRadius: 8, backgroundColor: '#f8f9fa', borderWidth: 1, borderColor: '#dee2e6', marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardSub: { fontSize: 14, color: '#666', marginTop: 4 },
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

export default PatientList;