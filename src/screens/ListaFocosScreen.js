// Tela de listagem: consome a API OrbitGuard e lista os focos de incêndio,
// com busca por país e atualização por "puxar para recarregar".
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { carregarFocos } from '../services/focosService';
import FocoCard from '../components/FocoCard';
import FocosMap from '../components/FocosMap';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import Banner from '../components/Banner';
import { colors, radius, spacing, corDoPerigo } from '../theme';

export default function ListaFocosScreen({ navigation }) {
  const [focos, setFocos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [busca, setBusca] = useState('');
  const [aviso, setAviso] = useState(null);

  const carregar = useCallback(async (paisFiltro) => {
    setAviso(null);
    const resultado = await carregarFocos(paisFiltro);
    setFocos(resultado.dados);
    if (resultado.erro) setAviso(resultado.erro);
    else if (resultado.origem === 'mock') setAviso('Exibindo dados simulados (API offline).');
  }, []);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      (async () => {
        setCarregando(true);
        await carregar(busca.trim() || undefined);
        if (ativo) setCarregando(false);
      })();
      return () => {
        ativo = false;
      };
      // Recarrega ao focar; não depende de `busca` para não disparar a cada tecla.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [carregar])
  );

  const aoBuscar = async () => {
    setCarregando(true);
    await carregar(busca.trim() || undefined);
    setCarregando(false);
  };

  const limparBusca = async () => {
    setBusca('');
    setCarregando(true);
    await carregar(undefined);
    setCarregando(false);
  };

  const aoAtualizar = async () => {
    setAtualizando(true);
    await carregar(busca.trim() || undefined);
    setAtualizando(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buscaContainer}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          style={styles.buscaInput}
          placeholder="Buscar por país (ex: Brasil)"
          placeholderTextColor={colors.textMuted}
          value={busca}
          onChangeText={setBusca}
          onSubmitEditing={aoBuscar}
          returnKeyType="search"
        />
        {busca.length > 0 && (
          <TouchableOpacity onPress={limparBusca}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {carregando ? (
        <Loading texto="Consultando focos de incêndio..." />
      ) : (
        <FlatList
          data={focos}
          keyExtractor={(item, idx) => String(item.id ?? idx)}
          contentContainerStyle={styles.lista}
          refreshing={atualizando}
          onRefresh={aoAtualizar}
          ListHeaderComponent={
            <>
              {!!aviso && <Banner variante="alerta" mensagem={aviso} />}
              {focos.length > 0 && (
                <>
                  <FocosMap
                    focos={focos}
                    onSelecionar={(foco) => navigation.navigate('DetalhesFoco', { foco })}
                  />
                  <View style={styles.legenda}>
                    <LegendaItem cor={corDoPerigo('EXTREMO')} texto="Extremo" />
                    <LegendaItem cor={corDoPerigo('MÉDIO')} texto="Médio" />
                    <LegendaItem cor={corDoPerigo('BAIXO')} texto="Baixo" />
                    <LegendaItem cor={colors.accent} texto="Minha ocorrência" anel />
                  </View>
                </>
              )}
              <Text style={styles.contador}>
                {focos.length} foco(s) encontrado(s)
              </Text>
            </>
          }
          renderItem={({ item }) => (
            <FocoCard
              foco={item}
              onPress={() => navigation.navigate('DetalhesFoco', { foco: item })}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="flame-outline"
              titulo="Nenhum foco encontrado"
              mensagem={
                busca
                  ? `Não há registros para "${busca}". Tente outro país.`
                  : 'Não há focos disponíveis no momento.'
              }
            />
          }
        />
      )}
    </View>
  );
}

function LegendaItem({ cor, texto, anel }) {
  return (
    <View style={styles.legendaItem}>
      <View
        style={[
          styles.legendaDot,
          { backgroundColor: cor },
          anel && { borderWidth: 2, borderColor: colors.white },
        ]}
      />
      <Text style={styles.legendaTxt}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  legenda: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  legendaItem: { flexDirection: 'row', alignItems: 'center' },
  legendaDot: { width: 12, height: 12, borderRadius: 6, marginRight: 5 },
  legendaTxt: { color: colors.textMuted, fontSize: 12 },
  buscaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    margin: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buscaInput: { flex: 1, color: colors.text, paddingVertical: 12, marginLeft: spacing.sm, fontSize: 15 },
  lista: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  contador: { color: colors.textMuted, fontSize: 13, marginBottom: spacing.sm },
});
