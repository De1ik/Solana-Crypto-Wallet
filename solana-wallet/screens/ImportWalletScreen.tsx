import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import KeyManager from '../services/KeyManager';

const ImportWalletScreen = () => {
  const [mnemonic, setMnemonic] = useState('');
  const [publicKey, setPublicKey] = useState<string | null>(null);

  const importWallet = async () => {
    try {
      if (!mnemonic || mnemonic.trim().split(' ').length !== 12) {
        Alert.alert('Error', 'Enter a valid 12-word mnemonic.');
        return;
      }
      const keypair = await KeyManager.getKeypairFromMnemonic(mnemonic.trim());
      await KeyManager.saveMnemonic(mnemonic.trim());
      setPublicKey(keypair.publicKey.toBase58());
    } catch (e) {
      Alert.alert('Error', 'Invalid mnemonic.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Import wallet from 12-word phrase:</Text>
        <TextInput
          style={styles.input}
          value={mnemonic}
          onChangeText={setMnemonic}
          placeholder="Enter 12 words separated by spaces"
          multiline
        />
        <Button title="Import" onPress={importWallet} />
        {publicKey && (
          <>
            <Text style={styles.title}>Your solana address:</Text>
            <Text style={styles.address}>{publicKey}</Text>
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 18, marginBottom: 16, textAlign: 'center' },
  input: { borderColor: '#aaa', borderWidth: 1, width: '100%', minHeight: 60, marginBottom: 20, padding: 8, borderRadius: 8, textAlign: 'center' },
  address: { fontSize: 16, color: 'blue', marginTop: 12, textAlign: 'center' },
});

export default ImportWalletScreen;
