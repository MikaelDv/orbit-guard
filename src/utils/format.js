// Funções utilitárias de formatação de dados para exibição.

/** Formata número com casas decimais fixas, tratando valores ausentes. */
export function num(valor, casas = 1, sufixo = '') {
  if (valor === null || valor === undefined || Number.isNaN(Number(valor))) {
    return '—';
  }
  return `${Number(valor).toFixed(casas)}${sufixo}`;
}

/** Formata coordenadas geográficas. */
export function coordenadas(lat, lng) {
  if (lat === undefined || lng === undefined) return '—';
  return `${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}`;
}

/** Formata uma data ISO (YYYY-MM-DD) para o padrão brasileiro DD/MM/AAAA. */
export function dataBr(iso) {
  if (!iso) return '—';
  const partes = String(iso).split('-');
  if (partes.length !== 3) return iso;
  const [ano, mes, dia] = partes;
  return `${dia}/${mes}/${ano}`;
}

/** Formata um timestamp (ms) para data e hora local. */
export function dataHora(ms) {
  if (!ms) return '—';
  const d = new Date(ms);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
