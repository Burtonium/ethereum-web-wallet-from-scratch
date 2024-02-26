/* eslint-disable @typescript-eslint/no-explicit-any */
import useAccount from '@/hooks/useAccount';
import useNetworks from '@/hooks/useNetwork';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

async function fetchAccountBalance(accountAddress: string, nodeUrl: string): Promise<string> {
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

  // Convert the result from Wei to Ether
  const balanceInWei = data.result ? BigInt(data.result) : BigInt(0);
  const balanceInEther = balanceInWei / BigInt(1e18);

  return balanceInEther.toString();
}

async function fetchTransactions(accountAddress: string, nodeUrl: string): Promise<any[]> {
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
    console.log(data.error.message)
    throw new Error(data.error.message);
  }

  const transactionCount = parseInt(data.result, 16);
  const transactions = [];

  for (let i = 0; i < transactionCount; i++) {
    const transactionResponse = await fetch(nodeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getTransactionByHash',
        params: [accountAddress, i],
        id: 1,
      }),
    });

    const transactionData = await transactionResponse.json();
    if (transactionData.error) {
      console.log(transactionData.error.message)
      throw new Error(transactionData.error.message);
    }

    transactions.push(transactionData.result);
  }

  return transactions;
}

const Balances: React.FC = () => {
  const account = useAccount();
  const { selectedNetwork } = useNetworks();
  const balancesQuery = useQuery({
    queryKey: ['balances', account?.address, selectedNetwork?.rpcUrl],
    queryFn: () => fetchAccountBalance(account!.address, selectedNetwork!.rpcUrl)
  })
  const transactionsQuery = useQuery({
    queryKey: ['transactions', account?.address, selectedNetwork?.rpcUrl],
    queryFn: () => fetchTransactions(account!.address, selectedNetwork!.rpcUrl)
  })

  return (
    <div className='p-5 bg-gray-100 dark:bg-gray-900/50 shadow-lg'>
      {balancesQuery.isLoading && <div className="text-blue-500">Loading...</div>}
      {balancesQuery.isError && <div className="text-red-500">Error: {balancesQuery.error.message}</div>}
      <div className="mt-5">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{selectedNetwork?.nickname}</h2>
        <h2 className="text-xl mt-3 text-gray-900 dark:text-gray-100">Account</h2>
        <p className="text-gray-700 dark:text-gray-300">{account?.address}</p>
        {balancesQuery.isSuccess && (
          <p className="text-green-500 dark:text-green-300">Balance: {balancesQuery.data}</p>
        )}
        <div className="mt-5">
          <h2 className="text-xl text-gray-900 dark:text-gray-100">Transactions</h2>
          {transactionsQuery.isLoading && <div className="text-blue-500">Loading transactions...</div>}
          {transactionsQuery.isError && <div className="text-red-500">Error: {transactionsQuery.error.message}</div>}
          {transactionsQuery.isSuccess && transactionsQuery.data.length === 0 && (
            <strong className="text-gray-500 dark:text-gray-400">No transactions found</strong>
          )}
          {transactionsQuery.isSuccess && transactionsQuery.data.length > 0 && (
            <div className="mt-5">
              <table className="table-auto w-full mt-3">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Transaction Hash</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">From</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">To</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Value (wei)</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionsQuery.data.map((transaction, index: number) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-200 dark:bg-gray-700' : ''}>
                      <td className="border px-4 py-2 text-sm text-gray-500 dark:text-gray-300">{transaction.hash}</td>
                      <td className="border px-4 py-2 text-sm text-gray-500 dark:text-gray-300">{transaction.from}</td>
                      <td className="border px-4 py-2 text-sm text-gray-500 dark:text-gray-300">{transaction.to}</td>
                      <td className="border px-4 py-2 text-sm text-gray-500 dark:text-gray-300">{transaction.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Balances;