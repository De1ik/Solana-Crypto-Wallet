import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram, Keypair } from '@solana/web3.js';

const SOLANA_DEVNET = 'https://api.devnet.solana.com';
// const SOLANA_TESTNET = 'https://api.testnet.solana.com';

export class SolanaProvider {
  static connection = new Connection(SOLANA_DEVNET);

  static async getAddressFromKeypair(keypair: Keypair) {
    return keypair.publicKey.toBase58();
  }

  static async getBalance(address: string): Promise<number> {
    const publicKey = new PublicKey(address);
    const lamports = await this.connection.getBalance(publicKey);
    return lamports / LAMPORTS_PER_SOL;
  }

  static async sendTransaction({ fromKeypair, to, amount }: { fromKeypair: Keypair, to: string, amount: number }): Promise<string> {
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: new PublicKey(to),
        lamports: Math.floor(amount * LAMPORTS_PER_SOL),
      })
    );
    const signature = await this.connection.sendTransaction(tx, [fromKeypair]);
    await this.connection.confirmTransaction(signature, 'confirmed');
    return signature;
  }
}
