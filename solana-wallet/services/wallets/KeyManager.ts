import 'react-native-get-random-values';
import { Buffer } from 'buffer';

if (typeof global !== 'undefined' && typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}

import * as SecureStore from 'expo-secure-store';
import { Keypair } from '@solana/web3.js';
import * as bip39 from 'bip39';

const MNEMONIC_KEY = 'WALLET_MNEMONIC';


export default class KeyManager {
  // Генерирует мнемоническую фразу (12 слов)
  static generateMnemonic(): string {
    return bip39.generateMnemonic(128); // 12 слов
  }

  // Сохраняет мнемонику
  static async saveMnemonic(mnemonic: string) {
    await SecureStore.setItemAsync(MNEMONIC_KEY, mnemonic);
  }

  // Получает мнемонику
  static async getMnemonic(): Promise<string | null> {
    return await SecureStore.getItemAsync(MNEMONIC_KEY);
  }

  // Удаляет мнемонику
  static async clearMnemonic() {
    await SecureStore.deleteItemAsync(MNEMONIC_KEY);
  }

  // Получает Keypair из мнемоники
  static async getKeypairFromMnemonic(mnemonic: string): Promise<Keypair> {
    const seed = await bip39.mnemonicToSeed(mnemonic); // Buffer
    // Берём только первые 32 байта (Solana специфика!)
    const derivedSeed = seed.slice(0, 32);
    return Keypair.fromSeed(Uint8Array.from(derivedSeed));
  }

  // Генерирует новую мнемонику, создает Keypair, возвращает данные
  static async generateNewWallet(): Promise<{ mnemonic: string; publicKey: string }> {
    try {
      console.log("Generating new wallet...");
      const mnemonic = this.generateMnemonic();
      console.log("Mnemonic generated:", mnemonic);
      const keypair = await this.getKeypairFromMnemonic(mnemonic);
      console.log("Keypair generated:", keypair.publicKey.toBase58());
      return { mnemonic, publicKey: keypair.publicKey.toBase58() };
    } catch (error) {
      console.log('ERROR IN generateNewWallet:', error);
      throw error;
    }
  }

  // Получает публичный ключ из мнемоники
  static async getPublicKeyFromMnemonic(mnemonic: string): Promise<string> {
    const keypair = await this.getKeypairFromMnemonic(mnemonic);
    return keypair.publicKey.toBase58();
  }
}
