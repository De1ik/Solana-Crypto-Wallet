import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { KeyManager } from '../../services/KeyManager';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

const CreateWalletScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [mnemonic, setMnemonic] = useState<string | null>(null);

  const handleCreate = async () => {
    const mnemonic = KeyManager.generateMnemonic();
    await KeyManager.saveMnemonic(mnemonic);
    setMnemonic(mnemonic);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create new wallet</Text>
      {mnemonic ? (
        <>
          <Text style={styles.label}>Save your 12-word phrase:</Text>
          <Text selectable style={styles.mnemonic}>{mnemonic}</Text>
          <Button title="Go to Wallet" onPress={() => navigation.navigate('Wallet')} />
        </>
      ) : (
        <Button title="Create wallet" onPress={handleCreate} />
      )}
      <Button title="Import wallet" onPress={() => navigation.navigate('ImportWallet')} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 20, marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 10 },
  mnemonic: { fontSize: 16, color: 'purple', textAlign: 'center', fontWeight: 'bold', marginBottom: 20 },
});

export default CreateWalletScreen;
