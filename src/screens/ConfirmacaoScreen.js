// Tela de confirmação/status: confirma que a ocorrência foi registrada e
// oferece os próximos passos do fluxo.
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import DangerBadge from '../components/DangerBadge';
import PrimaryButton from '../components/PrimaryButton';
import { colors, radius, spacing } from '../theme';
import { coordenadas, dataHora } from '../utils/format';

export default function ConfirmacaoScreen({ route, navigation }) {
  const ocorrencia = route.params?.ocorrencia;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <View style={styles.iconeWrap}>
        <Ionicons name="checkmark-circle" size={84} color={colors.success} />
      </View>
      <Text style={styles.titulo}>Ocorrência registrada!</Text>
      <Text style={styles.subtitulo}>
        Seu registro foi salvo no dispositivo e já aparece no seu histórico.
      </Text>

      {!!ocorrencia && (
        <View style={styles.card}>
          <Item rotulo="Protocolo" valor={`#${String(ocorrencia.id).slice(-6)}`} />
          <Item rotulo="Localidade" valor={ocorrencia.localidade} />
          <Item rotulo="País" valor={ocorrencia.pais} />
          <View style={styles.itemLinha}>
            <Text style={styles.itemRotulo}>Nível</Text>
            <DangerBadge nivel={ocorrencia.nivelPerigo} size="sm" />
          </View>
          {!!ocorrencia.coords && (
            <Item
              rotulo="Coordenadas"
              valor={coordenadas(ocorrencia.coords.latitude, ocorrencia.coords.longitude)}
            />
          )}
          <Item rotulo="Registrado em" valor={dataHora(ocorrencia.criadoEm)} />
        </View>
      )}

      <View style={styles.acoes}>
        <PrimaryButton
          titulo="Ver meu histórico"
          icon="time"
          onPress={() => navigation.navigate('Tabs', { screen: 'Historico' })}
        />
        <View style={{ height: spacing.sm }} />
        <PrimaryButton
          titulo="Voltar ao início"
          icon="home"
          variante="outline"
          onPress={() => navigation.navigate('Tabs', { screen: 'Inicio' })}
        />
      </View>
    </ScrollView>
  );
}

function Item({ rotulo, valor }) {
  return (
    <View style={styles.itemLinha}>
      <Text style={styles.itemRotulo}>{rotulo}</Text>
      <Text style={styles.itemValor}>{valor || '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  conteudo: { padding: spacing.lg, alignItems: 'center' },
  iconeWrap: { marginTop: spacing.lg },
  titulo: { color: colors.text, fontSize: 24, fontWeight: '800', marginTop: spacing.md },
  subtitulo: { color: colors.textMuted, fontSize: 14, textAlign: 'center', marginTop: spacing.sm, lineHeight: 20 },
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  itemLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  itemRotulo: { color: colors.textMuted, fontSize: 14 },
  itemValor: { color: colors.text, fontSize: 14, fontWeight: '600', flexShrink: 1, textAlign: 'right', marginLeft: spacing.md },
  acoes: { width: '100%', marginTop: spacing.lg },
});
