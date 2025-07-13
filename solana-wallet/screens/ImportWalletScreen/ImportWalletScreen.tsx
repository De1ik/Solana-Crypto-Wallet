import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { KeyManager } from '../../services/KeyManager';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

const ImportWalletScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [mnemonic, setMnemonic] = useState('');
  const [error, setError] = useState('');

  const handleImport = async () => {
    if (mnemonic.trim().split(' ').length !== 12) {
      setError('Enter a valid 12-word phrase');
      return;
    }
    try {
      await KeyManager.saveMnemonic(mnemonic.trim());
      navigation.navigate('Wallet');
    } catch (e) {
      setError('Failed to import mnemonic');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Import wallet</Text>
      <TextInput
        style={styles.input}
        value={mnemonic}
        onChangeText={setMnemonic}
        placeholder="Enter 12 words"
        multiline
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Import" onPress={handleImport} />
      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 20, marginBottom: 16 },
  input: { borderColor: '#aaa', borderWidth: 1, borderRadius: 8, width: '100%', minHeight: 60, marginBottom: 20, padding: 8, textAlign: 'center' },
  error: { color: 'red', marginBottom: 8 },
});

export default ImportWalletScreen;
