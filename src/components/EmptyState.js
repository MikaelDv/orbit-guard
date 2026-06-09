// Estado vazio / mensagem amigável quando não há dados ou ocorre erro.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';

export default function EmptyState({ icon = 'search', titulo, mensagem }) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={56} color={colors.textMuted} />
      <Text style={styles.titulo}>{titulo}</Text>
      {!!mensagem && <Text style={styles.mensagem}>{mensagem}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  titulo: { color: colors.text, fontSize: 17, fontWeight: '600', marginTop: spacing.md, textAlign: 'center' },
  mensagem: { color: colors.textMuted, fontSize: 14, marginTop: spacing.sm, textAlign: 'center', lineHeight: 20 },
});
