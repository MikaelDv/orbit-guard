// Botão principal reutilizável, com variações e estado de carregamento.
import React from 'react';
import { Text, StyleSheet, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';

export default function PrimaryButton({
  titulo,
  onPress,
  icon,
  carregando = false,
  desabilitado = false,
  variante = 'primary', // 'primary' | 'outline'
}) {
  const outline = variante === 'outline';
  const inativo = desabilitado || carregando;

  return (
    <TouchableOpacity
      style={[
        styles.botao,
        outline ? styles.outline : styles.primary,
        inativo && styles.inativo,
      ]}
      onPress={onPress}
      disabled={inativo}
      activeOpacity={0.85}
    >
      {carregando ? (
        <ActivityIndicator color={outline ? colors.primary : colors.white} />
      ) : (
        <View style={styles.conteudo}>
          {!!icon && (
            <Ionicons
              name={icon}
              size={18}
              color={outline ? colors.primary : colors.white}
              style={{ marginRight: spacing.sm }}
            />
          )}
          <Text style={[styles.texto, outline && styles.textoOutline]}>{titulo}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: colors.primary },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
  inativo: { opacity: 0.5 },
  conteudo: { flexDirection: 'row', alignItems: 'center' },
  texto: { color: colors.white, fontSize: 16, fontWeight: '700' },
  textoOutline: { color: colors.primary },
});
