// Serviço agregador de focos.
//
// Junta os focos vindos da API OrbitGuard (ou do mock) com as ocorrências
// registradas localmente pelo usuário (AsyncStorage), normalizando tudo em
// um formato único. Assim, o foco que o usuário cadastra aparece no mapa e
// na lista junto aos demais focos.

import { listarFocos, buscarFocosPorPais } from './api';
import { listarOcorrencias } from './storage';

// Converte uma ocorrência local para o mesmo formato de um foco da API.
function ocorrenciaParaFoco(o) {
  const iso = new Date(o.criadoEm).toISOString().slice(0, 10);
  return {
    id: `local-${o.id}`,
    nivelPerigo: o.nivelPerigo,
    latitude: o.coords?.latitude,
    longitude: o.coords?.longitude,
    pais: o.pais,
    localidade: o.localidade,
    poderRadiativoFogo: null,
    temperaturaCelsius: null,
    umidade: null,
    nuvens: null,
    velocidadeVento: null,
    rajadasVento: null,
    data: iso,
    descricao: o.descricao,
    origemRegistro: 'local', // marca que foi cadastrado pelo usuário
  };
}

function combinar(focosApi, ocorrencias, termoPais) {
  let locais = ocorrencias.map(ocorrenciaParaFoco);

  // Aplica o mesmo filtro de país às ocorrências locais, quando houver busca.
  if (termoPais) {
    const t = termoPais.toLowerCase();
    locais = locais.filter((f) => (f.pais || '').toLowerCase().includes(t));
  }

  // Locais primeiro, para o usuário ver logo o que cadastrou.
  return [...locais, ...focosApi];
}

/**
 * Carrega todos os focos (API/mock + ocorrências locais).
 * @param {string} [pais] filtro opcional por país
 */
export async function carregarFocos(pais) {
  const termo = (pais || '').trim();
  const resultado = termo ? await buscarFocosPorPais(termo) : await listarFocos();
  const ocorrencias = await listarOcorrencias();

  return {
    dados: combinar(resultado.dados, ocorrencias, termo),
    origem: resultado.origem,
    erro: resultado.erro,
    qtdLocais: ocorrencias.length,
  };
}
