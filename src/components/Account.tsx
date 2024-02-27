import assert from 'assert';
import { useForm, SubmitHandler } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bytesToHex, bigIntToUnpaddedBytes, hexToBytes, unpadBytes, toBytes, ecsign, privateToAddress } from '@ethereumjs/util'
import { RLP } from '@ethereumjs/rlp';
import { keccak256 } from 'ethereum-cryptography/keccak.js';
import React, { useState } from 'react';

import { RPCDefinition } from '@/networks';
import useAccounts from '@/hooks/useAccounts';
import useNetworks from '@/hooks/useNetwork';
import usePrivateSeed from '@/hooks/usePrivateSeed';
import {
  estimateGasPrice,
  fetchAccountBalance,
  fetchAccountNonce,
  sendRawTransaction,
  waitForTransactionToBeMined
} from '@/rpc';


type LegacyTransactionOptions = {
  nonce?: bigint;
  gasLimit?: bigint;
  gasPrice?: bigint;
  to: `0x${string}`;
  value: bigint;
  data?: `0x${string}`;
}

type FormInputs = LegacyTransactionOptions;

async function createRawLegacyTransaction(privKey: string, opts: LegacyTransactionOptions, network: RPCDefinition): Promise<`0x${string}`> {
  const gasPrice = opts.gasPrice || BigInt(await estimateGasPrice(network.rpcUrl));
  const privateKey = Buffer.from(privKey, 'hex'); 
  const fromAddress = bytesToHex(privateToAddress(privateKey));
  const gasLimit = opts.gasLimit || 21000n;
  
  const nonce = opts.nonce || BigInt(await fetchAccountNonce(fromAddress, network.rpcUrl));
  const data = opts.data || '0x0';
  const chainId = BigInt(network.chainId); // Convert network.chainId to a bigint

  const rawLegacyManualFields = [
    bigIntToUnpaddedBytes(nonce), // nonce
    bigIntToUnpaddedBytes(gasPrice), // gasPrice
    bigIntToUnpaddedBytes(gasLimit), // gasLimit
    hexToBytes(opts.to), // to address
    bigIntToUnpaddedBytes(opts.value), // value (wei)
    hexToBytes(data), // data
    bigIntToUnpaddedBytes(chainId), // chainId
    unpadBytes(toBytes(0)), //  signature.v
    unpadBytes(toBytes(0)), //  signature.r
  ];

  // Serialize the manual transaction fields and sign the transaction
  const serializedManualMessage = RLP.encode(rawLegacyManualFields);
  const manualHashedMessage = keccak256(serializedManualMessage);
  const manualSignature = ecsign(manualHashedMessage, privateKey, chainId);

  // Assign the signature to the raw transaction
  rawLegacyManualFields[6] = bigIntToUnpaddedBytes(manualSignature.v);
  rawLegacyManualFields[7] = manualSignature.r;
  rawLegacyManualFields[8] = manualSignature.s;

  return bytesToHex(RLP.encode(rawLegacyManualFields)) as `0x${string}`;
}

