export type ChainType = 'solana' | 'ethereum';

export type RootStackParamList = {
  Wallet: undefined;
  Send: { chain: ChainType };
  ImportWallet: undefined;
  CreateWallet: undefined;
  TxDetails: { tx: any; chain: ChainType };
  AllTx: { chain: ChainType; address: string };
  ReceiveByCode: { chain: ChainType; address: string };
  SendByCode: undefined;
};
