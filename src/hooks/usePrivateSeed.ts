import { useCallback } from 'react';
import CryptoJS from 'crypto-js';
import { useLocalStorage, useSessionStorage } from 'usehooks-ts';
import { ENCRYPTED_MNEMONIC_STORAGE, PRIVATE_SEED_STORAGE } from '@/constants';
import * as bip39 from 'bip39';
import * as ecc from 'tiny-secp256k1';

import BIP32Factory from 'bip32';
const bip32 = BIP32Factory(ecc);

import assert from 'assert';

function usePrivateSeed() {
  const [encryptedMnemonic, setEncryptedMnemonic] = useLocalStorage<null|string>(ENCRYPTED_MNEMONIC_STORAGE, null);
  const [privateSeed, setPrivateSeed] = useSessionStorage<null|string>(PRIVATE_SEED_STORAGE, null);

  const setMnemonic = useCallback((value: string, password: string) => {
    assert(bip39.validateMnemonic(value), 'Invalid mnemonic');
    const encrypted = CryptoJS.AES.encrypt(value, password).toString();
    setEncryptedMnemonic(encrypted);
    setPrivateSeed(bip39.mnemonicToSeedSync(value).toString('hex'));
  }, [setEncryptedMnemonic, setPrivateSeed]);

  const unlock = useCallback((password: string) => {
    assert(encryptedMnemonic, 'Private key is not set');
    const mnemonic = CryptoJS.AES.decrypt(encryptedMnemonic, password).toString(CryptoJS.enc.Utf8);
    assert(bip39.validateMnemonic(mnemonic), 'Invalid password');
    setPrivateSeed(bip39.mnemonicToSeedSync(mnemonic).toString('hex'));
  }, [encryptedMnemonic, setPrivateSeed]);

  const forget = useCallback(() => {
    setEncryptedMnemonic(null);
    setPrivateSeed(null);
  }, [setEncryptedMnemonic, setPrivateSeed]);

  const deriveAccount = useCallback((index: number) => {
    assert(privateSeed, 'Private seed is not set');
    const seedBuffer = Buffer.from(privateSeed, 'hex');
    const master = bip32.fromSeed(seedBuffer);
    const account = master.derivePath(`m/44'/60'/0'/0/${index}`);
    const publicKey = account.publicKey;
    const publicKeyHash = CryptoJS.SHA256(CryptoJS.enc.Hex.parse(publicKey.toString('hex'))).toString();
    const address = `0x${publicKeyHash.substring(publicKeyHash.length - 40)}`;
    return { index, address };
  }, [privateSeed]);

  return {
    hasAccount: encryptedMnemonic !== null,
    unlocked: privateSeed !== null,
    privateSeed,
    deriveAccount,
    setMnemonic,
    forget,
    unlock
  };
}

export default usePrivateSeed;