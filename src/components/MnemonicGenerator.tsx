'use client';

import React, { useEffect, useState } from 'react';
import * as bip39 from 'bip39';
import usePrivateKey from '@/hooks/usePrivateKey';
import useInput from '@/hooks/useInput';
import useCopyClipboard from '@/hooks/useCopyToClipboard';

const GENERATE = 1;
const VERIFY = 2;
const SAVE = 3;

const MnemonicGenerator = () => {
  const [step, setStep] = useState<1 | 2 | 3>(GENERATE);
  const [mnemonic, setMnemonic] = useState<string[]>([]);
  const [verification, setVerification] = useState<(string | null)[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, copy] = useCopyClipboard();
  const { setMnemonic: saveMnemonic } = usePrivateKey();
  const [password, setPassword] = useInput('');

  const generateMnemonic = () => {
    const newMnemonic = bip39.generateMnemonic();
    setMnemonic(newMnemonic.split(' '));
  };

  useEffect(() => {
    generateMnemonic();
  } , []);

  const startVerification = () => {
    const indexesToExclude = new Set();
    while (indexesToExclude.size < 4) {
      indexesToExclude.add(Math.floor(Math.random() * mnemonic.length));
    }
    setError(null);
    setVerification(mnemonic.map((v, index) => indexesToExclude.has(index) ? null : v));
    setStep(VERIFY);
  }

  const verify = () => {
    const verified = mnemonic.join(' ') === verification.join(' ');
    if (verified) {
      setStep(SAVE);
    } else {
      setError('Mnemonic does not match');
    }
  }

  const save = () => {
    saveMnemonic(mnemonic.join(' '), password);
  }

  if (step === GENERATE) {
    return (
      <div className='space-y-5'>
        <div className='grid grid-cols-3 gap-3'>
          {mnemonic.map((word, index) => (
            <input
              className='input'
              key={index}
              value={word}
              disabled
              placeholder={`Word ${index + 1}`}
            />
          ))}
        </div>
        <div className='grid grid-cols-3 gap-2'>
          <button className='btn' onClick={() => copy(mnemonic.join(' '))}>
            {isCopied ? 'Copied' : 'Copy'}
          </button>
          <button className='btn' onClick={generateMnemonic}>Generate</button>
          <button className='btn' disabled={mnemonic.length === 0} onClick={startVerification}>
            Next
          </button>
        </div>
      </div>
    );
  }

  if (step === VERIFY) {  
    return (
      <div className='space-y-5'>
        {error && <div className='text-red-500'>{error}</div>}
        
        <div className='grid grid-cols-3 gap-3'>
          {verification.map((v, index) => (
            <input
              className='input'
              key={index}
              value={v ?? ''}
              onChange={(event) => {
                const newMnemonic = [...verification];
                newMnemonic[index] = event.target.value;
                setVerification(newMnemonic);
              }}
              placeholder={`Word ${index + 1}`}
            />
          ))}
        </div>

        <div className='grid grid-cols-2 gap-2'>
          <button className='btn' onClick={() => setStep(GENERATE)}>Back</button>
          <button className='btn' onClick={verify}>
            Verify
          </button>
        </div>
      </div>
    );
  }

  if (step === SAVE) {
    return (
      <div className='space-y-5'>
        <div className='flex gap-3'>
          <input className='input flex-grow' placeholder='Password' type='password' onChange={setPassword} value={password} />
          <button className='btn' onClick={save}>
            Save
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default MnemonicGenerator;