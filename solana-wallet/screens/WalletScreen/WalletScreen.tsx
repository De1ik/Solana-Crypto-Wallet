import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { KeyManager } from '../../services/KeyManager';
import { NetworkManager } from '../../services/NetworkManager';
import NetworkSwitcher from '../../components/NetworkSwitcher';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChainType, RootStackParamList } from '../../types';
import styles from './styles';
import { useTheme } from '../../theme/useTheme';

const WalletScreen = () => {
  const theme = useTheme();
  const s = styles(theme);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeChain, setActiveChain] = useState<ChainType>('solana');
  const [address, setAddress] = useState<string>('');
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadWallet = async () => {
    setLoading(true);
    try {
      let txs: any[] = [];
      const mnemonic = await KeyManager.getMnemonic();
      if (!mnemonic) throw new Error('No wallet!');
      let addr = '';
      if (activeChain === 'solana') {
        const keypair = await KeyManager.getSolanaKeypairFromMnemonic(mnemonic);
        addr = keypair.publicKey.toBase58();
        setAddress(addr);
        const balance = await NetworkManager.getProvider('solana').getBalance(addr);
        setBalance(balance);
        txs = await NetworkManager.getTransactionsPaginated(addr, activeChain, 3);
      } else if (activeChain === 'ethereum') {
        const ethWallet = NetworkManager.getProvider('ethereum').getWalletFromMnemonic(mnemonic);
        addr = ethWallet.address;
        setAddress(addr);
        const balance = await NetworkManager.getProvider('ethereum').getBalance(addr);
        setBalance(balance);
        txs = await NetworkManager.getTransactionsPaginated(addr, activeChain, 1, 3); 
      }
      setTransactions(txs);
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
          <Button title="Send By Code" onPress={() => navigation.navigate('SendByCode')} />
          <Text style={s.subtitle}>Latest transactions:</Text>
          {transactions.length === 0 && <Text>No transactions found.</Text>}
          {transactions.map((tx, idx) => (
            <View key={tx.signature || tx.hash || idx} style={s.txBox}>
              <Text numberOfLines={1} style={s.txSig}>Tx: {tx.signature || tx.hash}</Text>
              <Text>
                Date: {tx.blockTime
                  ? new Date(tx.blockTime * 1000).toLocaleString()
                  : (tx.timeStamp
                    ? new Date(Number(tx.timeStamp) * 1000).toLocaleString()
                    : '-')
                }
              </Text>
              <Text>Status: {tx.status}</Text>
              <Button title="Details" onPress={() =>
                navigation.navigate('TxDetails', { tx, chain: activeChain })
              } />
            </View>
          ))}
          <Button title="See all" onPress={() => navigation.navigate('AllTx', { chain: activeChain, address })} />
        </>
      )}
      <Button title="Reload" onPress={loadWallet} />
      <Button title="Get By Code" onPress={() => navigation.navigate('ReceiveByCode', { chain: activeChain, address })} />
      <Button title="Logout" color="red" onPress={async () => {
        await KeyManager.clearMnemonic();
        navigation.navigate('CreateWallet');
      }} />
    </ScrollView>
  );
};

export default WalletScreen;
