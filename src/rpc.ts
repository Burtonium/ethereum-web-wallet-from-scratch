type TransactionReceipt = {
  transactionHash: string;
  transactionIndex: number;
  blockHash: string;
  blockNumber: number;
  from: string;
  to: string;
  cumulativeGasUsed: number;
  gasUsed: number;
  contractAddress: string | null;
  logs: unknown[];
  status: string;
};

export async function fetchAccountBalance(accountAddress: string, nodeUrl: string): Promise<bigint> {
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

export async function fetchAccountNonce(accountAddress: string, nodeUrl: string): Promise<string> {
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

export async function estimateGasPrice(nodeUrl: string): Promise<string> {
  const response = await fetch(nodeUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_gasPrice',
      id: 1,
    }),
  });
  const data = await response.json();
  if (data.error) {
    throw new Error(`Failed to estimate gas price: ${data.error.message}`);
  }
  return data.result;
}

export async function sendRawTransaction(rawTransaction: `0x${string}`, rpcUrl: string): Promise<string> {
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_sendRawTransaction',
      params: [rawTransaction],
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


export async function getTransactionReceipt(txHash: string, nodeUrl: string): Promise<TransactionReceipt> {
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

export const waitForTransactionToBeMined = async (txHash: string, rpcUrl: string) => {
  let retries = 0;
  let receipt = await getTransactionReceipt(txHash, rpcUrl);

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
