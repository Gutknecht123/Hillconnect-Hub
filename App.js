import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppMainNav from './navigation/appMainNav';


import { AuthProvider } from './context/AuthContext'

export default function App() {
  return (
    <AuthProvider>
      <AppMainNav />
    </AuthProvider>
  );
}


