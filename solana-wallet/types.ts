export type ChainType = 'solana' | 'ethereum';

export type RootStackParamList = {
  Wallet: undefined;
  Send: { chain: ChainType };
  ImportWallet: undefined;
  CreateWallet: undefined;
};
