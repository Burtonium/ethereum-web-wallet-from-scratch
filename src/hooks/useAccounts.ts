import { useCallback } from 'react';

import usePrivateSeed from './usePrivateSeed';
import { useLocalStorage } from 'usehooks-ts';
import { ACCOUNTS_STORAGE_KEY } from '@/constants';
import useNetworks from './useNetwork';
import assert from 'assert';

const useAccounts = (): [
  ReturnType<typeof deriveAccount>,
  {
    selectAccount: (index: number) => void,
    generateAccount: () => ReturnType<typeof deriveAccount>,
  }
] => {
  const { selectedNetwork } = useNetworks();
  const { unlocked, deriveAccount } = usePrivateSeed();
  
  const [selectedAccountIndex, setSelectedAccountIndex] = useLocalStorage(`${ACCOUNTS_STORAGE_KEY}_index`, 0);
  const [accounts, setAccounts] = useLocalStorage(`${ACCOUNTS_STORAGE_KEY}_${selectedNetwork?.chainId}`, unlocked ? [deriveAccount(0)] : [])

  const selectAccount = useCallback((index: number) => {
    assert(index < accounts.length, 'Account index out of bounds');
    setSelectedAccountIndex(index);
  }, [accounts.length, setSelectedAccountIndex]);

  const generateAccount = useCallback(() => {
    const account = deriveAccount(accounts.length);
    setAccounts([...accounts, account]);
    return account;
  }, [accounts, deriveAccount, setAccounts]);

  return [
    accounts[selectedAccountIndex],
    { selectAccount, generateAccount }
  ];
};

export default useAccounts;