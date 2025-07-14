import React from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

type TxDetailsRouteProp = RouteProp<RootStackParamList, 'TxDetails'>;

const explorerUrls = {
  solana: (sig: string) => `https://explorer.solana.com/tx/${sig}?cluster=devnet`,
  ethereum: (hash: string) => `https://sepolia.etherscan.io/tx/${hash}`,
};

const TxDetailsScreen = () => {
  const route = useRoute<TxDetailsRouteProp>();
  const { tx, chain } = route.params;

  return (
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Transaction Details</Text>
      {chain === 'solana' ? (
        <>
          <Text>Signature: {tx.signature}</Text>
          <Text>Slot: {tx.slot}</Text>
          <Text>Status: {tx.status}</Text>
          <Text>Date: {tx.blockTime ? new Date(tx.blockTime * 1000).toLocaleString() : '-'}</Text>
        </>
      ) : (
        <>
          <Text>Hash: {tx.hash}</Text>
          <Text>Block: {tx.blockNumber}</Text>
          <Text>Status: {tx.status}</Text>
          <Text>From: {tx.from}</Text>
          <Text>To: {tx.to}</Text>
          <Text>Value: {tx.value} ETH</Text>
          <Text>Date: {tx.timeStamp ? new Date(Number(tx.timeStamp) * 1000).toLocaleString() : '-'}</Text>
          <Text>Gas Used: {tx.gasUsed}</Text>
          <Text>Gas Price: {tx.gasPrice}</Text>
        </>
      )}
      <Button
        title="View in Explorer"
        onPress={() => {
          const url = chain === 'solana'
            ? explorerUrls.solana(tx.signature)
            : explorerUrls.ethereum(tx.hash);
          import('expo-linking').then(Linking => Linking.openURL(url));
        }}
      />
    </ScrollView>
  );
};

export default TxDetailsScreen;
