import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { fetchMedicos, Medico } from '../../api/medicos';

interface Props {
  navigation: any;
}

const PatientDoctors: React.FC<Props> = ({ navigation }) => {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [filtro, setFiltro] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMedicos();
        if (Array.isArray(data)) {
          setMedicos(data);
        }
      } catch (err) {
        console.warn('Error cargando médicos para pacientes:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const medicosFiltrados = medicos.filter(m => {
    const query = filtro.toLowerCase();
    const nombre = `${m.nombre || ''} ${m.apellido || ''}`.toLowerCase();
    return nombre.includes(query);
  });

  const renderMedicoItem = ({ item }: { item: Medico }) => {
    const doctorName =
      `${item.nombre || ''} ${item.apellido || ''}`.trim() ||
      'Médico Especialista';
    const especialidadName = `Especialidad #${item.idEspecialidad}`;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👨‍⚕️</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.name}>{doctorName}</Text>
            <Text style={styles.specialty}>{especialidadName}</Text>
            <Text style={styles.license}>
              Licencia Médica: {item.numeroLicencia || 'N/D'}
            </Text>
          </View>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.phone}>
            📞 {item.telefono || 'Central Hospitalaria'}
          </Text>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('Citas')}
          >
            <Text style={styles.actionBtnText}>Agendar Cita</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Buscar por nombre o especialidad..."
          placeholderTextColor="#999"
          value={filtro}
          onChangeText={setFiltro}
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>
            Cargando directorio de médicos...
          </Text>
        </View>
      ) : (
        <FlatList
          data={medicosFiltrados}
          keyExtractor={(item, idx) =>
            item.idMedico ? item.idMedico.toString() : idx.toString()
          }
          renderItem={renderMedicoItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🩺</Text>
              <Text style={styles.emptyText}>
                No se encontraron médicos con ese criterio.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fb',
  },
  searchBarContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchInput: {
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1e293b',
  },
  listContent: {
    padding: 16,
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
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 26,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  specialty: {
    fontSize: 13,
    color: '#0284c7',
    fontWeight: '600',
    marginTop: 2,
  },
  license: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
  },
  phone: {
    fontSize: 12,
    color: '#475569',
  },
  actionBtn: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
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
    paddingVertical: 50,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
  },
});

export default PatientDoctors;
