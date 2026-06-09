// Tela de detalhes: exibe todos os dados de um foco de incêndio selecionado.
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import DangerBadge from '../components/DangerBadge';
import EmptyState from '../components/EmptyState';
import { colors, radius, spacing, corDoPerigo } from '../theme';
import { num, coordenadas, dataBr } from '../utils/format';

export default function DetalhesFocoScreen({ route }) {
  const foco = route.params?.foco;

  // Tratamento: registro não encontrado / parâmetro ausente.
  if (!foco) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="alert-circle-outline"
          titulo="Foco não encontrado"
          mensagem="Não foi possível carregar os detalhes deste registro."
        />
      </View>
    );
  }

  const cor = corDoPerigo(foco.nivelPerigo);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <View style={[styles.cabecalho, { borderColor: cor }]}>
        <View style={styles.cabecalhoTopo}>
          <Ionicons name="location" size={20} color={colors.accent} />
          <Text style={styles.localidade}>{foco.localidade || 'Localidade não informada'}</Text>
        </View>
        <Text style={styles.pais}>{foco.pais}</Text>
        <DangerBadge nivel={foco.nivelPerigo} />
      </View>

      <Secao titulo="Localização">
        <Linha icon="navigate" rotulo="Coordenadas" valor={coordenadas(foco.latitude, foco.longitude)} />
        <Linha icon="calendar" rotulo="Data de detecção" valor={dataBr(foco.data)} />
      </Secao>

      <Secao titulo="Intensidade do fogo">
        <Linha icon="flame" rotulo="Poder radiativo (FRP)" valor={num(foco.poderRadiativoFogo, 1, ' MW')} />
      </Secao>

      <Secao titulo="Condições climáticas">
        <Linha icon="thermometer" rotulo="Temperatura" valor={num(foco.temperaturaCelsius, 1, ' °C')} />
        <Linha icon="water" rotulo="Umidade" valor={num(foco.umidade, 0, ' %')} />
        <Linha icon="cloud" rotulo="Nuvens" valor={num(foco.nuvens, 0, ' %')} />
        <Linha icon="speedometer" rotulo="Vento" valor={num(foco.velocidadeVento, 1, ' m/s')} />
        <Linha icon="flag" rotulo="Rajadas de vento" valor={num(foco.rajadasVento, 1, ' m/s')} />
      </Secao>

      <View style={[styles.nota, { borderColor: cor, backgroundColor: cor + '14' }]}>
        <Ionicons name="information-circle" size={18} color={cor} />
        <Text style={[styles.notaTexto, { color: cor }]}>
          O nível de perigo é calculado pelo OrbitGuard combinando poder radiativo, temperatura,
          umidade, nuvens e vento.
        </Text>
      </View>
    </ScrollView>
  );
}

function Secao({ titulo, children }) {
  return (
    <View style={styles.secao}>
      <Text style={styles.secaoTitulo}>{titulo}</Text>
      <View style={styles.secaoCorpo}>{children}</View>
    </View>
  );
}

function Linha({ icon, rotulo, valor }) {
  return (
    <View style={styles.linha}>
      <View style={styles.linhaEsq}>
        <Ionicons name={icon} size={18} color={colors.textMuted} />
        <Text style={styles.linhaRotulo}>{rotulo}</Text>
      </View>
      <Text style={styles.linhaValor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  conteudo: { padding: spacing.md, paddingBottom: spacing.xl },
  cabecalho: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderLeftWidth: 4,
    marginBottom: spacing.md,
  },
  cabecalhoTopo: { flexDirection: 'row', alignItems: 'center' },
  localidade: { color: colors.text, fontSize: 20, fontWeight: '700', marginLeft: 6, flex: 1 },
  pais: { color: colors.textMuted, fontSize: 14, marginTop: 2, marginBottom: spacing.sm },
  secao: { marginBottom: spacing.md },
  secaoTitulo: { color: colors.textMuted, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', marginBottom: spacing.sm, letterSpacing: 0.5 },
  secaoCorpo: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md },
  linha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  linhaEsq: { flexDirection: 'row', alignItems: 'center' },
  linhaRotulo: { color: colors.text, fontSize: 14, marginLeft: spacing.sm },
  linhaValor: { color: colors.text, fontSize: 14, fontWeight: '700' },
  nota: { flexDirection: 'row', alignItems: 'flex-start', borderWidth: 1, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.sm },
  notaTexto: { flex: 1, marginLeft: spacing.sm, fontSize: 13, lineHeight: 18 },
});
