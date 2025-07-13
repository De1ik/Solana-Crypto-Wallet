import typography from './typography';
import spacing from './spacing';
import { lightColors, darkColors } from './colors';

export type Theme = {
  colors: typeof lightColors;
  typography: typeof typography;
  spacing: typeof spacing;
  mode: 'light' | 'dark';
};

export const lightTheme: Theme = {
  colors: lightColors,
  typography,
  spacing,
  mode: 'light',
};

export const darkTheme: Theme = {
  colors: darkColors,
  typography,
  spacing,
  mode: 'dark',
};
