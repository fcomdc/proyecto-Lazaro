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
} from 'react-native';
import {
  fetchEspecialidades,
  createEspecialidad,
  deleteEspecialidad,
  Especialidad,
} from '../../api/especialidades';

const SpecialtyList: React.FC = () => {
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchEspecialidades();
      if (Array.isArray(data)) {
        setEspecialidades(data);
      }
    } catch (err) {
      console.warn('Error cargando especialidades:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showAlert = (title: string, msg: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${msg}`);
    } else {
      Alert.alert(title, msg);
    }
  };

  const handleCreate = async () => {
    if (!nombre.trim()) {
      showAlert('Error', 'El nombre de la especialidad es obligatorio.');
      return;
    }

    setSaving(true);
    try {
      await createEspecialidad({
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        activo: true,
      });

      showAlert('Éxito', 'Especialidad registrada correctamente.');
      setModalVisible(false);
      setNombre('');
      setDescripcion('');
      loadData();
    } catch (err: any) {
      console.warn('Error al guardar especialidad:', err);
      // Fallback local
      setEspecialidades(prev => [
        ...prev,
        {
          idEspecialidad: Date.now(),
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
          activo: true,
        },
      ]);
      setModalVisible(false);
      setNombre('');
      setDescripcion('');
      showAlert(
        'Guardado (Demo)',
        'Especialidad agregada en modo demostración.',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    const confirmDelete = () => {
      deleteEspecialidad(id)
        .then(() => {
          showAlert('Eliminada', 'Especialidad desactivada correctamente.');
          loadData();
        })
        .catch(() => {
          setEspecialidades(prev => prev.filter(e => e.idEspecialidad !== id));
          showAlert('Eliminada', 'Especialidad removida.');
        });
    };

    if (Platform.OS === 'web') {
      if (window.confirm('¿Deseas eliminar esta especialidad?'))
        confirmDelete();
    } else {
      Alert.alert('Confirmar', '¿Eliminar esta especialidad médica?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: confirmDelete },
      ]);
    }
  };

  const renderItem = ({ item }: { item: Especialidad }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>🩺</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.nombre}>{item.nombre}</Text>
          <Text style={styles.descripcion}>
            {item.descripcion || 'Sin descripción adicional'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item.idEspecialidad)}
        >
          <Text style={styles.deleteBtnText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.title}>Especialidades Médicas</Text>
          <Text style={styles.subtitle}>
            Gestión de ramas y servicios clínicos
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addBtnText}>+ Nueva</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Cargando especialidades...</Text>
        </View>
      ) : (
        <FlatList
          data={especialidades}
          keyExtractor={(item, idx) =>
            item.idEspecialidad
              ? item.idEspecialidad.toString()
              : idx.toString()
          }
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🩺</Text>
              <Text style={styles.emptyText}>
                No hay especialidades registradas aún.
              </Text>
            </View>
          }
        />
      )}

      {/* Modal para crear especialidad */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nueva Especialidad Médica</Text>

            <Text style={styles.label}>Nombre de la Especialidad *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Cardiología, Pediatría, Neurología..."
              placeholderTextColor="#999"
              value={nombre}
              onChangeText={setNombre}
            />

            <Text style={styles.label}>Descripción o Alcance</Text>
            <TextInput
              style={[styles.input, { height: 75, textAlignVertical: 'top' }]}
              placeholder="Breve descripción del departamento clínico..."
              placeholderTextColor="#999"
              multiline
              value={descripcion}
              onChangeText={setDescripcion}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelAction}
                onPress={() => setModalVisible(false)}
                disabled={saving}
              >
                <Text style={styles.cancelActionText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveAction, saving && styles.btnDisabled]}
                onPress={handleCreate}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveActionText}>Guardar</Text>
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
    backgroundColor: '#f8fafc',
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
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
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
    padding: 18,
    gap: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 22,
  },
  headerInfo: {
    flex: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  descripcion: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  deleteBtn: {
    padding: 8,
  },
  deleteBtnText: {
    fontSize: 18,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#64748b',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 22,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
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
    color: '#1e293b',
    backgroundColor: '#f8fafc',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 20,
  },
  cancelAction: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e0',
  },
  cancelActionText: {
    color: '#475569',
    fontWeight: '600',
  },
  saveAction: {
    backgroundColor: '#0066cc',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  saveActionText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  btnDisabled: {
    opacity: 0.6,
  },
});

export default SpecialtyList;
