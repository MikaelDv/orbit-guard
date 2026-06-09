// Tela de cadastro/registro de ocorrência.
// Fluxo: capturar localização (GPS) -> preencher dados -> validar -> salvar
// localmente (AsyncStorage) -> tela de confirmação.
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import Banner from '../components/Banner';
import { obterLocalizacaoAtual } from '../services/location';
import { salvarOcorrencia } from '../services/storage';
import { validarOcorrencia, NIVEIS_VALIDOS } from '../utils/validation';
import { coordenadas } from '../utils/format';
import { colors, radius, spacing, corDoPerigo } from '../theme';

const ESTADO_INICIAL = {
  localidade: '',
  pais: '',
  nivelPerigo: '',
  descricao: '',
  coords: null,
};

export default function RegistrarOcorrenciaScreen({ navigation }) {
  const [form, setForm] = useState(ESTADO_INICIAL);
  const [erros, setErros] = useState({});
  const [capturandoGps, setCapturandoGps] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [avisoGps, setAvisoGps] = useState(null);

  const atualizar = (campo, valor) => {
    setForm((f) => ({ ...f, [campo]: valor }));
    setErros((e) => ({ ...e, [campo]: undefined }));
  };

  // RECURSO MOBILE: captura a posição real do dispositivo via GPS.
  const capturarLocalizacao = async () => {
    setCapturandoGps(true);
    setAvisoGps(null);
    const r = await obterLocalizacaoAtual();
    if (!r.ok) {
      // Tratamento de permissão negada / GPS indisponível.
      setAvisoGps(r.erro);
    } else {
      setForm((f) => ({
        ...f,
        coords: r.coords,
        localidade: f.localidade || r.endereco.localidade,
        pais: f.pais || r.endereco.pais,
      }));
      setErros((e) => ({ ...e, coords: undefined }));
    }
    setCapturandoGps(false);
  };

  const registrar = async () => {
    const { valido, erros: errosValidacao } = validarOcorrencia(form);
    if (!valido) {
      setErros(errosValidacao);
      return;
    }
    try {
      setSalvando(true);
      const registro = await salvarOcorrencia(form);
      // Limpa o formulário e navega para a confirmação.
      setForm(ESTADO_INICIAL);
      setErros({});
      navigation.navigate('Confirmacao', { ocorrencia: registro });
    } catch (e) {
      setAvisoGps('Falha ao salvar a ocorrência. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  const temCoords = !!form.coords;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
      <Text style={styles.intro}>
        Registre um foco de incêndio observado. A localização é capturada automaticamente pelo GPS
        do seu dispositivo.
      </Text>

      {/* Bloco de captura de GPS */}
      <View style={[styles.gpsBox, temCoords && styles.gpsBoxOk]}>
        <View style={styles.gpsTopo}>
          <Ionicons
            name={temCoords ? 'checkmark-circle' : 'location'}
            size={22}
            color={temCoords ? colors.success : colors.accent}
          />
          <Text style={styles.gpsTitulo}>
            {temCoords ? 'Localização capturada' : 'Localização (GPS)'}
          </Text>
        </View>
        {temCoords ? (
          <Text style={styles.gpsCoords}>{coordenadas(form.coords.latitude, form.coords.longitude)}</Text>
        ) : (
          <Text style={styles.gpsHint}>Toque no botão para usar sua posição atual.</Text>
        )}
        <View style={{ height: spacing.sm }} />
        <PrimaryButton
          titulo={temCoords ? 'Atualizar localização' : 'Capturar localização'}
          icon="navigate"
          variante="outline"
          carregando={capturandoGps}
          onPress={capturarLocalizacao}
        />
        {!!erros.coords && <Text style={styles.erroCampo}>{erros.coords}</Text>}
      </View>

      {!!avisoGps && <Banner variante="erro" mensagem={avisoGps} />}

      <InputField
        label="Localidade *"
        valor={form.localidade}
        onChangeText={(t) => atualizar('localidade', t)}
        placeholder="Ex: Parque Nacional da Chapada"
        erro={erros.localidade}
      />

      <InputField
        label="País *"
        valor={form.pais}
        onChangeText={(t) => atualizar('pais', t)}
        placeholder="Ex: Brasil"
        erro={erros.pais}
      />

      {/* Seleção do nível de perigo */}
      <Text style={styles.label}>Nível de perigo *</Text>
      <View style={styles.niveis}>
        {NIVEIS_VALIDOS.map((nivel) => {
          const selecionado = form.nivelPerigo === nivel;
          const cor = corDoPerigo(nivel);
          return (
            <TouchableOpacity
              key={nivel}
              style={[
                styles.nivelBtn,
                { borderColor: cor },
                selecionado && { backgroundColor: cor + '26' },
              ]}
              onPress={() => atualizar('nivelPerigo', nivel)}
            >
              <Text style={[styles.nivelTxt, { color: cor }]}>{nivel}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {!!erros.nivelPerigo && <Text style={styles.erroCampo}>{erros.nivelPerigo}</Text>}

      <View style={{ height: spacing.md }} />
      <InputField
        label="Descrição (opcional)"
        valor={form.descricao}
        onChangeText={(t) => atualizar('descricao', t)}
        placeholder="Detalhes da ocorrência (fumaça, extensão, acesso...)"
        multiline
        maxLength={280}
        erro={erros.descricao}
      />

      <PrimaryButton
        titulo="Registrar ocorrência"
        icon="save"
        carregando={salvando}
        onPress={registrar}
      />
      <View style={{ height: spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  conteudo: { padding: spacing.md },
  intro: { color: colors.textMuted, fontSize: 14, lineHeight: 20, marginBottom: spacing.md },
  gpsBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  gpsBoxOk: { borderColor: colors.success },
  gpsTopo: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  gpsTitulo: { color: colors.text, fontSize: 16, fontWeight: '700', marginLeft: spacing.sm },
  gpsCoords: { color: colors.text, fontSize: 15, fontWeight: '600' },
  gpsHint: { color: colors.textMuted, fontSize: 13 },
  label: { color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: spacing.sm },
  niveis: { flexDirection: 'row', justifyContent: 'space-between' },
  nivelBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  nivelTxt: { fontSize: 13, fontWeight: '700' },
  erroCampo: { color: colors.perigo.EXTREMO, fontSize: 12, marginTop: 6 },
});
