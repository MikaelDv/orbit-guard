// Navegador raiz (pilha): abas + telas empilhadas (detalhes e confirmação).
import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from './TabNavigator';
import DetalhesFocoScreen from '../screens/DetalhesFocoScreen';
import ConfirmacaoScreen from '../screens/ConfirmacaoScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator();

// Tema de navegação alinhado às cores do app.
const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
  },
};

export default function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleStyle: { color: colors.text },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen
          name="DetalhesFoco"
          component={DetalhesFocoScreen}
          options={{ title: 'Detalhes do Foco' }}
        />
        <Stack.Screen
          name="Confirmacao"
          component={ConfirmacaoScreen}
          options={{ title: 'Confirmação', headerBackVisible: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
