// Cartão que resume um foco de incêndio na listagem.
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DangerBadge from './DangerBadge';
import { colors, radius, spacing } from '../theme';
import { num, dataBr } from '../utils/format';

export default function FocoCard({ foco, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.topo}>
        <View style={styles.local}>
          <Ionicons name="location" size={16} color={colors.accent} />
          <Text style={styles.localidade} numberOfLines={1}>
            {foco.localidade || 'Localidade não informada'}
          </Text>
        </View>
        <DangerBadge nivel={foco.nivelPerigo} size="sm" />
      </View>

      <Text style={styles.pais}>{foco.pais}</Text>

      <View style={styles.linhaInfo}>
        <Info icon="flame" valor={num(foco.poderRadiativoFogo, 1, ' MW')} label="Radiativo" />
        <Info icon="thermometer" valor={num(foco.temperaturaCelsius, 1, '°C')} label="Temp." />
        <Info icon="water" valor={num(foco.umidade, 0, '%')} label="Umidade" />
      </View>

      <View style={styles.rodape}>
        <Text style={styles.data}>{dataBr(foco.data)}</Text>
        <View style={styles.verMais}>
          <Text style={styles.verMaisTxt}>Ver detalhes</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

function Info({ icon, valor, label }) {
  return (
    <View style={styles.info}>
      <Ionicons name={icon} size={16} color={colors.textMuted} />
      <Text style={styles.infoValor}>{valor}</Text>
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  local: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: spacing.sm },
  localidade: { color: colors.text, fontSize: 16, fontWeight: '600', marginLeft: 4, flex: 1 },
  pais: { color: colors.textMuted, fontSize: 13, marginTop: 2, marginBottom: spacing.md },
  linhaInfo: { flexDirection: 'row', justifyContent: 'space-between' },
  info: { alignItems: 'center', flex: 1 },
  infoValor: { color: colors.text, fontSize: 14, fontWeight: '700', marginTop: 2 },
  infoLabel: { color: colors.textMuted, fontSize: 11 },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  data: { color: colors.textMuted, fontSize: 12 },
  verMais: { flexDirection: 'row', alignItems: 'center' },
  verMaisTxt: { color: colors.primary, fontSize: 13, fontWeight: '600', marginRight: 2 },
});
