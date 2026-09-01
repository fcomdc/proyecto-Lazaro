import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  RefreshControl,
} from 'react-native';

import { fetchHistoriales, HistorialClinico } from '../api/historiales';

const MedicalHistoryList: React.FC = () => {
  const [historiales, setHistoriales] = useState<HistorialClinico[]>([]);
  const [filteredHistoriales, setFilteredHistoriales] = useState<
    HistorialClinico[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');

  const [selectedHistorial, setSelectedHistorial] =
    useState<HistorialClinico | null>(null);

  const loadHistoriales = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchHistoriales();

      setHistoriales(data || []);
      setFilteredHistoriales(data || []);
    } catch (err: any) {
      console.error('Error cargando historiales:', err);

      setError(err.message || 'Error al cargar historiales clínicos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadHistoriales();
  }, []);

  /*
   * Buscador interactivo
   */
  useEffect(() => {
    const texto = search.toLowerCase();

    const resultados = historiales.filter(item => {
      return (
        item.idHistorial?.toString().includes(texto) ||
        item.idPaciente?.toString().includes(texto) ||
        item.motivo?.toLowerCase().includes(texto) ||
        item.diagnostico?.toLowerCase().includes(texto)
      );
    });

    setFilteredHistoriales(resultados);
  }, [search, historiales]);

  /*
   * Actualizar deslizando hacia abajo
   */
  const onRefresh = () => {
    setRefreshing(true);
    loadHistoriales();
  };

  /*
   * Formatear fecha
   */
  const formatDate = (fecha?: string) => {
    if (!fecha) {
      return 'Sin fecha';
    }

    const date = new Date(fecha);

    if (isNaN(date.getTime())) {
      return 'Fecha no disponible';
    }

    return date.toLocaleDateString(
      Platform.OS === 'web' ? 'es-ES' : undefined,
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      },
    );
  };

  /*
   * Renderizar cada historial
   */
  const renderHistorial = ({ item }: { item: HistorialClinico }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.75}
        onPress={() => setSelectedHistorial(item)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Text style={styles.cardIcon}>📋</Text>
          </View>

          <View style={styles.headerInfo}>
            <Text style={styles.cardTitle}>Expediente #{item.idHistorial}</Text>

            <Text style={styles.patientText}>
              👤 Paciente #{item.idPaciente}
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.label}>🩺 Motivo</Text>

          <Text style={styles.value} numberOfLines={2}>
            {item.motivo || 'Sin motivo especificado'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>🔬 Diagnóstico</Text>

          <Text style={styles.value} numberOfLines={2}>
            {item.diagnostico || 'Pendiente de diagnóstico'}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.date}>📅 {formatDate(item.fechaHora)}</Text>

          <View style={styles.detailBadge}>
            <Text style={styles.detailText}>Ver detalle</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  /*
   * Pantalla de carga
   */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6f42c1" />

        <Text style={styles.loadingText}>Cargando historiales clínicos...</Text>
      </View>
    );
  }

  /*
   * Pantalla de error
   */
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorIcon}>⚠️</Text>

        <Text style={styles.errorTitle}>Ocurrió un problema</Text>

        <Text style={styles.errorText}>{error}</Text>

        <TouchableOpacity style={styles.retryButton} onPress={loadHistoriales}>
          <Text style={styles.retryText}>🔄 Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ENCABEZADO */}

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>📜 Historial Clínico</Text>

          <Text style={styles.subtitle}>
            Diagnósticos y expedientes médicos
          </Text>
        </View>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={loadHistoriales}
          activeOpacity={0.7}
        >
          <Text style={styles.refreshIcon}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* ESTADÍSTICAS */}

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{historiales.length}</Text>

          <Text style={styles.statLabel}>Total</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{filteredHistoriales.length}</Text>

          <Text style={styles.statLabel}>Mostrando</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {historiales.filter(h => h.diagnostico).length}
          </Text>

          <Text style={styles.statLabel}>Diagnosticados</Text>
        </View>
      </View>

      {/* BUSCADOR */}

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar expediente, paciente o diagnóstico..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />

        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={styles.clearSearch}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* LISTA */}

      <FlatList
        data={filteredHistoriales}
        keyExtractor={(item, index) =>
          item.idHistorial ? item.idHistorial.toString() : index.toString()
        }
        renderItem={renderHistorial}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6f42c1']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>

            <Text style={styles.emptyTitle}>No se encontraron historiales</Text>

            <Text style={styles.emptyText}>
              Intenta realizar otra búsqueda.
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

      {/* MODAL DE DETALLE */}

      <Modal
        visible={selectedHistorial !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedHistorial(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>📜 Historial Clínico</Text>

                <Text style={styles.modalSubtitle}>
                  Expediente #{selectedHistorial?.idHistorial}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedHistorial(null)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalDivider} />

            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>👤 Paciente</Text>

              <Text style={styles.detailValue}>
                ID: {selectedHistorial?.idPaciente}
              </Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>👨‍⚕️ Médico</Text>

              <Text style={styles.detailValue}>
                {selectedHistorial?.idMedico
                  ? `ID: ${selectedHistorial.idMedico}`
                  : 'No asignado'}
              </Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>🩺 Motivo de consulta</Text>

              <Text style={styles.detailValue}>
                {selectedHistorial?.motivo || 'Sin información'}
              </Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>🔬 Diagnóstico</Text>

              <Text style={styles.detailValue}>
                {selectedHistorial?.diagnostico || 'Pendiente'}
              </Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>📝 Observaciones</Text>

              <Text style={styles.detailValue}>
                {selectedHistorial?.observaciones || 'Sin observaciones'}
              </Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>📅 Fecha</Text>

              <Text style={styles.detailValue}>
                {formatDate(selectedHistorial?.fechaHora)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setSelectedHistorial(null)}
            >
              <Text style={styles.closeModalText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    paddingHorizontal: 16,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#f5f6fa',
  },

  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },

  /* HEADER */

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    marginBottom: 18,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3f1672',
  },

  subtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },

  refreshButton: {
    backgroundColor: '#ede5f7',
    padding: 12,
    borderRadius: 14,
  },

  refreshIcon: {
    fontSize: 18,
  },

  /* ESTADÍSTICAS */

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    marginHorizontal: 4,
    borderRadius: 14,
    alignItems: 'center',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6f42c1',
  },

  statLabel: {
    fontSize: 11,
    color: '#777',
    marginTop: 3,
  },

  /* BUSCADOR */

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 16,
    elevation: 2,
  },

  searchIcon: {
    fontSize: 17,
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
    color: '#888',
  },

  /* TARJETAS */

  listContent: {
    paddingBottom: 30,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
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

  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: '#f0e8fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  cardIcon: {
    fontSize: 22,
  },

  headerInfo: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3f1672',
  },

  patientText: {
    fontSize: 12,
    color: '#777',
    marginTop: 3,
  },

  arrow: {
    fontSize: 30,
    color: '#6f42c1',
  },

  divider: {
    height: 1,
    backgroundColor: '#eeeeee',
    marginVertical: 12,
  },

  infoRow: {
    marginBottom: 10,
  },

  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6f42c1',
    marginBottom: 3,
  },

  value: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },

  date: {
    fontSize: 11,
    color: '#888',
  },

  detailBadge: {
    backgroundColor: '#f0e8fa',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },

  detailText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#6f42c1',
  },

  /* ERROR */

  errorIcon: {
    fontSize: 45,
    marginBottom: 10,
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },

  errorText: {
    fontSize: 14,
    color: '#d9534f',
    textAlign: 'center',
    marginBottom: 18,
  },

  retryButton: {
    backgroundColor: '#6f42c1',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },

  retryText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },

  /* VACÍO */

  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },

  emptyIcon: {
    fontSize: 50,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
  },

  emptyText: {
    fontSize: 14,
    color: '#888',
    marginTop: 6,
  },

  clearButton: {
    marginTop: 16,
    backgroundColor: '#6f42c1',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },

  clearButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },

  /* MODAL */

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },

  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 22,
    maxHeight: '85%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#3f1672',
  },

  modalSubtitle: {
    color: '#777',
    marginTop: 4,
  },

  closeButton: {
    backgroundColor: '#f2f2f2',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButtonText: {
    fontSize: 18,
    color: '#555',
  },

  modalDivider: {
    height: 1,
    backgroundColor: '#eeeeee',
    marginVertical: 16,
  },

  detailSection: {
    marginBottom: 15,
  },

  detailLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#6f42c1',
    marginBottom: 4,
  },

  detailValue: {
    fontSize: 15,
    color: '#444',
    lineHeight: 21,
  },

  closeModalButton: {
    backgroundColor: '#6f42c1',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 5,
  },

  closeModalText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default MedicalHistoryList;
