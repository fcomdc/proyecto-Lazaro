import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';

import { registerApi } from '../../api/auth';
import { createPaciente } from '../../api/pacientes';
import { useAuth } from '../../context/AuthContext';

interface Props {
  navigation: any;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');

  const [error, setError] = useState<string | null>(null);

  // Mostrar mensajes sin utilizar window.alert()
  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      console.log(`${title}: ${message}`);
      setError(`${title}: ${message}`);
      return;
    }

    Alert.alert(title, message);
  };

  const handleRegister = async () => {
    // Validación
    if (
      !nombre.trim() ||
      !apellido.trim() ||
      !nombreUsuario.trim() ||
      !password.trim()
    ) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // =====================================================
      // 1. CREAR USUARIO
      // =====================================================

      await registerApi({
        nombreUsuario: nombreUsuario.trim(),
        passwordHash: password,
        rol: 'PACIENTE',
        activo: true,
      });

      // =====================================================
      // 2. CREAR FICHA DEL PACIENTE
      // =====================================================

      try {
        await createPaciente({
          numeroExpediente: `PAC-${Math.floor(1000 + Math.random() * 9000)}`,

          nombre: nombre.trim(),

          apellido: apellido.trim(),

          fechaNacimiento: '1995-01-01',

          genero: 'M',

          telefono: telefono.trim() || '0000000000',

          email: email.trim(),

          tipoSangre: 'O+',

          alergias: 'Ninguna',

          activo: true,

          fechaRegistro: new Date().toISOString(),
        } as any);
      } catch (pacienteError) {
        console.warn('No se pudo crear la ficha del paciente:', pacienteError);
      }

      // =====================================================
      // 3. REGISTRO EXITOSO
      // =====================================================

      showAlert(
        'Registro Exitoso',
        'Tu cuenta de paciente ha sido creada correctamente.',
      );

      // =====================================================
      // 4. INICIAR SESIÓN AUTOMÁTICAMENTE
      // =====================================================

      await login(nombreUsuario.trim(), password);
    } catch (err: any) {
      console.warn('Error en registro:', err);

      let mensaje =
        'No se pudo completar el registro. Verifica los datos e intenta nuevamente.';

      if (err?.response?.data?.message) {
        mensaje = err.response.data.message;
      } else if (err?.message) {
        mensaje = err.message;
      }

      showAlert('Error de Registro', mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        {/* =====================================================
            ENCABEZADO
        ===================================================== */}

        <Text style={styles.title}>Registro de Paciente</Text>

        <Text style={styles.subtitle}>
          Crea tu cuenta para gestionar citas, ver tu historial médico y
          solicitar atención de emergencia.
        </Text>

        {/* =====================================================
            MENSAJE DE ERROR
        ===================================================== */}

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {error}</Text>

            <TouchableOpacity
              onPress={() => setError(null)}
              style={styles.closeErrorButton}
            >
              <Text style={styles.closeErrorText}>×</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* =====================================================
            NOMBRE Y APELLIDO
        ===================================================== */}

        <View style={styles.row}>
          <View style={styles.inputGroupHalf}>
            <Text style={styles.label}>Nombre *</Text>

            <TextInput
              style={styles.input}
              placeholder="Juan"
              placeholderTextColor="#999"
              value={nombre}
              onChangeText={setNombre}
              autoCapitalize="words"
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroupHalf}>
            <Text style={styles.label}>Apellido *</Text>

            <TextInput
              style={styles.input}
              placeholder="Pérez"
              placeholderTextColor="#999"
              value={apellido}
              onChangeText={setApellido}
              autoCapitalize="words"
              editable={!loading}
            />
          </View>
        </View>

        {/* =====================================================
            NOMBRE DE USUARIO
        ===================================================== */}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre de Usuario *</Text>

          <TextInput
            style={styles.input}
            placeholder="juanperez"
            placeholderTextColor="#999"
            value={nombreUsuario}
            onChangeText={setNombreUsuario}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
        </View>

        {/* =====================================================
            CORREO
        ===================================================== */}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Correo Electrónico</Text>

          <TextInput
            style={styles.input}
            placeholder="juan@ejemplo.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
        </View>

        {/* =====================================================
            TELÉFONO
        ===================================================== */}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Teléfono</Text>

          <TextInput
            style={styles.input}
            placeholder="555-1234"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={telefono}
            onChangeText={setTelefono}
            editable={!loading}
          />
        </View>

        {/* =====================================================
            CONTRASEÑA
        ===================================================== */}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña *</Text>

          <TextInput
            style={styles.input}
            placeholder="Crea una contraseña segura"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
        </View>

        {/* =====================================================
            BOTÓN REGISTRAR
        ===================================================== */}

        <TouchableOpacity
          style={[styles.registerBtn, loading && styles.btnDisabled]}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.registerBtnText}>Completar Registro</Text>
          )}
        </TouchableOpacity>

        {/* =====================================================
            VOLVER AL LOGIN
        ===================================================== */}

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Text style={styles.backBtnText}>
            ← Ya tengo una cuenta, iniciar sesión
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// =============================================================
// ESTILOS
// =============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#eef2f6',
  },

  content: {
    padding: 20,
    justifyContent: 'center',
    flexGrow: 1,
  },

  card: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',

    backgroundColor: '#ffffff',

    borderRadius: 16,

    padding: 24,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.08,

    shadowRadius: 10,

    elevation: 3,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 13,
    color: '#718096',
    marginBottom: 20,
    lineHeight: 18,
  },

  errorBox: {
    position: 'relative',

    backgroundColor: '#fff2f2',

    borderLeftWidth: 4,

    borderLeftColor: '#e53e3e',

    padding: 12,

    paddingRight: 35,

    borderRadius: 6,

    marginBottom: 16,
  },

  errorText: {
    color: '#c53030',

    fontSize: 13,

    lineHeight: 18,
  },

  closeErrorButton: {
    position: 'absolute',

    right: 8,

    top: 7,

    width: 24,

    height: 24,

    alignItems: 'center',

    justifyContent: 'center',
  },

  closeErrorText: {
    color: '#c53030',

    fontSize: 22,

    fontWeight: '600',
  },

  row: {
    flexDirection: 'row',

    gap: 16,

    width: '100%',
  },

  inputGroup: {
    marginBottom: 16,
  },

  inputGroupHalf: {
    flex: 1,

    marginBottom: 16,
  },

  label: {
    fontSize: 13,

    fontWeight: '600',

    color: '#4a5568',

    marginBottom: 6,
  },

  input: {
    borderWidth: 1,

    borderColor: '#cbd5e0',

    borderRadius: 10,

    paddingHorizontal: 14,

    paddingVertical: 11,

    fontSize: 14,

    color: '#2d3748',

    backgroundColor: '#f8fafc',
  },

  registerBtn: {
    backgroundColor: '#28a745',

    paddingVertical: 14,

    borderRadius: 10,

    alignItems: 'center',

    justifyContent: 'center',

    marginTop: 10,

    shadowColor: '#28a745',

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.2,

    shadowRadius: 5,

    elevation: 3,
  },

  btnDisabled: {
    opacity: 0.6,
  },

  registerBtnText: {
    color: '#ffffff',

    fontSize: 16,

    fontWeight: '700',
  },

  backBtn: {
    marginTop: 16,

    alignItems: 'center',

    paddingVertical: 5,
  },

  backBtnText: {
    color: '#0066cc',

    fontSize: 14,

    fontWeight: '600',
  },
});

export default RegisterScreen;
