// Campo de texto rotulado com exibição de mensagem de erro de validação.
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default function InputField({
  label,
  valor,
  onChangeText,
  placeholder,
  erro,
  multiline = false,
  keyboardType = 'default',
  maxLength,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multiline, !!erro && styles.inputErro]}
        value={valor}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        multiline={multiline}
        keyboardType={keyboardType}
        maxLength={maxLength}
      />
      {!!erro && <Text style={styles.erro}>{erro}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  label: { color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: spacing.sm },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 15,
  },
  multiline: { height: 90, textAlignVertical: 'top' },
  inputErro: { borderColor: colors.perigo.EXTREMO },
  erro: { color: colors.perigo.EXTREMO, fontSize: 12, marginTop: 4 },
});
