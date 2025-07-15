import Constants from 'expo-constants';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList, ChainType } from '../../types';

export default function ReceiveByCodeScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'ReceiveByCode'>>();
  const { chain, address } = route.params;

  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('SOL');
  const [network, setNetwork] = useState<'solana' | 'ethereum'>(chain);
  const [code, setCode] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [loading, setLoading] = useState(false);

  const redis_api = Constants.expoConfig?.extra?.REDIS_API;

  const handleGenerate = async () => {
    if (!amount || !address) {
      Alert.alert('Ошибка', 'Введите сумму и адрес.');
      return;
    }
    setLoading(true);
    try {
      const resp = await fetch(`${redis_api}/intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency, network, address }),
      });
      const data = await resp.json();
      if (data.code) {
        setCode(data.code);
        setQrValue(data.code); // Можно добавить дополнительные данные для QR
      } else {
        Alert.alert('Ошибка', 'Не удалось создать код');
      }
    } catch (e) {
      Alert.alert('Ошибка', String(e));
    }
    setLoading(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Get Code for Payment</Text>
        <TextInput
            placeholder="Amount"
            value={amount}
            onChangeText={setAmount}
            style={styles.input}
            keyboardType="decimal-pad"
        />
        {/* Можно заменить на свой компонент выбора сети/валюты */}
        <TextInput
            placeholder="Currency (SOL, USDC)"
            value={currency}
            onChangeText={setCurrency}
            style={styles.input}
        />
        <TextInput
            placeholder="Netwrk (solana/ethereum)"
            value={network}
            onChangeText={val => setNetwork(val as any)}
            style={styles.input}
        />
        <TextInput
            placeholder="Your Address"
            value={address}
            style={styles.input}
        />
        <Button title="Generate Code" onPress={handleGenerate} disabled={loading} />

        {code ? (
            <View style={styles.resultBox}>
            <Text style={styles.codeText}>Your Code: <Text selectable>{code}</Text></Text>
            <QRCode value={qrValue} size={150} />
            </View>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 18 },
  input: { borderWidth: 1, borderColor: '#aaa', borderRadius: 8, marginBottom: 12, width: '100%', padding: 10 },
  resultBox: { marginTop: 20, alignItems: 'center' },
  codeText: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
});
