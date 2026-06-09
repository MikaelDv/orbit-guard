// Selo visual que representa o nível de perigo de um foco (BAIXO/MÉDIO/EXTREMO).
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { corDoPerigo, radius, spacing } from '../theme';

export default function DangerBadge({ nivel, size = 'md' }) {
  const cor = corDoPerigo(nivel);
  const pequeno = size === 'sm';
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: cor + '22', borderColor: cor },
        pequeno && styles.badgeSm,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: cor }]} />
      <Text style={[styles.texto, { color: cor }, pequeno && styles.textoSm]}>
        {nivel || 'DESCONHECIDO'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm + 2,
  },
  badgeSm: { paddingVertical: 2, paddingHorizontal: spacing.sm },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  texto: { fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
  textoSm: { fontSize: 11 },
});
