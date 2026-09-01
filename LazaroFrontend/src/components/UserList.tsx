import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { fetchUsuarios, Usuario } from '../api/usuarios';

const UserList: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsuarios();
      setUsuarios(data || []);
    } catch (err: any) {
      console.error('Error cargando usuarios:', err);
      setError(err.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  const showDetail = (item: Usuario) => {
    const msg = `Usuario ID: ${item.idUsuario}\nNombre de usuario: ${item.nombreUsuario}\nRol: ${item.rol}\nActivo: ${item.activo ? 'Sí' : 'No'}`;
    if (Platform.OS === 'web') {
      window.alert(msg);
    } else {
      Alert.alert('Detalle de Usuario', msg);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fd7e14" />
        <Text style={styles.loadingText}>Cargando usuarios del sistema...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={loadUsuarios}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Administración de Usuarios</Text>
      {usuarios.length === 0 ? (
        <Text style={styles.emptyText}>No hay usuarios registrados actualmente.</Text>
      ) : (
        <FlatList
          data={usuarios}
          keyExtractor={(item, index) => (item.idUsuario ? item.idUsuario.toString() : index.toString())}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => showDetail(item)}>
              <View style={styles.rowBetween}>
                <Text style={styles.cardTitle}>👤 {item.nombreUsuario}</Text>
                <Text style={styles.badge}>Rol: {item.rol}</Text>
              </View>
              <Text style={styles.cardText}>Estado: {item.activo ? '✅ Activo' : '❌ Inactivo'}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#fd7e14',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  card: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#fff4e6',
    borderWidth: 1,
    borderColor: '#ffe8cc',
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d9480f',
  },
  cardText: {
    fontSize: 14,
    color: '#e8590c',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#ffd8a8',
    color: '#d9480f',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  button: {
    backgroundColor: '#fd7e14',
    padding: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default UserList;
