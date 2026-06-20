export const colors = {
  bg: '#0f0f13',
  surface: '#1a1a24',
  surface2: '#22222f',
  border: '#2e2e3e',
  accent: '#6c63ff',
  accentLight: '#8b85ff',
  accentDim: 'rgba(108,99,255,0.15)',
  green: '#22c55e',
  greenDim: 'rgba(34,197,94,0.12)',
  yellow: '#f59e0b',
  yellowDim: 'rgba(245,158,11,0.12)',
  red: '#ef4444',
  redDim: 'rgba(239,68,68,0.12)',
  text: '#f1f0ff',
  text2: '#9b99b8',
  text3: '#5c5a7a',
  white: '#ffffff',
  transparent: 'transparent',
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 } as const;
export const radius = { sm: 8, md: 12, lg: 16, xl: 20, full: 999 } as const;
export const fontSize = { xs: 10, sm: 12, md: 14, lg: 16, xl: 18, xxl: 22, xxxl: 28 } as const;
export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const priorityColor: Record<string, string> = {
  high: colors.red, medium: colors.yellow, low: colors.green,
};
export const priorityDimColor: Record<string, string> = {
  high: colors.redDim, medium: colors.yellowDim, low: colors.greenDim,
};
export const statusColor: Record<string, string> = {
  pending: colors.yellow, in_progress: colors.accentLight, done: colors.green,
};
export const statusDimColor: Record<string, string> = {
  pending: colors.yellowDim, in_progress: colors.accentDim, done: colors.greenDim,
};
export const statusLabel: Record<string, string> = {
  pending: 'Pendente', in_progress: 'Em progresso', done: 'Concluída',
};
export const priorityLabel: Record<string, string> = {
  low: 'Baixa', medium: 'Média', high: 'Alta',
};
