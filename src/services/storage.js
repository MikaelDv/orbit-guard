// Serviço de persistência local usando AsyncStorage.
//
// Guarda as ocorrências de incêndio registradas pelo usuário no próprio
// dispositivo, permitindo consultar o histórico mesmo sem conexão.

import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_OCORRENCIAS = '@orbitguard:ocorrencias';

/**
 * Retorna todas as ocorrências salvas (mais recentes primeiro).
 * @returns {Promise<Array>}
 */
export async function listarOcorrencias() {
  try {
    const bruto = await AsyncStorage.getItem(CHAVE_OCORRENCIAS);
    const lista = bruto ? JSON.parse(bruto) : [];
    return lista.sort((a, b) => b.criadoEm - a.criadoEm);
  } catch (e) {
    // Falha de leitura não deve quebrar o app — retorna lista vazia.
    return [];
  }
}

/**
 * Salva uma nova ocorrência e retorna o registro persistido.
 * @param {object} ocorrencia
 */
export async function salvarOcorrencia(ocorrencia) {
  const lista = await listarOcorrencias();
  const registro = {
    id: `${Date.now()}-${lista.length}`,
    criadoEm: Date.now(),
    ...ocorrencia,
  };
  const atualizada = [registro, ...lista];
  await AsyncStorage.setItem(CHAVE_OCORRENCIAS, JSON.stringify(atualizada));
  return registro;
}

/**
 * Busca uma ocorrência específica pelo id.
 * @param {string} id
 */
export async function buscarOcorrenciaPorId(id) {
  const lista = await listarOcorrencias();
  return lista.find((o) => o.id === id) || null;
}

/** Remove uma ocorrência do histórico. */
export async function removerOcorrencia(id) {
  const lista = await listarOcorrencias();
  const atualizada = lista.filter((o) => o.id !== id);
  await AsyncStorage.setItem(CHAVE_OCORRENCIAS, JSON.stringify(atualizada));
}
