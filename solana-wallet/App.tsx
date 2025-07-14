import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WalletScreen from './screens/WalletScreen/WalletScreen';
import SendScreen from './screens/SendScreen/SendScreen';
import ImportWalletScreen from './screens/ImportWalletScreen/ImportWalletScreen';
import CreateWalletScreen from './screens/CreateWalletScreen/CreateWalletScreen';
import AllTxScreen from './screens/AllTxScreen/AllTxScreen';
import TxDetailsScreen from './screens/TxDetailsScreen/TxDetailsScreen';
import { RootStackParamList } from './types';

import { ThemeProvider } from './theme/ThemeProvider';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="CreateWallet">
          <Stack.Screen name="CreateWallet" component={CreateWalletScreen} options={{ title: 'Create Wallet' }} />
          <Stack.Screen name="ImportWallet" component={ImportWalletScreen} options={{ title: 'Import Wallet' }} />
          <Stack.Screen name="Wallet" component={WalletScreen} options={{ title: 'Wallet' }} />
          <Stack.Screen name="Send" component={SendScreen} options={{ title: 'Send' }} />
          <Stack.Screen name="AllTx" component={AllTxScreen} />
          <Stack.Screen name="TxDetails" component={TxDetailsScreen} options={{ title: 'Transaction Details' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
