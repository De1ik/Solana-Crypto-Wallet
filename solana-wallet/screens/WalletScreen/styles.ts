import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Theme } from '../../theme';

type Styles = {
  container: ViewStyle;
  title: TextStyle;
  balance: TextStyle;
  addr: TextStyle;
};

const styles = (theme: Theme) => StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.l,
    alignItems: 'center',
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.primary,
    marginBottom: theme.spacing.m,
  },
  balance: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.l,
  },
  addr: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
  },
  // ... другие стили
});
export default styles;
