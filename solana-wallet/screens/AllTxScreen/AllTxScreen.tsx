import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View, Text, ActivityIndicator, FlatList, Button, StyleSheet, RefreshControl, TouchableOpacity,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList, ChainType } from '../../types';
import { NetworkManager } from '../../services/NetworkManager';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type AllTxRouteProp = RouteProp<RootStackParamList, 'AllTx'>;

const PAGE_SIZE = 20;

const AllTxScreen = () => {
  const route = useRoute<AllTxRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { chain, address } = route.params;

  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1); // Только для Ethereum
  const [hasMore, setHasMore] = useState(true);
  const [lastSig, setLastSig] = useState<string | undefined>(undefined); // Только для Solana
  const [error, setError] = useState<string | null>(null);

  // Для избежания двойного fetch-а при onEndReached
  const onEndReachedCalledDuringMomentum = useRef(false);

  // === Получение транзакций ===
  const fetchTransactions = useCallback(async (reset = false) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
        let newTxs: any[] = [];
        if (chain === 'solana') {
            const sig = reset ? undefined : lastSig;
            // address, limit, before
            newTxs = await NetworkManager.getTransactionsPaginated(address, chain, PAGE_SIZE, sig);
            if (reset) setTransactions(newTxs);
            else setTransactions(prev => [...prev, ...newTxs]);
            setHasMore(newTxs.length === PAGE_SIZE);
            if (newTxs.length > 0) setLastSig(newTxs[newTxs.length - 1].signature);
        } else if (chain === 'ethereum') {
            const currentPage = reset ? 1 : page;
            // address, page, limit
            newTxs = await NetworkManager.getTransactionsPaginated(address, chain, currentPage, PAGE_SIZE);
            if (reset) setTransactions(newTxs);
            else setTransactions(prev => [...prev, ...newTxs]);
            setHasMore(newTxs.length === PAGE_SIZE);
            setPage(currentPage + 1);
        }

    } catch (e: any) {
      setError(e?.message || 'Failed to load transactions');
    }
    setLoading(false);
    setRefreshing(false);
  }, [loading, address, chain, page, lastSig]);

  // === Первичная загрузка и сброс ===
  useEffect(() => {
    setPage(1);
    setLastSig(undefined);
    setHasMore(true);
    setTransactions([]);
    fetchTransactions(true);
  }, [address, chain]);

  // === Обработка onEndReached ===
  const handleEndReached = () => {
    if (!loading && hasMore && !onEndReachedCalledDuringMomentum.current) {
      fetchTransactions();
      onEndReachedCalledDuringMomentum.current = true;
    }
  };

  // === Обработка Pull-to-Refresh ===
  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setLastSig(undefined);
    setHasMore(true);
    await fetchTransactions(true);
  };

  // === Рендер одной транзакции ===
  const renderTx = ({ item: tx }: { item: any }) => (
    <TouchableOpacity
      style={styles.txBox}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('TxDetails', { tx, chain })}
    >
      <Text numberOfLines={1} style={styles.txSig}>Tx: {tx.signature || tx.hash}</Text>
      <Text>
        Date: {tx.blockTime
          ? new Date(tx.blockTime * 1000).toLocaleString()
          : (tx.timeStamp
            ? new Date(Number(tx.timeStamp) * 1000).toLocaleString()
            : '-')}
      </Text>
      <Text>Status: {tx.status || tx.err ? 'failed' : 'confirmed'}</Text>
      <Text style={styles.detailsLink}>View details →</Text>
    </TouchableOpacity>
  );

  // === Рендер заглушки/ошибки ===
  const renderEmpty = () => {
    if (loading) return null;
    if (error) return <Text style={styles.error}>{error}</Text>;
    return <Text style={styles.empty}>No transactions found.</Text>;
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={transactions}
        keyExtractor={item => item.signature || item.hash}
        renderItem={renderTx}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        ListFooterComponent={loading && !refreshing ? <ActivityIndicator style={{ margin: 24 }} /> : null}
        ListEmptyComponent={renderEmpty()}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onMomentumScrollBegin={() => { onEndReachedCalledDuringMomentum.current = false; }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  txBox: { padding: 12, borderRadius: 10, backgroundColor: '#eee', marginBottom: 10 },
  txSig: { fontSize: 13, color: '#333' },
  detailsLink: { color: '#007bff', marginTop: 8, fontWeight: 'bold' },
  error: { color: 'red', textAlign: 'center', marginTop: 30, fontSize: 16 },
  empty: { textAlign: 'center', marginTop: 40, color: '#888', fontSize: 16 },
});

export default AllTxScreen;
