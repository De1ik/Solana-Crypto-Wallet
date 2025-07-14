import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { KeyManager } from '../../services/KeyManager';
import { NetworkManager } from '../../services/NetworkManager';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList, ChainType } from '../../types';

const SendScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'Send'>>();
  const chain = route.params?.chain as ChainType || 'solana';

  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const sendTx = async () => {
    setLoading(true);
    try {
      const mnemonic = await KeyManager.getMnemonic();
      if (!mnemonic) throw new Error('No wallet!');
      if (!toAddress || !amount) throw new Error('Enter address and amount');
      if (chain === 'solana') {
        const keypair = await KeyManager.getSolanaKeypairFromMnemonic(mnemonic);
        const sig = await NetworkManager.getProvider('solana').sendTransaction({
          fromKeypair: keypair,
          to: toAddress,
          amount: Number(amount),
        });
        Alert.alert('Success', `Solana Tx Signature:\n${sig}`);
      } else if (chain === 'ethereum') {
        const ethWallet = NetworkManager.getProvider('ethereum').getWalletFromMnemonic(mnemonic);
        // Подготовка строки amount с заменой запятой на точку
        const amountStr = amount.replace(',', '.').trim();

        // Проверка, что введена валидная сумма
        if (!/^\d+(\.\d+)?$/.test(amountStr)) {
          Alert.alert('Error', 'Enter valid amount. Use point as decimal separator.');
          setLoading(false);
          return;
        }
        const hash = await NetworkManager.getProvider('ethereum').sendTransaction({
          fromWallet: ethWallet,
          to: toAddress,
          amount: amountStr,
        });
        Alert.alert('Success', `Ethereum Tx Hash:\n${hash}`);
      }
      setToAddress('');
      setAmount('');
    } catch (e) {
      Alert.alert('Error', String(e));
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Send {chain === 'solana' ? 'SOL' : 'ETH'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Recipient address"
        value={toAddress}
        onChangeText={setToAddress}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder={`Amount (${chain === 'solana' ? 'SOL' : 'ETH'})`}
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
      />
      {loading ? <ActivityIndicator /> : <Button title="Send" onPress={sendTx} />}
      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 20, marginBottom: 20 },
  input: { borderColor: '#aaa', borderWidth: 1, borderRadius: 8, width: '100%', marginBottom: 14, padding: 8 },
});

export default SendScreen;
