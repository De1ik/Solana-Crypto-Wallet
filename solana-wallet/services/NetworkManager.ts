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
}
