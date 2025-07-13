import { ethers } from 'ethers';

// const ETHEREUM_SEPOLIA = 'https://rpc.sepolia.org';
// const ETHEREUM_SEPOLIA = 'https://rpc.ankr.com/eth_sepolia';
const ETHEREUM_SEPOLIA = 'https://sepolia.infura.io/v3/111f1dc7da1d4d30b5b7bd51ae752b85';

const sepolia_network = {
  name: 'sepolia',
  chainId: 11155111,
}

export class EthereumProvider {
  static provider = new ethers.providers.JsonRpcProvider(ETHEREUM_SEPOLIA, sepolia_network);

  static getWalletFromMnemonic(mnemonic: string) {
    return ethers.Wallet.fromMnemonic(mnemonic).connect(this.provider);
  }

  static async getAddressFromMnemonic(mnemonic: string): Promise<string> {
    const wallet = this.getWalletFromMnemonic(mnemonic);
    return wallet.address;
  }

  static async getBalance(address: string): Promise<number> {
  try {
    const bal = await this.provider.getBalance(address);
    return Number(ethers.utils.formatEther(bal));
  } catch (e) {
    console.log('ETH getBalance error:', e);
    throw e;
  }
}


  static async sendTransaction({ fromWallet, to, amount }: { fromWallet: ethers.Wallet, to: string, amount: number }): Promise<string> {
    const tx = await fromWallet.sendTransaction({
      to,
      value: ethers.utils.parseEther(amount.toString()),
    });
    return tx.hash;
  }
}
