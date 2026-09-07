import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

interface Props {
  navigation: any;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login, loginAsDemo, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Por favor ingresa usuario y contraseña');
      return;
    }

    setError(null);
    const result = await login(username, password);
    if (!result.success) {
      setError(result.message || 'Error al iniciar sesión');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header con Logo */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoIcon}>🏥</Text>
          </View>
          <Text style={styles.brandTitle}>LÁZARO</Text>
          <Text style={styles.brandSubtitle}>
            Sistema Hospitalario Integral
          </Text>
          <Text style={styles.badgeInfo}>
            Portal de Pacientes y Administración
          </Text>
        </View>

        {/* Card de Inicio de Sesión */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Iniciar Sesión</Text>
          <Text style={styles.cardSubtitle}>
            Ingresa tus credenciales para acceder según tu rol
          </Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Usuario o Correo</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. paciente o admin"
              placeholderTextColor="#999"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu contraseña"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginBtnText}>Entrar a Lázaro</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerPrompt}>
            <Text style={styles.promptText}>¿Eres un paciente nuevo? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.linkText}>Crear cuenta</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Acceso rápido de demostración */}
        <View style={styles.demoCard}>
          <Text style={styles.demoTitle}>
            ⚡ Accesos Rápidos de Prueba (Demo)
          </Text>
          <Text style={styles.demoDesc}>
            Selecciona un perfil para comprobar la experiencia según el rol:
          </Text>

          <View style={styles.demoRow}>
            <TouchableOpacity
              style={[styles.demoBtn, styles.demoPatientBtn]}
              onPress={() => loginAsDemo('PACIENTE')}
            >
              <Text style={styles.demoBtnIcon}>👤</Text>
              <Text style={styles.demoBtnText}>Rol Paciente</Text>
              <Text style={styles.demoBtnSub}>App de Paciente</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoBtn, styles.demoAdminBtn]}
              onPress={() => loginAsDemo('ADMINISTRADOR')}
            >
              <Text style={styles.demoBtnIcon}>🛡️</Text>
              <Text style={styles.demoBtnText}>Rol Administrador</Text>
              <Text style={styles.demoBtnSub}>Panel Hospitalario</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2f6',
  },
  scrollContent: {
    padding: 24,
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0066cc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 12,
  },
  logoIcon: {
    fontSize: 36,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0d2538',
    letterSpacing: 1.5,
  },
  brandSubtitle: {
    fontSize: 15,
    color: '#556987',
    marginTop: 2,
  },
  badgeInfo: {
    marginTop: 6,
    fontSize: 12,
    backgroundColor: '#dceefb',
    color: '#0066cc',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#718096',
    marginBottom: 18,
  },
  errorBox: {
    backgroundColor: '#fff2f2',
    borderLeftWidth: 4,
    borderLeftColor: '#e53e3e',
    padding: 10,
    borderRadius: 6,
    marginBottom: 14,
  },
  errorText: {
    color: '#c53030',
    fontSize: 13,
  },
  inputGroup: {
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
    paddingVertical: 12,
    fontSize: 15,
    color: '#2d3748',
    backgroundColor: '#f8fafc',
  },
  loginBtn: {
    backgroundColor: '#0066cc',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
    shadowColor: '#0066cc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  loginBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  registerPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  promptText: {
    color: '#718096',
    fontSize: 14,
  },
  linkText: {
    color: '#0066cc',
    fontSize: 14,
    fontWeight: '700',
  },
  demoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 4,
  },
  demoDesc: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 12,
  },
  demoRow: {
    flexDirection: 'row',
    gap: 10,
  },
  demoBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  demoPatientBtn: {
    backgroundColor: '#e6f4ea',
    borderWidth: 1,
    borderColor: '#34a853',
  },
  demoAdminBtn: {
    backgroundColor: '#e8f0fe',
    borderWidth: 1,
    borderColor: '#1a73e8',
  },
  demoBtnIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  demoBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a202c',
  },
  demoBtnSub: {
    fontSize: 10,
    color: '#4a5568',
    marginTop: 2,
  },
});

export default LoginScreen;
