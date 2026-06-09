// Indicador de carregamento padronizado.
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';

export default function Loading({ texto = 'Carregando...' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.texto}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  texto: { color: colors.textMuted, marginTop: spacing.md, fontSize: 14 },
});
