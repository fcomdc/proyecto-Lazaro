import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { fetchIngresos, createIngreso, Ingreso } from '../api/ingresos';
import { fetchSalas, Sala } from '../api/salas';

const HospitalizationList: React.FC = () => {
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    idPaciente: '1',
    idMedicoResponsable: '1',
    idSala: '1',
    motivoIngreso: '',
    diagnostico: '',
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ingData, salData] = await Promise.all([
        fetchIngresos(),
        fetchSalas(),
      ]);
      setIngresos(ingData || []);
      setSalas(salData || []);
    } catch (err: any) {
      console.error('Error cargando hospitalización:', err);
      setError(err.message || 'Error al cargar datos de hospitalización');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateIngreso = async () => {
    if (!form.idPaciente) {
      const msg = 'Por favor ingresa el ID del Paciente.';
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Campo requerido', msg);
      return;
    }

    setSaving(true);
    try {
      await createIngreso({
        idPaciente: parseInt(form.idPaciente) || 1,
        idMedicoResponsable: parseInt(form.idMedicoResponsable) || 1,
        idSala: parseInt(form.idSala) || 1,
        fechaIngreso: new Date().toISOString(),
        motivoIngreso: form.motivoIngreso || 'Hospitalización General',
        diagnostico: form.diagnostico || 'Bajo observación',
        estado: 'activo',
      } as Ingreso);

      const msg = '¡Ingreso hospitalario registrado exitosamente!';
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Éxito', msg);

      setModalVisible(false);
      setForm({
        idPaciente: '1',
        idMedicoResponsable: '1',
        idSala: '1',
        motivoIngreso: '',
        diagnostico: '',
      });
      loadData();
    } catch (err: any) {
      console.error('Error creando ingreso:', err);
      const msg = err.message || 'Error al registrar ingreso';
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Error', msg);
    } finally {
      setSaving(false);
    }
  };

  const showIngresoDetail = (item: Ingreso) => {
    const msg = `Ingreso ID: ${item.idIngreso}\nPaciente ID: ${
      item.idPaciente
    }\nMédico ID: ${item.idMedicoResponsable || 'N/A'}\nSala ID: ${
      item.idSala || 'N/A'
    }\nMotivo: ${item.motivoIngreso || 'N/A'}\nEstado: ${item.estado}`;
    if (Platform.OS === 'web') window.alert(msg);
    else Alert.alert('Detalle de Ingreso', msg);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#17a2b8" />
        <Text style={styles.loadingText}>Cargando ingresos y salas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>🏥 Hospitalización & Salas</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>➕ Nuevo Ingreso</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.button} onPress={loadData}>
            <Text style={styles.buttonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.sectionHeader}>
            Salas Disponibles ({salas.length})
          </Text>
          {salas.length === 0 ? (
            <Text style={styles.emptyText}>No hay salas registradas.</Text>
          ) : (
            <View style={styles.salasContainer}>
              {salas.map((sala, idx) => (
                <View key={sala.idSala || idx} style={styles.salaChip}>
                  <Text style={styles.salaTitle}>{sala.nombre}</Text>
                  <Text style={styles.salaSub}>
                    Capacidad: {sala.capacidad} | Estado: {sala.estado}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.sectionHeader}>
            Ingresos Hospitalarios ({ingresos.length})
          </Text>
          {ingresos.length === 0 ? (
            <Text style={styles.emptyText}>
              No hay ingresos activos registrados.
            </Text>
          ) : (
            <FlatList
              data={ingresos}
              keyExtractor={(item, index) =>
                item.idIngreso ? item.idIngreso.toString() : index.toString()
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => showIngresoDetail(item)}
                >
                  <View style={styles.rowBetween}>
                    <Text style={styles.cardTitle}>
                      Ingreso #{item.idIngreso}
                    </Text>
                    <Text style={styles.badge}>{item.estado}</Text>
                  </View>
                  <Text style={styles.cardText}>
                    Fecha Ingreso:{' '}
                    {new Date(item.fechaIngreso || '').toLocaleDateString()}
                  </Text>
                  <Text style={styles.cardText}>
                    Motivo: {item.motivoIngreso || 'N/A'}
                  </Text>
                  <Text style={styles.cardText}>
                    Diagnóstico: {item.diagnostico || 'N/A'}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
        </>
      )}

      {/* Modal Form */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>
                Registrar Ingreso Hospitalario
              </Text>

              <Text style={styles.label}>ID de Paciente *</Text>
              <TextInput
                style={styles.input}
                value={form.idPaciente}
                onChangeText={t => setForm({ ...form, idPaciente: t })}
                keyboardType="numeric"
                placeholder="1"
              />

              <Text style={styles.label}>ID de Médico Responsable</Text>
              <TextInput
                style={styles.input}
                value={form.idMedicoResponsable}
                onChangeText={t => setForm({ ...form, idMedicoResponsable: t })}
                keyboardType="numeric"
                placeholder="1"
              />

              <Text style={styles.label}>ID de Sala</Text>
              <TextInput
                style={styles.input}
                value={form.idSala}
                onChangeText={t => setForm({ ...form, idSala: t })}
                keyboardType="numeric"
                placeholder="1"
              />

              <Text style={styles.label}>Motivo de Ingreso</Text>
              <TextInput
                style={styles.input}
                value={form.motivoIngreso}
                onChangeText={t => setForm({ ...form, motivoIngreso: t })}
                placeholder="Cirugía / Observación"
              />

              <Text style={styles.label}>Diagnóstico Inicial</Text>
              <TextInput
                style={styles.input}
                value={form.diagnostico}
                onChangeText={t => setForm({ ...form, diagnostico: t })}
                placeholder="Apendicitis aguda..."
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.cancelBtn]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.btnText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.saveBtn]}
                  onPress={handleCreateIngreso}
                  disabled={saving}
                >
                  <Text style={styles.btnText}>
                    {saving ? 'Guardando...' : 'Registrar Ingreso'}
                  </Text>
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#17a2b8' },
  addButton: {
    backgroundColor: '#17a2b8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    color: '#333',
  },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  errorText: { fontSize: 16, color: 'red', marginBottom: 10 },
  emptyText: { fontSize: 14, color: '#666', marginBottom: 15 },
  salasContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
  salaChip: {
    backgroundColor: '#e0f7fa',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#b2ebf2',
  },
  salaTitle: { fontWeight: 'bold', color: '#006064' },
  salaSub: { fontSize: 12, color: '#00838f' },
  card: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f1f8f9',
    borderWidth: 1,
    borderColor: '#c8e6c9',
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#00796b' },
  cardText: { fontSize: 14, color: '#37474f', marginTop: 2 },
  badge: {
    backgroundColor: '#b2dfdb',
    color: '#004d40',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  button: { backgroundColor: '#17a2b8', padding: 10, borderRadius: 6 },
  buttonText: { color: '#fff', fontWeight: 'bold' },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  label: { fontSize: 14, fontWeight: 'bold', marginTop: 8, color: '#555' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginTop: 4,
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  modalBtn: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 6,
    marginLeft: 10,
  },
  cancelBtn: { backgroundColor: '#6c757d' },
  saveBtn: { backgroundColor: '#17a2b8' },
  btnText: { color: '#fff', fontWeight: 'bold' },
});

export default HospitalizationList;
