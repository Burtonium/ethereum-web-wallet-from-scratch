import React, { type ClipboardEvent, useState } from 'react';
import * as bip39 from 'bip39';
import usePrivateKey from '@/hooks/usePrivateKey';
import useInput from '@/hooks/useInput';

const MnemonicImport = () => {
  const { setMnemonic: saveMnemonic, unlock } = usePrivateKey();
  const [mnemonic, setMnemonic] = useState<string[]>(Array(12).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useInput('');

  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData('text');
    const words = pastedData.split(' ').slice(0, 12);
    if (words.length === 12) {
      setMnemonic(words);
    }
  };

  const importMnemonic = () => {
    const valid = bip39.validateMnemonic(mnemonic.join(' '));
    if (!valid) {
      setError('Invalid mnemonic');
    } else {
      setError(null);
    }

    saveMnemonic(mnemonic.join(' '), password);
    unlock(password);
  };

  return (
    <>
      {error && <div className='text-red-500'>{error}</div>}
      <div className='grid grid-cols-3 gap-3'>
        {mnemonic.map((word, index) => (
          <input
            onPaste={handlePaste}
            className='input'
            key={index}
            value={word}
            onChange={(event) => {
              const newMnemonic = [...mnemonic];
              newMnemonic[index] = event.target.value;
              setMnemonic(newMnemonic);
            }}
            placeholder={`Word ${index + 1}`}
          />
        ))}
      </div>
      <div className='flex gap-3'>
        <input className='input flex-grow' placeholder='Password' type='password' onChange={setPassword} value={password} />
        <button className='btn' onClick={importMnemonic}>
          Import
        </button>
      </div>
    </>
  );
};

export default MnemonicImport;