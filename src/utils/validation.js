// Validações de formulário reutilizáveis.
// Centralizar as regras facilita a manutenção e mantém as telas limpas.

const NIVEIS_VALIDOS = ['BAIXO', 'MÉDIO', 'EXTREMO'];

/**
 * Valida os dados do formulário de registro de ocorrência.
 * @returns {{ valido: boolean, erros: Record<string,string> }}
 */
export function validarOcorrencia({ localidade, pais, nivelPerigo, descricao, coords }) {
  const erros = {};

  if (!localidade || localidade.trim().length < 3) {
    erros.localidade = 'Informe a localidade (mínimo 3 caracteres).';
  }

  if (!pais || pais.trim().length < 2) {
    erros.pais = 'Informe o país.';
  }

  if (!NIVEIS_VALIDOS.includes(nivelPerigo)) {
    erros.nivelPerigo = 'Selecione um nível de perigo.';
  }

  if (descricao && descricao.length > 280) {
    erros.descricao = 'A descrição deve ter no máximo 280 caracteres.';
  }

  if (!coords || typeof coords.latitude !== 'number' || typeof coords.longitude !== 'number') {
    erros.coords = 'Capture a localização (GPS) antes de registrar.';
  }

  return { valido: Object.keys(erros).length === 0, erros };
}

export { NIVEIS_VALIDOS };
