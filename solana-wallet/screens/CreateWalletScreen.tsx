import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import KeyManager from '../services/KeyManager';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

const CreateWalletScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [mnemonic, setMnemonic] = useState<string | null>(null);


  const createWallet = async () => {
    const { mnemonic, publicKey } = await KeyManager.generateNewWallet();
    await KeyManager.saveMnemonic(mnemonic);
    setPublicKey(publicKey);
    setMnemonic(mnemonic);
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      {mnemonic && publicKey ? (
        <>
          <Text style={styles.title}>Important! Save these 12 words:</Text>
          <Text selectable style={styles.mnemonic}>{mnemonic}</Text>
          <Text style={styles.info}>Without this phrase you will not be able to recover your wallet!</Text>
          <Text style={styles.title}>Your solana address:</Text>
          <Text selectable style={styles.address}>{publicKey}</Text>
        </>
      ) : (
          <>
          <Button title="Create wallet" onPress={createWallet} />
          <Button title="Import existing wallet" onPress={() => navigation.navigate('ImportWallet')} />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 18, marginTop: 24, textAlign: 'center' },
  mnemonic: { fontSize: 16, marginTop: 8, color: 'purple', textAlign: 'center', fontWeight: 'bold' },
  address: { fontSize: 16, color: 'blue', marginTop: 8, textAlign: 'center' },
  info: { marginTop: 8, color: 'red', textAlign: 'center', fontWeight: 'bold' },
});

export default CreateWalletScreen;
