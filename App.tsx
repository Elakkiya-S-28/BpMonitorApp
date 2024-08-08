import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
} from 'react-native';
import { AuthProvider } from './src/Context';
import AppNavigator from './src/Navigation';



function App(): React.JSX.Element {

  return (
    <AuthProvider>
    <AppNavigator />
  </AuthProvider>
  );
}

const styles = StyleSheet.create({
  
});

export default App;
