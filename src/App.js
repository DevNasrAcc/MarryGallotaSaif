import 'react-native-gesture-handler';

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppContent from './navigations/index'


export default App = () => {
  return (
    <NavigationContainer>
        <AppContent />
    </NavigationContainer>
  )
}