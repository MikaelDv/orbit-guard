// Tela inicial: apresenta o app, um resumo dos focos e atalhos para o fluxo.
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { listarFocos } from '../services/api';
import PrimaryButton from '../components/PrimaryButton';
import Banner from '../components/Banner';
import { colors, radius, spacing, corDoPerigo } from '../theme';

export default function HomeScreen({ navigation }) {
  const [resumo, setResumo] = useState({ total: 0, EXTREMO: 0, 'MÉDIO': 0, BAIXO: 0 });
  const [origem, setOrigem] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    const { dados, origem } = await listarFocos();
    const novo = { total: dados.length, EXTREMO: 0, 'MÉDIO': 0, BAIXO: 0 };
    dados.forEach((f) => {
      if (novo[f.nivelPerigo] !== undefined) novo[f.nivelPerigo] += 1;
    });
    setResumo(novo);
    setOrigem(origem);
    setCarregando(false);
  }, []);

  // Recarrega o resumo sempre que a tela ganha foco.
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      refreshControl={<RefreshControl refreshing={carregando} onRefresh={carregar} tintColor={colors.primary} />}
    >
      <View style={styles.hero}>
        <Ionicons name="flame" size={40} color={colors.primary} />
        <Text style={styles.titulo}>OrbitGuard</Text>
        <Text style={styles.subtitulo}>
          Monitoramento inteligente de focos de incêndio a partir de dados de satélite (NASA FIRMS)
          e condições climáticas.
        </Text>
      </View>

      {origem === 'mock' && (
        <Banner
          variante="alerta"
          mensagem="API OrbitGuard offline — exibindo dados simulados para demonstração."
        />
      )}

      <Text style={styles.secao}>Panorama atual</Text>
      <View style={styles.cards}>
        <ResumoCard rotulo="Total de focos" valor={resumo.total} icon="flame" cor={colors.primary} />
        <ResumoCard rotulo="Extremo" valor={resumo.EXTREMO} icon="alert-circle" cor={corDoPerigo('EXTREMO')} />
        <ResumoCard rotulo="Médio" valor={resumo['MÉDIO']} icon="warning" cor={corDoPerigo('MÉDIO')} />
        <ResumoCard rotulo="Baixo" valor={resumo.BAIXO} icon="checkmark-circle" cor={corDoPerigo('BAIXO')} />
      </View>

      <Text style={styles.secao}>O que você quer fazer?</Text>
      <View style={styles.acoes}>
        <PrimaryButton
          titulo="Consultar focos de incêndio"
          icon="flame"
          onPress={() => navigation.navigate('Focos')}
        />
        <View style={{ height: spacing.sm }} />
        <PrimaryButton
          titulo="Registrar uma ocorrência"
          icon="add-circle"
          variante="outline"
          onPress={() => navigation.navigate('Registrar')}
        />
        <View style={{ height: spacing.sm }} />
        <PrimaryButton
          titulo="Ver meu histórico"
          icon="time"
          variante="outline"
          onPress={() => navigation.navigate('Historico')}
        />
      </View>
    </ScrollView>
  );
}

function ResumoCard({ rotulo, valor, icon, cor }) {
  return (
    <View style={styles.resumoCard}>
      <Ionicons name={icon} size={22} color={cor} />
      <Text style={[styles.resumoValor, { color: cor }]}>{valor}</Text>
      <Text style={styles.resumoRotulo}>{rotulo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  conteudo: { padding: spacing.md },
  hero: { alignItems: 'center', marginVertical: spacing.lg },
  titulo: { color: colors.text, fontSize: 28, fontWeight: '800', marginTop: spacing.sm },
  subtitulo: { color: colors.textMuted, fontSize: 14, textAlign: 'center', marginTop: spacing.sm, lineHeight: 20 },
  secao: { color: colors.text, fontSize: 17, fontWeight: '700', marginTop: spacing.md, marginBottom: spacing.sm },
  cards: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  resumoCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  resumoValor: { fontSize: 26, fontWeight: '800', marginTop: 4 },
  resumoRotulo: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  acoes: { marginTop: spacing.sm, marginBottom: spacing.xl },
});
