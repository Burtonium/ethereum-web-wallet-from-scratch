'use client';

import usePrivateKey from '@/hooks/usePrivateSeed';
import React, { useState } from 'react';
import useInput from '@/hooks/useInput';  
import MnemonicGenerator from './MnemonicGenerator';
import MnemonicImport from './MnemonicImporter';

const LoginComponent: React.FC = () => {
  const { hasAccount, unlock } = usePrivateKey();
  const [password, setPassword] = useInput('');
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'generate' | 'import' | 'initial'>('initial');

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setError(null);
      unlock(password);
    } catch (e: unknown) {   
      setError('Invalid password');
    }
  }

  return (
    <div className='max-w-md mx-auto text-center my-10 flex flex-col gap-5'>
      {hasAccount ? (
        <>
          <form className='flex gap-3' onSubmit={onSubmit}>
            <input placeholder='Password' className='input flex-grow' onChange={setPassword} type="password" name="password" />
            <button className='btn' type="submit">
              Unlock
            </button>
          </form>
          {error && <div className='text-red-500'>{error}</div>}
        </>
      ) : (
        <>
          {mode === 'initial' && (
            <>
              <button className='btn' onClick={() => setMode('generate')}>
                Generate
              </button>
              <button className='btn' onClick={() => setMode('import')}>
                Import
              </button>
            </>
          )}

          {mode !== 'initial' && (
            <button className='btn' onClick={() => setMode('initial')}>
              Back
            </button>
           )}
          
          {mode === 'generate' && (
            <MnemonicGenerator />
          )}

          {mode === 'import' && (
            <MnemonicImport />
          )}
        </>
      )}
    </div>
  );
};

export default LoginComponent;