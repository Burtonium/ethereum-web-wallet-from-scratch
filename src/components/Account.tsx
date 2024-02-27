/* eslint-disable @typescript-eslint/no-explicit-any */
import useAccounts from '@/hooks/useAccounts';
import useNetworks from '@/hooks/useNetwork';
import usePrivateSeed from '@/hooks/usePrivateSeed';
import { RPCDefinition } from '@/networks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, SubmitHandler } from "react-hook-form"
import { FeeMarketEIP1559Transaction as TX } from '@ethereumjs/tx';
import { bytesToHex } from '@ethereumjs/util'

import React, { useState } from 'react';

async function fetchAccountBalance(accountAddress: string, nodeUrl: string): Promise<bigint> {
  const response = await fetch(nodeUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getBalance',
      params: [accountAddress, 'latest'],
      id: 1,
    }),
  });

  const data = await response.json();
  if (data.error) {
    console.log(data.error.message)
    throw new Error(data.error.message);
  }

  return BigInt(data.result);
}

type Transaction = {
  nonce: string;
  maxPriorityFeePerGas: string;
  maxFeePerGas: string;
  gasLimit: string;
  to: string;
  value: string;
  data: string;
}

type FormInputs = Pick<Transaction, 'to' | 'value'>;

async function fetchAccountNonce(accountAddress: string, nodeUrl: string): Promise<string> {
  const response = await fetch(nodeUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getTransactionCount',
      params: [accountAddress, 'latest'],
      id: 1,
    }),
  });
  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.result;
}

async function sendRawTransaction(privateKey: string, tx: Transaction, network: RPCDefinition): Promise<string> {
  const trx = TX.fromTxData({
    ...tx,
    chainId: network.chainId,
  });


  const signed = trx.sign(Buffer.from(privateKey, 'hex'));

  const response = await fetch(network.rpcUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_sendRawTransaction',
      params: [bytesToHex(signed.serialize())],
      id: 1,
    }),
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message);
  }

  // Return the transaction hash
  return data.result;
}

async function getTransactionReceipt(txHash: string, nodeUrl: string): Promise<any> {
  const response = await fetch(nodeUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getTransactionReceipt',
      params: [txHash],
      id: 1,
    }),
  });
  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.result;
}

const waitForTransactionToBeMined = async (txHash: string, rpcUrl: string) => {
  let retries = 0;
  let receipt = await getTransactionReceipt(txHash, rpcUrl);
  console.log('RECEIPT?', receipt);
  while ((receipt == null || receipt?.status !== 'mined') && retries < 10) {
    retries++;
    receipt = await getTransactionReceipt(txHash, rpcUrl);
    if (receipt && receipt.status === 'mined') {
      break;
    }
    // Wait for a while before polling again
    await new Promise(resolve => setTimeout(resolve, 2500));
  }
}

const Account: React.FC = () => {
  const [account] = useAccounts();
  const { selectedNetwork } = useNetworks();
  const { derivePrivateKey } = usePrivateSeed();
  const queryClient = useQueryClient();
  const [isMining, setIsMining] = useState(false);

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
    mutationFn: async (tx: FormInputs) => sendRawTransaction(
      derivePrivateKey(0)!,
      {
        ...tx,
        value: '0x' + BigInt(tx.value).toString(16),
        nonce: await fetchAccountNonce(account!.address, selectedNetwork!.rpcUrl),
        maxFeePerGas: '0xBA43B7400', // 50 Gwei
        maxPriorityFeePerGas: '0x59682F00', // 1.5 Gwei
        gasLimit: '0x6208', 
        data: '0x',
      },
      selectedNetwork!
    ),
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
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-md font-bold mb-2" htmlFor="to">
                To
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
                Amount
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