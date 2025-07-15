// src/screens/SendByCodeScreen.tsx
import Constants from 'expo-constants';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, Alert } from 'react-native';
// import { BarCodeScanner } from 'expo-barcode-scanner';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { KeyManager } from '../../services/KeyManager';
import { NetworkManager } from '../../services/NetworkManager';
import { ChainType, RootStackParamList } from '../../types';

const SendByCodeScreen = () => {
  const [code, setCode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [intent, setIntent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const redis_api = Constants.expoConfig?.extra?.REDIS_API;

  // 1. Сканировать QR-код
  const handleBarCodeScanned = ({ data }: any) => {
    setScanning(false);
    setCode(data);
    fetchIntent(data);
  };

  // 2. Получить intent с сервера
  const fetchIntent = async (inputCode: string) => {
    setLoading(true);
    setIntent(null);
    try {
      console.log(redis_api)
      const res = await fetch(`${redis_api}/intent/${inputCode}`);
      const json = await res.json();
      if (!json || !json.address) throw new Error('Код не найден или истёк');
      setIntent(json);
    } catch (e: any) {
      Alert.alert('Ошибка', e.message || String(e));
    }
    setLoading(false);
  };

  // 3. Подтвердить транзакцию (упрощённо, пример для Solana)
  const handleConfirm = async () => {
    if (!intent) return;
    try {
      // тут логика для создания и отправки транзакции (см. предыдущие реализации)
      // Например: вызов NetworkManager.getProvider(intent.network).sendTransaction(...)
      Alert.alert('OK', 'Транзакция будет отправлена');
      sendTx();
    } catch (e: any) {
      Alert.alert('Ошибка', e.message || String(e));
    }
  };

  const route = useRoute<RouteProp<RootStackParamList, 'Send'>>();
  const chain = route.params?.chain as ChainType || 'solana';

  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');

  const sendTx = async () => {
    setLoading(true);
    try {
      const mnemonic = await KeyManager.getMnemonic();
      if (!mnemonic) throw new Error('No wallet!');
      if (!intent.address || !intent.amount) throw new Error('Enter address and amount');
      if (intent.network === 'solana') {
        const keypair = await KeyManager.getSolanaKeypairFromMnemonic(mnemonic);
        const sig = await NetworkManager.getProvider('solana').sendTransaction({
          fromKeypair: keypair,
          to: intent.address,
          amount: Number(intent.amount),
        });
        Alert.alert('Success', `Solana Tx Signature:\n${sig}`);
      } else if (intent.network === 'ethereum') {
        const ethWallet = NetworkManager.getProvider('ethereum').getWalletFromMnemonic(mnemonic);
        // Подготовка строки amount с заменой запятой на точку
        const amountStr = intent.amount.replace(',', '.').trim();

        // Проверка, что введена валидная сумма
        if (!/^\d+(\.\d+)?$/.test(amountStr)) {
          Alert.alert('Error', 'Enter valid amount. Use point as decimal separator.');
          setLoading(false);
          return;
        }
        const hash = await NetworkManager.getProvider('ethereum').sendTransaction({
          fromWallet: ethWallet,
          to: intent.address,
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
    <View style={{ flex: 1, padding: 16 }}>
      {!scanning ? (
        <>
          <Text style={{ fontSize: 20, marginBottom: 16 }}>Отправить по коду</Text>
          <TextInput
            placeholder="Введите код вручную"
            value={code}
            onChangeText={setCode}
            style={{ borderColor: '#ccc', borderWidth: 1, marginBottom: 12, padding: 8, borderRadius: 8 }}
            autoCapitalize="characters"
          />
          <Button title="Получить детали" onPress={() => fetchIntent(code)} disabled={!code} />
          <Text style={{ textAlign: 'center', marginVertical: 10 }}>или</Text>
          <Button title="Сканировать QR-код" onPress={() => setScanning(true)} />

          {loading && <ActivityIndicator style={{ marginTop: 20 }} />}

          {intent && (
            <View style={{ marginTop: 20, padding: 16, backgroundColor: '#eee', borderRadius: 10 }}>
              <Text>Сеть: {intent.network}</Text>
              <Text>Получатель: {intent.address}</Text>
              <Text>Сумма: {intent.amount} {intent.currency}</Text>
              <Text>Описание: {intent.description || '-'}</Text>
              <Button title="Подтвердить и отправить" onPress={handleConfirm} />
            </View>
          )}
        </>
      ) : (
        <Text>Scanner</Text>
        // <BarCodeScanner
        //   onBarCodeScanned={handleBarCodeScanned}
        //   style={{ flex: 1 }}
        // />
      )}
    </View>
  );
};

export default SendByCodeScreen;
