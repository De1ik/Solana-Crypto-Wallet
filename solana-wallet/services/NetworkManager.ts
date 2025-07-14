import { SolanaProvider } from './chains/solana';
import { EthereumProvider } from './chains/ethereum';
import { ChainType } from '../types';

export class NetworkManager {
  static activeChain: ChainType = 'solana';

  static setActiveChain(chain: ChainType) {
    this.activeChain = chain;
  }

  static getProvider(chain: 'solana'): typeof SolanaProvider;
  static getProvider(chain: 'ethereum'): typeof EthereumProvider;
  static getProvider(chain?: ChainType): typeof SolanaProvider | typeof EthereumProvider {
    switch (chain || this.activeChain) {
      case 'solana':
        return SolanaProvider;
      case 'ethereum':
        return EthereumProvider;
      default:
        return SolanaProvider;
    }
  }

  static async getTransactionsPaginated(
    address: string,
    chain: ChainType,
    param1: number,                // Ethereum: page, Solana: limit
    param2?: number | string      // Ethereum: limit, Solana: before
  ) {
    if (chain === 'solana') {
      return SolanaProvider.getTransactionsPaginated(address, param1, param2 as (string | undefined));
    } else if (chain === 'ethereum') {
      return EthereumProvider.getTransactionsPaginated(address, param1, param2 as number);
    }
    return [];
  }
}
