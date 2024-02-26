import { useMemo } from 'react';

import usePrivateSeed from './usePrivateSeed';


const useAccount = () => {
  const { unlocked, deriveAccount } = usePrivateSeed(); 

  const account = useMemo(() => unlocked ? deriveAccount(0) : null, [deriveAccount, unlocked]);
  
  return account;
};

export default useAccount;