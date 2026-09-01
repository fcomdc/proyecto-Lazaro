import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';

import { fetchMedicos, createMedico, Medico } from '../api/medicos';

const DoctorList: React.FC = () => {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [filteredMedicos, setFilteredMedicos] = useState<Medico[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');

  const [modalVisible, setModalVisible] = useState(false);

  const [selectedDoctor, setSelectedDoctor] = useState<Medico | null>(null);

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    numeroLicencia: '',
    telefono: '',
    email: '',
    anosExperiencia: '5',
    idEspecialidad: '1',
  });

  /*
   * CARGAR MÉDICOS
   */

  const loadMedicos = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchMedicos();

      setMedicos(data || []);
      setFilteredMedicos(data || []);
    } catch (err: any) {
      console.error('Error cargando médicos:', err);

      setError(err.message || 'Error al cargar médicos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMedicos();
  }, []);

  /*
   * BUSCADOR
   */

  useEffect(() => {
    const text = search.toLowerCase().trim();

    if (!text) {
      setFilteredMedicos(medicos);
      return;
    }

    const results = medicos.filter(doctor => {
      return (
        doctor.nombre?.toLowerCase().includes(text) ||
        doctor.apellido?.toLowerCase().includes(text) ||
        doctor.numeroLicencia?.toLowerCase().includes(text) ||
        doctor.idMedico?.toString().includes(text)
      );
    });

    setFilteredMedicos(results);
  }, [search, medicos]);

  /*
   * ACTUALIZAR
   */

  const onRefresh = () => {
    setRefreshing(true);
    loadMedicos();
  };

  /*
   * LIMPIAR FORMULARIO
   */

  const resetForm = () => {
    setForm({
      nombre: '',
      apellido: '',
      numeroLicencia: '',
      telefono: '',
      email: '',
      anosExperiencia: '5',
      idEspecialidad: '1',
    });
  };

  /*
   * CREAR MÉDICO
   */

  const handleCreate = async () => {
    if (
      !form.nombre.trim() ||
      !form.apellido.trim() ||
      !form.numeroLicencia.trim()
    ) {
      setError('Completa Nombre, Apellido y Número de Licencia.');

      return;
    }

    setSaving(true);

    try {
      await createMedico({
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        numeroLicencia: form.numeroLicencia.trim(),
        telefono: form.telefono.trim(),
        email: form.email.trim(),
        anosExperiencia: parseInt(form.anosExperiencia, 10) || 1,
        idEspecialidad: parseInt(form.idEspecialidad, 10) || 1,
        disponible: true,
        activo: true,
      } as Medico);

      setModalVisible(false);

      resetForm();

      await loadMedicos();
    } catch (err: any) {
      console.error('Error creando médico:', err);

      setError(err.message || 'Error al registrar médico');
    } finally {
      setSaving(false);
    }
  };

  /*
   * FORMATEAR NOMBRE
   */

  const getDoctorName = (doctor: Medico) => {
    return `${doctor.nombre || ''} ${doctor.apellido || ''}`.trim();
  };

  /*
   * TARJETA DEL MÉDICO
   */

  const renderDoctor = ({ item }: { item: Medico }) => {
    const isAvailable = item.disponible;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.75}
        onPress={() => setSelectedDoctor(item)}
      >
        <View style={styles.cardHeader}>
          {/* Avatar */}

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.nombre?.charAt(0).toUpperCase()}
              {item.apellido?.charAt(0).toUpperCase()}
            </Text>
          </View>

          {/* Información */}

          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>Dr. {getDoctorName(item)}</Text>

            <Text style={styles.license}>🪪 {item.numeroLicencia}</Text>
          </View>

          {/* Estado */}

          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                isAvailable
                  ? styles.statusDotAvailable
                  : styles.statusDotUnavailable,
              ]}
            />

            <Text
              style={[
                styles.statusText,
                isAvailable
                  ? styles.statusTextAvailable
                  : styles.statusTextUnavailable,
              ]}
            >
              {isAvailable ? 'Disponible' : 'Ocupado'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>📞 Teléfono</Text>

            <Text style={styles.infoValue}>
              {item.telefono || 'No registrado'}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>✉️ Email</Text>

            <Text style={styles.infoValue} numberOfLines={1}>
              {item.email || 'No registrado'}
            </Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.experience}>
            🩺 {item.anosExperiencia || 0} años de experiencia
          </Text>

          <View style={styles.detailBadge}>
            <Text style={styles.detailText}>Ver perfil →</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  /*
   * LOADING
   */

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />

        <Text style={styles.loadingText}>Cargando directorio médico...</Text>
      </View>
    );
  }

  /*
   * ERROR
   */

  if (error && medicos.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorIcon}>⚠️</Text>

        <Text style={styles.errorTitle}>No se pudo cargar el directorio</Text>

        <Text style={styles.errorText}>{error}</Text>

        <TouchableOpacity style={styles.retryButton} onPress={loadMedicos}>
          <Text style={styles.retryText}>🔄 Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>👨‍⚕️ Directorio Médico</Text>

          <Text style={styles.subtitle}>
            Gestión de médicos y especialistas
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.addIcon}>＋</Text>

          <Text style={styles.addText}>Nuevo</Text>
        </TouchableOpacity>
      </View>

      {/* ESTADÍSTICAS */}

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{medicos.length}</Text>

          <Text style={styles.statLabel}>Médicos</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={[styles.statNumber, styles.statNumberAvailable]}>
            {medicos.filter(doctor => doctor.disponible).length}
          </Text>

          <Text style={styles.statLabel}>Disponibles</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={[styles.statNumber, styles.statNumberActive]}>
            {medicos.filter(doctor => doctor.activo !== false).length}
          </Text>

          <Text style={styles.statLabel}>Activos</Text>
        </View>
      </View>

      {/* BUSCADOR */}

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔎</Text>

        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar médico, licencia..."
          placeholderTextColor="#999"
        />

        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={styles.clearSearch}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* RESULTADOS */}

      <Text style={styles.resultsText}>
        {filteredMedicos.length}{' '}
        {filteredMedicos.length === 1
          ? 'médico encontrado'
          : 'médicos encontrados'}
      </Text>

      {/* LISTA */}

      <FlatList
        data={filteredMedicos}
        keyExtractor={(item, index) =>
          item.idMedico ? item.idMedico.toString() : index.toString()
        }
        renderItem={renderDoctor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007bff']}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>👨‍⚕️</Text>

            <Text style={styles.emptyTitle}>No encontramos médicos</Text>

            <Text style={styles.emptyText}>
              Prueba con otro nombre o número de licencia.
            </Text>

            {search.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setSearch('')}
              >
                <Text style={styles.clearButtonText}>Limpiar búsqueda</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />

      {/* MODAL NUEVO MÉDICO */}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>➕ Nuevo Médico</Text>

                  <Text style={styles.modalSubtitle}>
                    Registrar especialista
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* NOMBRE */}

              <Text style={styles.label}>Nombre *</Text>

              <TextInput
                style={styles.input}
                value={form.nombre}
                onChangeText={text =>
                  setForm({
                    ...form,
                    nombre: text,
                  })
                }
                placeholder="Ej. Carlos"
                placeholderTextColor="#999"
              />

              {/* APELLIDO */}

              <Text style={styles.label}>Apellido *</Text>

              <TextInput
                style={styles.input}
                value={form.apellido}
                onChangeText={text =>
                  setForm({
                    ...form,
                    apellido: text,
                  })
                }
                placeholder="Ej. González"
                placeholderTextColor="#999"
              />

              {/* LICENCIA */}

              <Text style={styles.label}>Número de Licencia *</Text>

              <TextInput
                style={styles.input}
                value={form.numeroLicencia}
                onChangeText={text =>
                  setForm({
                    ...form,
                    numeroLicencia: text,
                  })
                }
                placeholder="Ej. LIC-99882"
                placeholderTextColor="#999"
              />

              {/* TELÉFONO */}

              <Text style={styles.label}>Teléfono</Text>

              <TextInput
                style={styles.input}
                value={form.telefono}
                onChangeText={text =>
                  setForm({
                    ...form,
                    telefono: text,
                  })
                }
                placeholder="Ej. 8888-8888"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />

              {/* EMAIL */}

              <Text style={styles.label}>Correo electrónico</Text>

              <TextInput
                style={styles.input}
                value={form.email}
                onChangeText={text =>
                  setForm({
                    ...form,
                    email: text,
                  })
                }
                placeholder="medico@hospital.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              {/* EXPERIENCIA */}

              <Text style={styles.label}>Años de experiencia</Text>

              <TextInput
                style={styles.input}
                value={form.anosExperiencia}
                onChangeText={text =>
                  setForm({
                    ...form,
                    anosExperiencia: text,
                  })
                }
                placeholder="5"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />

              {/* BOTONES */}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                  disabled={saving}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleCreate}
                  disabled={saving}
                >
                  <Text style={styles.buttonText}>
                    {saving ? 'Guardando...' : '✓ Guardar médico'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL PERFIL DEL MÉDICO */}

      <Modal
        visible={selectedDoctor !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedDoctor(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.profileModal}>
            <View style={styles.profileHeader}>
              <View style={styles.largeAvatar}>
                <Text style={styles.largeAvatarText}>
                  {selectedDoctor?.nombre?.charAt(0).toUpperCase()}

                  {selectedDoctor?.apellido?.charAt(0).toUpperCase()}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedDoctor(null)}
              >
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.profileName}>
              Dr. {selectedDoctor?.nombre} {selectedDoctor?.apellido}
            </Text>

            <View
              style={[
                styles.profileStatus,
                selectedDoctor?.disponible
                  ? styles.profileStatusAvailable
                  : styles.profileStatusUnavailable,
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  selectedDoctor?.disponible
                    ? styles.statusDotAvailable
                    : styles.statusDotUnavailable,
                ]}
              />

              <Text
                style={
                  selectedDoctor?.disponible
                    ? styles.profileStatusTextAvailable
                    : styles.profileStatusTextUnavailable
                }
              >
                {selectedDoctor?.disponible
                  ? 'Disponible para atención'
                  : 'No disponible'}
              </Text>
            </View>

            <View style={styles.profileDivider} />

            <View style={styles.profileItem}>
              <Text style={styles.profileLabel}>🪪 Número de licencia</Text>

              <Text style={styles.profileValue}>
                {selectedDoctor?.numeroLicencia || 'No registrado'}
              </Text>
            </View>

            <View style={styles.profileItem}>
              <Text style={styles.profileLabel}>📞 Teléfono</Text>

              <Text style={styles.profileValue}>
                {selectedDoctor?.telefono || 'No registrado'}
              </Text>
            </View>

            <View style={styles.profileItem}>
              <Text style={styles.profileLabel}>✉️ Correo electrónico</Text>

              <Text style={styles.profileValue}>
                {selectedDoctor?.email || 'No registrado'}
              </Text>
            </View>

            <View style={styles.profileItem}>
              <Text style={styles.profileLabel}>🩺 Experiencia</Text>

              <Text style={styles.profileValue}>
                {selectedDoctor?.anosExperiencia || 0} años
              </Text>
            </View>

            <TouchableOpacity
              style={styles.closeProfileButton}
              onPress={() => setSelectedDoctor(null)}
            >
              <Text style={styles.closeProfileText}>Cerrar perfil</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

