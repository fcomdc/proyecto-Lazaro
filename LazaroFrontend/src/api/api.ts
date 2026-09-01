import axios from 'axios';
import { Platform } from 'react-native';

// Determina la URL base según la plataforma
const getBaseURL = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5016'; // Android Emulator
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:5016'; // iOS Simulator
  } else {
    return ''; // Web: usa proxy de Webpack devServer o la misma URL base
  }
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Agrega logs para depuración
api.interceptors.request.use(request => {
  console.log('📤 Request:', request.method?.toUpperCase(), request.url);
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('📥 Response:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('❌ Axios Error:', {
      message: error.message,
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  },
);

export const get = async (endpoint: string) => {
  const response = await api.get(endpoint);
  return response.data;
};

export const post = async (endpoint: string, data: any) => {
  const response = await api.post(endpoint, data);
  return response.data;
};

export const put = async (endpoint: string, data: any) => {
  const response = await api.put(endpoint, data);
  return response.data;
};

export const deleteApi = async (endpoint: string) => {
  const response = await api.delete(endpoint);
  return response.data;
};

export default api;
