import { useThemeContext } from './ThemeProvider';

// Простой хук для быстрого доступа к теме
export const useTheme = () => useThemeContext().theme;
