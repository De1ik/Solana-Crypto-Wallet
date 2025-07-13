import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { ChainType } from '../types';

type Props = {
  activeChain: ChainType;
  onSwitch: (chain: ChainType) => void;
};

const NetworkSwitcher: React.FC<Props> = ({ activeChain, onSwitch }) => (
  <View style={styles.row}>
    <Button
      title="Solana"
      color={activeChain === 'solana' ? 'green' : 'gray'}
      onPress={() => onSwitch('solana')}
    />
    <Button
      title="Ethereum"
      color={activeChain === 'ethereum' ? 'green' : 'gray'}
      onPress={() => onSwitch('ethereum')}
    />
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 },
});

export default NetworkSwitcher;
