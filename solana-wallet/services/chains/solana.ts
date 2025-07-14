import { 
  Connection, 
  PublicKey, 
  LAMPORTS_PER_SOL, 
  Transaction, 
  SystemProgram, 
  Keypair,
  clusterApiUrl
} from '@solana/web3.js';

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

    static async getTransactions(address: string, limit = 10) {
    const pubkey = new PublicKey(address);
    const sigs = await this.connection.getSignaturesForAddress(pubkey, { limit });
    // Можно получить детали транзакции, если нужно
    // const details = await Promise.all(sigs.map(sig => this.connection.getTransaction(sig.signature)));
    return sigs.map(sig => ({
      signature: sig.signature,
      blockTime: sig.blockTime,
      status: sig.confirmationStatus,
      slot: sig.slot,
      // можно добавить explorer ссылку
    }));
  }

  static async getTransactionsPaginated(
    address: string,
    limit: number = 20,
    before?: string // подпись последней транзакции с предыдущей порции
  ) {
    const connection = new Connection(clusterApiUrl('devnet')); // или твоя сеть
    const pubkey = new PublicKey(address);
    const opts: any = { limit };
    if (before) opts.before = before;

    // Получаем подписи (signatures)
    const signatures = await connection.getSignaturesForAddress(pubkey, opts);

    // Получаем детали по этим подписям (можно оптимизировать, грузить детали только по необходимости)
    // let txDetails = await Promise.all(signatures.map(sig => connection.getTransaction(sig.signature)));

    return signatures; // [{signature, blockTime, ...}, ...]
  }
}
