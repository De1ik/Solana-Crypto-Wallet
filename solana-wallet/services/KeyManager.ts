import 'react-native-get-random-values';
import { Buffer } from 'buffer';
if (typeof global !== 'undefined' && typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}

import * as SecureStore from 'expo-secure-store';
import * as bip39 from 'bip39';
import { Keypair } from '@solana/web3.js';

const MNEMONIC_KEY = 'WALLET_MNEMONIC';

export class KeyManager {
  // Генерирует мнемонику (12 слов)
  static generateMnemonic(): string {
    return bip39.generateMnemonic(128);
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

  // Для Solana — получает Keypair из мнемоники
  static async getSolanaKeypairFromMnemonic(mnemonic: string): Promise<Keypair> {
    const seed = await bip39.mnemonicToSeed(mnemonic); // Buffer
    const derivedSeed = seed.slice(0, 32);
    return Keypair.fromSeed(Uint8Array.from(derivedSeed));
  }
}
