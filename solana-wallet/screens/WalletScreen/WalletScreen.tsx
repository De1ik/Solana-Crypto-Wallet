import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { KeyManager } from '../../services/KeyManager';
import { NetworkManager } from '../../services/NetworkManager';
import NetworkSwitcher from '../../components/NetworkSwitcher';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChainType, RootStackParamList } from '../../types';

// Import styles from the styles file
import styles from './styles';
import { useTheme } from '../../theme/useTheme';


const WalletScreen = () => {
  const theme = useTheme();
  const s = styles(theme);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeChain, setActiveChain] = useState<ChainType>('solana');
  const [address, setAddress] = useState<string>('');
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const loadWallet = async () => {
    setLoading(true);
    try {
      const mnemonic = await KeyManager.getMnemonic();
      if (!mnemonic) throw new Error('No wallet!');
      if (activeChain === 'solana') {
        const keypair = await KeyManager.getSolanaKeypairFromMnemonic(mnemonic);
        const publicKey = keypair.publicKey.toBase58();
        setAddress(publicKey);
        const balance = await NetworkManager.getProvider('solana').getBalance(publicKey);
        setBalance(balance);
      } else if (activeChain === 'ethereum') {
        const ethWallet = NetworkManager.getProvider('ethereum').getWalletFromMnemonic(mnemonic);
        setAddress(ethWallet.address);
        const balance = await NetworkManager.getProvider('ethereum').getBalance(ethWallet.address);
        setBalance(balance);
      }
    } catch (e) {
      Alert.alert('Error', String(e));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadWallet();
  }, [activeChain]);

  return (
    <ScrollView contentContainerStyle={s.container}>
      <NetworkSwitcher activeChain={activeChain} onSwitch={setActiveChain} />
      <Text style={s.title}>{activeChain.toUpperCase()} WALLET</Text>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          <Text selectable style={s.balance}>{address}</Text>
          <Text style={s.balance}>Balance: {balance !== null ? balance : '--'} {activeChain === 'solana' ? 'SOL' : 'ETH'}</Text>
          <Button title="Send" onPress={() => navigation.navigate('Send', { chain: activeChain })} />
        </>
      )}
      <Button title="Reload" onPress={loadWallet} />
      <Button title="Logout" color="red" onPress={async () => {
        await KeyManager.clearMnemonic();
        navigation.navigate('CreateWallet');
      }} />
    </ScrollView>
  );
};


export default WalletScreen;
