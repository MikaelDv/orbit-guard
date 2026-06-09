// Serviço de comunicação com a API OrbitGuard.
//
// Responsável por consumir os endpoints REST do back-end e, em caso de
// indisponibilidade, retornar dados simulados (mock) para que o aplicativo
// continue demonstrável. Toda a tela consome estes métodos — assim a lógica
// de rede fica isolada da interface (separação tela / componente / serviço).

import { API_BASE_URL, API_TIMEOUT } from './config';
import mockFocos from '../data/mockFocos.json';

// fetch com timeout: evita que o app fique travado esperando uma API offline.
async function fetchComTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT);
  try {
    const resposta = await fetch(url, { ...options, signal: controller.signal });
    return resposta;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Lista todos os focos de incêndio.
 * @returns {Promise<{dados: Array, origem: 'api'|'mock', erro: string|null}>}
 */
export async function listarFocos() {
  try {
    const resposta = await fetchComTimeout(`${API_BASE_URL}/focos`);
    if (!resposta.ok) {
      throw new Error(`Resposta inesperada da API (status ${resposta.status})`);
    }
    const dados = await resposta.json();
    return { dados, origem: 'api', erro: null };
  } catch (e) {
    // Fallback: API indisponível -> usa dados simulados locais.
    return {
      dados: mockFocos,
      origem: 'mock',
      erro: 'Não foi possível conectar à API OrbitGuard. Exibindo dados simulados.',
    };
  }
}

/**
 * Busca focos de incêndio por país.
 * @param {string} pais nome do país (ex: "Brasil")
 */
export async function buscarFocosPorPais(pais) {
  const termo = (pais || '').trim();
  if (!termo) {
    return { dados: [], origem: 'mock', erro: 'Informe um país para a busca.' };
  }

  try {
    const url = `${API_BASE_URL}/focos/${encodeURIComponent(termo)}`;
    const resposta = await fetchComTimeout(url);
    if (!resposta.ok) {
      throw new Error(`Resposta inesperada da API (status ${resposta.status})`);
    }
    const dados = await resposta.json();
    return { dados, origem: 'api', erro: null };
  } catch (e) {
    // Fallback: filtra o mock localmente pelo nome do país.
    const filtrados = mockFocos.filter((f) =>
      f.pais.toLowerCase().includes(termo.toLowerCase())
    );
    return {
      dados: filtrados,
      origem: 'mock',
      erro: 'API indisponível. Filtrando dados simulados localmente.',
    };
  }
}
