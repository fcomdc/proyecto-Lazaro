import { AppRegistry } from 'react-native';
import { enableScreens } from 'react-native-screens';
import App from './App';
import { name as appName } from './app.json';

// Desactivar native screens en Web para evitar colapso de Vistas
enableScreens(false);

// Ignorar error inofensivo de ResizeObserver del navegador
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    if (e.message && (e.message.includes('ResizeObserver loop') || e.message.includes('ResizeObserver loop limit exceeded'))) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  });
}

// Registrar la app
AppRegistry.registerComponent(appName, () => App);

// Montar en web
AppRegistry.runApplication(appName, {
  rootTag: document.getElementById('root'),
});
