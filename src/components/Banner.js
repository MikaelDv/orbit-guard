// Faixa informativa (ex.: aviso de que os dados são simulados ou erro de rede).
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';

const VARIANTES = {
  info: { cor: colors.accent, icon: 'information-circle' },
  alerta: { cor: colors.perigo['MÉDIO'], icon: 'warning' },
  erro: { cor: colors.perigo.EXTREMO, icon: 'alert-circle' },
};

export default function Banner({ mensagem, variante = 'info' }) {
  if (!mensagem) return null;
  const { cor, icon } = VARIANTES[variante] || VARIANTES.info;
  return (
    <View style={[styles.banner, { borderColor: cor, backgroundColor: cor + '1A' }]}>
      <Ionicons name={icon} size={18} color={cor} />
      <Text style={[styles.texto, { color: cor }]}>{mensagem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.sm,
    padding: spacing.sm + 2,
    marginBottom: spacing.md,
  },
  texto: { flex: 1, marginLeft: spacing.sm, fontSize: 13, lineHeight: 18 },
});