const Account: React.FC = () => {
  const [account] = useAccounts();
  const { selectedNetwork } = useNetworks();
  const { derivePrivateKey } = usePrivateSeed();
  const queryClient = useQueryClient();
  const [isMining, setIsMining] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const balancesQuery = useQuery({
    queryKey: ['balances', account?.address, selectedNetwork?.rpcUrl],
    queryFn: () => fetchAccountBalance(account!.address, selectedNetwork!.rpcUrl),
    staleTime: 15000, // 15 seconds
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const sendTransaction = useMutation({
    mutationKey: ['sendTransaction', account?.address, selectedNetwork?.rpcUrl],
    mutationFn: async (inputs: FormInputs) => {
      const privateKey = derivePrivateKey(account.index);
      assert(privateKey, 'Private key not found');

      const rawTx = await createRawLegacyTransaction(privateKey, {
        nonce: BigInt(await fetchAccountNonce(account!.address, selectedNetwork!.rpcUrl)),
        gasLimit: 21000n,
        to: inputs.to,
        value: inputs.value,
        data: '0x',
      }, selectedNetwork!);
      
      return sendRawTransaction(rawTx, selectedNetwork!.rpcUrl);
    },
    onSuccess: async (txHash: string) => {
      // Wait for the transaction to be mined
      setIsMining(true);
      await waitForTransactionToBeMined(txHash, selectedNetwork!.rpcUrl)
        .finally(() => setIsMining(false));

      queryClient.invalidateQueries({ queryKey: ['balances', account?.address, selectedNetwork?.rpcUrl] });
      queryClient.invalidateQueries({ queryKey: ['transactions', account?.address, selectedNetwork?.rpcUrl] });
    }
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    sendTransaction.mutate(data);
  }

  return (
    <div className='p-2.5  shadow-lg'>
      <div className="m-5 p-5 dark:bg-gray-900/50 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{selectedNetwork?.nickname}</h2>
        <div>
          <h2 className="text-xl mt-3 text-gray-900 dark:text-gray-100">Account</h2>
          <p className="text-gray-700 dark:text-gray-300">{account?.address}</p>
          {balancesQuery.isLoading && <div className="text-blue-500">Loading Balances...</div>}
          {balancesQuery.isError && <div className="text-red-500">Error: {balancesQuery.error.message}</div>}
        
          {balancesQuery.isSuccess && (
            <p className="text-green-500 dark:text-green-300">Balance: {balancesQuery.data.toString()}</p>
          )}
        </div>
        <div>
          <h2 className="text-xl my-3 text-gray-900 dark:text-gray-100">Send Transaction</h2>
          {sendTransaction.isSuccess && ( 
            <p className="text-green-500 dark:text-green-300">Transaction sent: {sendTransaction.data}</p>  
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            {sendTransaction.isError && (<p className='text-red-500'>{sendTransaction.error.message}</p>)}
            
            <label className="inline-flex items-center cursor-pointer mb-5">
              <span className="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                Show advanced options
              </span>
              <input type="checkbox"
                checked={showAdvanced}
                onChange={() => setShowAdvanced((a) => !a)} className="sr-only peer" />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
            {showAdvanced && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 text-md font-bold mb-2" htmlFor="nonce">
                    Nonce
                  </label>
                  <input
                    className="input"
                    {...register('nonce')}
                    type="number"
                    disabled={sendTransaction.isPending}
                    placeholder="Enter nonce"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 text-md font-bold mb-2" htmlFor="gasPrice">
                    Gas Price (wei)
                  </label>
                  <input
                    className="input"
                    {...register('gasPrice')}
                    type="number"
                    disabled={sendTransaction.isPending}
                    placeholder="Enter gas price"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 text-md font-bold mb-2" htmlFor="gasLimit">
                    Gas Limit (wei)
                  </label>
                  <input
                    className="input"
                    {...register('gasLimit')}
                    type="number"
                    disabled={sendTransaction.isPending}
                    placeholder="Enter gas limit"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 text-md font-bold mb-2" htmlFor="data">
                    Data
                  </label>
                  <input
                    className="input"
                    {...register('data')}
                    type="text"
                    disabled={sendTransaction.isPending}
                    placeholder="Enter data"
                  />
                </div>
              </>
            )}
            
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-md font-bold mb-2" htmlFor="to">
                To <span className="text-red-500">*</span>
              </label>
              <input
                className="input"
                {...register('to', { required: true })}
                type="text"

                disabled={sendTransaction.isPending}
                placeholder="Enter recipient's address"
              />
              <p className='text-red-500'>{errors.to && 'Recipient address is required'}</p>
            </div>
            <div className="mb-6">
             <label className="block text-gray-700 dark:text-gray-300 text-md font-bold mb-2" htmlFor="amount">
                Amount <span className="text-red-500">*</span>
              </label>
              <input
                {...register('value', { required: true })}
                className="input"
                type="number"
                disabled={sendTransaction.isPending}
                placeholder="Enter amount in wei"
                required
              />
               <p className='text-red-500'>{errors.value && 'Value is required'}</p>
            </div>
            <div className="flex items-center justify-between">
              <button
                disabled={sendTransaction.isPending}
                className="btn"
                type="submit"
              >
                {isMining ? 'Waiting for tx to be mined...' : sendTransaction.isPending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Account;