/*
 * ESTILOS
 */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    paddingHorizontal: 16,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#f5f7fa',
  },

  /* HEADER */

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 18,
    marginBottom: 16,
  },

  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#075ca8',
  },

  subtitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
  },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 12,
  },

  addIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  addText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 4,
  },

  /* ESTADÍSTICAS */

  statsContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  statNumber: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#007bff',
  },

  statNumberAvailable: {
    color: '#28a745',
  },

  statNumberActive: {
    color: '#007bff',
  },

  statLabel: {
    fontSize: 11,
    color: '#777',
    marginTop: 3,
  },

  /* SEARCH */

  searchContainer: {
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    elevation: 2,
    marginBottom: 8,
  },

  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 14,
    color: '#333',
  },

  clearSearch: {
    fontSize: 18,
    color: '#777',
  },

  resultsText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
    marginLeft: 3,
  },

  /* CARDS */

  list: {
    paddingBottom: 30,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 17,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#e5f1ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  avatarText: {
    color: '#007bff',
    fontSize: 17,
    fontWeight: 'bold',
  },

  doctorInfo: {
    flex: 1,
  },

  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  license: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },

  statusContainer: {
    alignItems: 'flex-end',
  },

  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginBottom: 4,
  },

  statusDotAvailable: {
    backgroundColor: '#28a745',
  },

  statusDotUnavailable: {
    backgroundColor: '#dc3545',
  },

  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },

  statusTextAvailable: {
    color: '#28a745',
  },

  statusTextUnavailable: {
    color: '#dc3545',
  },

  divider: {
    height: 1,
    backgroundColor: '#eeeeee',
    marginVertical: 13,
  },

  infoRow: {
    flexDirection: 'row',
  },

  infoItem: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 11,
    color: '#888',
    marginBottom: 3,
  },

  infoValue: {
    fontSize: 13,
    color: '#444',
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 13,
  },

  experience: {
    fontSize: 11,
    color: '#777',
  },

  detailBadge: {
    backgroundColor: '#eaf3ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9,
  },

  detailText: {
    color: '#007bff',
    fontSize: 11,
    fontWeight: 'bold',
  },

  /* EMPTY */

  empty: {
    alignItems: 'center',
    marginTop: 60,
  },

  emptyIcon: {
    fontSize: 50,
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
  },

  emptyText: {
    fontSize: 13,
    color: '#888',
    marginTop: 6,
    textAlign: 'center',
  },

  clearButton: {
    marginTop: 16,
    backgroundColor: '#007bff',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },

  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  /* LOADING */

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#666',
  },

  /* ERROR */

  errorIcon: {
    fontSize: 45,
    marginBottom: 10,
  },

  errorTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },

  errorText: {
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 15,
  },

  retryButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 10,
  },

  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  /* MODAL */

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },

  modalContent: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 22,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#075ca8',
  },

  modalSubtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 3,
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeText: {
    fontSize: 17,
    color: '#555',
  },

  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#444',
    marginTop: 12,
    marginBottom: 5,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 45,
    fontSize: 14,
    color: '#333',
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 22,
  },

  modalButton: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
    marginLeft: 10,
  },

  cancelButton: {
    backgroundColor: '#6c757d',
  },

  saveButton: {
    backgroundColor: '#28a745',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  /* PERFIL */

  profileModal: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
  },

  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  largeAvatar: {
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: '#e5f1ff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  largeAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
  },

  profileName: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
  },

  profileStatus: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    marginTop: 10,
  },

  profileStatusAvailable: {
    backgroundColor: '#e8f7ed',
  },

  profileStatusUnavailable: {
    backgroundColor: '#fdeaea',
  },

  profileStatusTextAvailable: {
    color: '#28a745',
    fontWeight: 'bold',
  },

  profileStatusTextUnavailable: {
    color: '#dc3545',
    fontWeight: 'bold',
  },

  profileDivider: {
    height: 1,
    backgroundColor: '#eeeeee',
    marginVertical: 18,
  },

  profileItem: {
    marginBottom: 16,
  },

  profileLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },

  profileValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },

  closeProfileButton: {
    backgroundColor: '#007bff',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 5,
  },

  closeProfileText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DoctorList;
