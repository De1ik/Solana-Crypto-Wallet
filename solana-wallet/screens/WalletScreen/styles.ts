import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Theme } from '../../theme';

type Styles = {
  container: ViewStyle;
  title: TextStyle;
  balance: TextStyle;
  addr: TextStyle;
  subtitle: TextStyle;
  txBox: ViewStyle;
  txSig: TextStyle;
};

const styles = (theme: Theme) => StyleSheet.create<Styles>({
  container: {
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
  subtitle: {
    ...theme.typography.h3,
    color: theme.colors.textSecondary,
    marginVertical: theme.spacing.m,
  },
  txBox: {
    backgroundColor: theme.colors.cardBackground,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.s,
    width: '100%',
  },
  txSig: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
  },
  // ... другие стили
});
export default styles;
