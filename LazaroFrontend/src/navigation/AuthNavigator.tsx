import React, { useState } from 'react';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

const AuthNavigator: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'Login' | 'Register'>(
    'Login',
  );

  const navigation = {
    navigate: (screen: 'Login' | 'Register') => setCurrentScreen(screen),
    goBack: () => setCurrentScreen('Login'),
  };

  if (currentScreen === 'Register') {
    return <RegisterScreen navigation={navigation} />;
  }

  return <LoginScreen navigation={navigation} />;
};

export default AuthNavigator;
