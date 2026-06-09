// Tela de histórico: lista as ocorrências registradas localmente pelo usuário
// (AsyncStorage), permitindo visualizar e remover registros.
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { listarOcorrencias, removerOcorrencia } from '../services/storage';
import DangerBadge from '../components/DangerBadge';
import EmptyState from '../components/EmptyState';
import Loading from '../components/Loading';
import { colors, radius, spacing } from '../theme';
import { coordenadas, dataHora } from '../utils/format';

export default function HistoricoScreen({ navigation }) {
  const [ocorrencias, setOcorrencias] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    setCarregando(true);
    const lista = await listarOcorrencias();
    setOcorrencias(lista);
    setCarregando(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const confirmarRemocao = (id) => {
    Alert.alert('Remover ocorrência', 'Deseja remover este registro do histórico?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          await removerOcorrencia(id);
          carregar();
        },
      },
    ]);
  };

  if (carregando) return <Loading texto="Carregando histórico..." />;

  return (
    <View style={styles.container}>
      <FlatList
        data={ocorrencias}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={
          ocorrencias.length > 0 ? (
            <Text style={styles.contador}>{ocorrencias.length} ocorrência(s) registrada(s)</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.topo}>
              <Text style={styles.localidade} numberOfLines={1}>{item.localidade}</Text>
              <DangerBadge nivel={item.nivelPerigo} size="sm" />
            </View>
            <Text style={styles.pais}>{item.pais}</Text>
            {!!item.descricao && <Text style={styles.descricao}>{item.descricao}</Text>}
            <View style={styles.metaLinha}>
              <Ionicons name="navigate" size={14} color={colors.textMuted} />
              <Text style={styles.meta}>
                {item.coords ? coordenadas(item.coords.latitude, item.coords.longitude) : '—'}
              </Text>
            </View>
            <View style={styles.rodape}>
              <Text style={styles.data}>{dataHora(item.criadoEm)}</Text>
              <TouchableOpacity style={styles.remover} onPress={() => confirmarRemocao(item.id)}>
                <Ionicons name="trash-outline" size={16} color={colors.perigo.EXTREMO} />
                <Text style={styles.removerTxt}>Remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="time-outline"
            titulo="Nenhuma ocorrência registrada"
            mensagem="Registre uma ocorrência para acompanhá-la aqui no seu histórico."
          />
        }
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Registrar')}>
        <Ionicons name="add" size={28} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  lista: { padding: spacing.md, paddingBottom: 96 },
  contador: { color: colors.textMuted, fontSize: 13, marginBottom: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  localidade: { color: colors.text, fontSize: 16, fontWeight: '700', flex: 1, marginRight: spacing.sm },
  pais: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  descricao: { color: colors.text, fontSize: 14, marginTop: spacing.sm, lineHeight: 19 },
  metaLinha: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  meta: { color: colors.textMuted, fontSize: 12, marginLeft: 4 },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  data: { color: colors.textMuted, fontSize: 12 },
  remover: { flexDirection: 'row', alignItems: 'center' },
  removerTxt: { color: colors.perigo.EXTREMO, fontSize: 13, marginLeft: 4, fontWeight: '600' },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
});
