import { ethers } from 'ethers';

// const ETHEREUM_SEPOLIA = 'https://rpc.sepolia.org';
// const ETHEREUM_SEPOLIA = 'https://rpc.ankr.com/eth_sepolia';
const ETHEREUM_SEPOLIA = 'https://sepolia.infura.io/v3/111f1dc7da1d4d30b5b7bd51ae752b85';
const ETHERSCAN_API_KEY = 'UKHXS4JYVAY4XGGZHF2DMY3Z95QJTGC3EG';

const sepolia_network = {
  name: 'sepolia',
  chainId: 11155111,
}

type EtherscanTx = {
  hash: string;
  blockNumber: string;
  from: string;
  to: string;
  value: string;
  isError: string;
  timeStamp: string;
  gasUsed: string;
  gasPrice: string;
  // можно добавить другие поля, если они нужны
};

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

  static async sendTransaction({ fromWallet, to, amount }: { fromWallet: ethers.Wallet, to: string, amount: string }): Promise<string> {
    const tx = await fromWallet.sendTransaction({
      to,
      value: ethers.utils.parseEther(amount),
    });
    return tx.hash;
  }

  static async getTransactionsPaginated(address: string, page: number, offset: number = 20): Promise<EtherscanTx[]> {
    const prodEthUrl = 'https://api.etherscan.io/api';
    const testEthUrl = 'https://api-sepolia.etherscan.io/api';
    const url = `${testEthUrl}?module=account&action=txlist&address=${address}&sort=desc&page=${page}&offset=${offset}&apikey=${ETHERSCAN_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.status !== "1" || !Array.isArray(data.result)) return [];
    return data.result as EtherscanTx[];
  }
}

