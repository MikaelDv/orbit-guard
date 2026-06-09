// Tema central do aplicativo: cores, espaçamentos e tipografia.
// Centralizar esses valores mantém o visual consistente entre as telas.

export const colors = {
  background: '#0B1120',
  surface: '#16213A',
  surfaceAlt: '#1F2D4D',
  primary: '#FF6B35',
  primaryDark: '#C8451B',
  accent: '#4DA8DA',
  text: '#F5F7FA',
  textMuted: '#9AA7BD',
  border: '#2A3A5C',
  success: '#3DDC97',
  white: '#FFFFFF',

  // Cores por nível de perigo (alinhadas ao back-end OrbitGuard)
  perigo: {
    BAIXO: '#3DDC97',
    'MÉDIO': '#FFC857',
    EXTREMO: '#FF4D4D',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
};

export const typography = {
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 18, fontWeight: '600', color: colors.text },
  body: { fontSize: 15, color: colors.text },
  caption: { fontSize: 13, color: colors.textMuted },
};

// Retorna a cor associada a um nível de perigo, com fallback seguro.
export function corDoPerigo(nivel) {
  return colors.perigo[nivel] || colors.textMuted;
}
