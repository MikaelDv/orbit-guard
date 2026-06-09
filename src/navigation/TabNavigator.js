// Navegação principal por abas (parte inferior da tela).
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import ListaFocosScreen from '../screens/ListaFocosScreen';
import RegistrarOcorrenciaScreen from '../screens/RegistrarOcorrenciaScreen';
import HistoricoScreen from '../screens/HistoricoScreen';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();

const ICONES = {
  Inicio: 'home',
  Focos: 'flame',
  Registrar: 'add-circle',
  Historico: 'time',
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { color: colors.text },
        headerTintColor: colors.text,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={ICONES[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} options={{ title: 'OrbitGuard' }} />
      <Tab.Screen name="Focos" component={ListaFocosScreen} options={{ title: 'Focos de Incêndio' }} />
      <Tab.Screen name="Registrar" component={RegistrarOcorrenciaScreen} options={{ title: 'Registrar Ocorrência' }} />
      <Tab.Screen name="Historico" component={HistoricoScreen} options={{ title: 'Meu Histórico' }} />
    </Tab.Navigator>
  );
}
