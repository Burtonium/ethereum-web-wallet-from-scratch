import { capitalize } from "lodash";

export const infuraProjectId = import.meta.env.VITE_INFURA_PROJECT_ID;


export const NETWORK_TYPES = {
  GOERLI: 'goerli',
  LOCALHOST: 'localhost',
  MAINNET: 'mainnet',
  RPC: 'rpc',
  SEPOLIA: 'sepolia',
  LINEA_GOERLI: 'linea-goerli',
  LINEA_MAINNET: 'linea-mainnet',
} as const;

export type NetworkType = typeof NETWORK_TYPES[keyof typeof NETWORK_TYPES];

export const getRpcUrl = ({
  network,
  excludeProjectId = false,
}: {
  network: NetworkType;
  excludeProjectId?: boolean;
}): `https://${string}` =>
  `https://${network}.infura.io/v3/${excludeProjectId ? '' : infuraProjectId}`;

export const MAINNET_RPC_URL = getRpcUrl({
  network: NETWORK_TYPES.MAINNET,
});
export const GOERLI_RPC_URL = getRpcUrl({ network: NETWORK_TYPES.GOERLI });
export const SEPOLIA_RPC_URL = getRpcUrl({ network: NETWORK_TYPES.SEPOLIA });
export const LINEA_GOERLI_RPC_URL = getRpcUrl({
  network: NETWORK_TYPES.LINEA_GOERLI,
});
export const LINEA_MAINNET_RPC_URL = getRpcUrl({
  network: NETWORK_TYPES.LINEA_MAINNET,
});
export const LOCALHOST_RPC_URL = 'http://localhost:8545';

type RPCPreferences = {
  blockExplorerUrl: `https://${string}`;
  imageUrl: string;
};


export type ChainId = (typeof CHAIN_IDS)[keyof typeof CHAIN_IDS];

export type RPCDefinition = {
  chainId: ChainId;
  nickname: string;
  rpcUrl: `https://${string}`;
  ticker: string;
  rpcPrefs: RPCPreferences;
};


export const CURRENCY_SYMBOLS = {
  ARBITRUM: 'ETH',
  AVALANCHE: 'AVAX',
  BNB: 'BNB',
  BUSD: 'BUSD',
  CELO: 'CELO',
  DAI: 'DAI',
  GNOSIS: 'XDAI',
  ETH: 'ETH',
  FANTOM: 'FTM',
  HARMONY: 'ONE',
  PALM: 'PALM',
  MATIC: 'MATIC',
  TEST_ETH: 'TESTETH',
  USDC: 'USDC',
  USDT: 'USDT',
  WETH: 'WETH',
  OPTIMISM: 'ETH',
  CRONOS: 'CRO',
  GLIMMER: 'GLMR',
  MOONRIVER: 'MOVR',
  ONE: 'ONE',
} as const;


export const CHAIN_IDS = {
  MAINNET: '0x1',
  GOERLI: '0x5',
  LOCALHOST: '0x539',
  BSC: '0x38',
  BSC_TESTNET: '0x61',
  OPTIMISM: '0xa',
  OPTIMISM_TESTNET: '0x1a4',
  BASE: '0x2105',
  BASE_TESTNET: '0x14a33',
  OPBNB: '0xcc',
  OPBNB_TESTNET: '0x15eb',
  POLYGON: '0x89',
  POLYGON_TESTNET: '0x13881',
  AVALANCHE: '0xa86a',
  AVALANCHE_TESTNET: '0xa869',
  FANTOM: '0xfa',
  FANTOM_TESTNET: '0xfa2',
  CELO: '0xa4ec',
  ARBITRUM: '0xa4b1',
  HARMONY: '0x63564c40',
  PALM: '0x2a15c308d',
  SEPOLIA: '0xaa36a7',
  LINEA_GOERLI: '0xe704',
  LINEA_MAINNET: '0xe708',
  AURORA: '0x4e454152',
  MOONBEAM: '0x504',
  MOONBEAM_TESTNET: '0x507',
  MOONRIVER: '0x505',
  CRONOS: '0x19',
  GNOSIS: '0x64',
  ZKSYNC_ERA: '0x144',
  TEST_ETH: '0x539',
  ARBITRUM_GOERLI: '0x66eed',
} as const;


export const MAINNET_DISPLAY_NAME = 'Ethereum Mainnet';
export const GOERLI_DISPLAY_NAME = 'Goerli';
export const SEPOLIA_DISPLAY_NAME = 'Sepolia';
export const LINEA_GOERLI_DISPLAY_NAME = 'Linea Goerli';
export const LINEA_MAINNET_DISPLAY_NAME = 'Linea Mainnet';
export const LOCALHOST_DISPLAY_NAME = 'Localhost 8545';
export const BSC_DISPLAY_NAME = 'Binance Smart Chain';
export const POLYGON_DISPLAY_NAME = 'Polygon';
export const AVALANCHE_DISPLAY_NAME = 'Avalanche Network C-Chain';
export const ARBITRUM_DISPLAY_NAME = 'Arbitrum One';
export const BNB_DISPLAY_NAME = 'BNB Chain';
export const OPTIMISM_DISPLAY_NAME = 'OP Mainnet';
export const FANTOM_DISPLAY_NAME = 'Fantom Opera';
export const HARMONY_DISPLAY_NAME = 'Harmony Mainnet Shard 0';
export const PALM_DISPLAY_NAME = 'Palm';
export const CELO_DISPLAY_NAME = 'Celo Mainnet';
export const GNOSIS_DISPLAY_NAME = 'Gnosis';
export const ZK_SYNC_ERA_DISPLAY_NAME = 'zkSync Era Mainnet';
export const BASE_DISPLAY_NAME = 'Base Mainnet';
export const AURORA_ETH_DISPLAY_NAME = 'Aurora';


export const ETH_TOKEN_IMAGE_URL = '/images/eth_logo.svg';
export const LINEA_GOERLI_TOKEN_IMAGE_URL = '/images/linea-logo-testnet.png';
export const LINEA_MAINNET_TOKEN_IMAGE_URL = '/images/linea-logo-mainnet.svg';
export const TEST_ETH_TOKEN_IMAGE_URL = '/images/black-eth-logo.svg';
export const BNB_TOKEN_IMAGE_URL = '/images/bnb.svg';
export const MATIC_TOKEN_IMAGE_URL = '/images/matic-token.svg';
export const AVAX_TOKEN_IMAGE_URL = '/images/avax-token.svg';
export const AETH_TOKEN_IMAGE_URL = '/images/arbitrum.svg';
export const FTM_TOKEN_IMAGE_URL = '/images/fantom-opera.svg';
export const HARMONY_ONE_TOKEN_IMAGE_URL = '/images/harmony-one.svg';
export const OPTIMISM_TOKEN_IMAGE_URL = '/images/optimism.svg';
export const PALM_TOKEN_IMAGE_URL = '/images/palm.svg';
export const CELO_TOKEN_IMAGE_URL = '/images/celo.svg';
export const GNOSIS_TOKEN_IMAGE_URL = '/images/gnosis.svg';
export const ZK_SYNC_ERA_TOKEN_IMAGE_URL = '/images/zk-sync.svg';
export const BASE_TOKEN_IMAGE_URL = '/images/base.svg';
export const ACALA_TOKEN_IMAGE_URL = '/images/acala-network-logo.svg';
export const ARBITRUM_NOVA_IMAGE_URL = '/images/arbitrum-nova-logo.svg';
export const ASTAR_IMAGE_URL = '/images/astar-logo.svg';
export const BAHAMUT_IMAGE_URL = '/images/bahamut.png';
export const BLACKFORT_IMAGE_URL = '/images/blackfort.png';
export const CANTO_IMAGE_URL = '/images/canto.svg';
export const CONFLUX_ESPACE_IMAGE_URL = '/images/conflux.svg';
export const CORE_BLOCKCHAIN_MAINNET_IMAGE_URL = '/images/core.svg';
export const CRONOS_IMAGE_URL = '/images/cronos.svg';
export const DEXALOT_SUBNET_IMAGE_URL = '/images/dexalut-subnet.svg';
export const DFK_CHAIN_IMAGE_URL = '/images/dfk.png';
export const DOGECHAIN_IMAGE_URL = '/images/dogechain.jpeg';
export const ENDURANCE_SMART_CHAIN_MAINNET_IMAGE_URL =
  '/images/endurance-smart-chain-mainnet.png';
export const ETHEREUM_CLASSIC_MAINNET_IMAGE_URL = '/images/eth_classic.svg';
export const EVMOS_IMAGE_URL = '/images/evmos.svg';
export const FLARE_MAINNET_IMAGE_URL = '/images/flare-mainnet.svg';
export const FUSE_GOLD_MAINNET_IMAGE_URL = '/images/fuse-mainnet.jpeg';
export const HAQQ_NETWORK_IMAGE_URL = '/images/haqq.svg';
export const KCC_MAINNET_IMAGE_URL = '/images/kcc-mainnet.svg';
export const KLAYTN_MAINNET_IMAGE_URL = '/images/klaytn.svg';
export const KROMA_MAINNET_IMAGE_URL = '/images/kroma.svg';
export const LIGHT_LINK_IMAGE_URL = '/images/lightlink.svg';
export const MANTA_PACIFIC_MAINNET_IMAGE_URL = '/images/manta.svg';
export const MANTLE_MAINNET_IMAGE_URL = '/images/mantle.svg';
export const MOONBEAM_IMAGE_URL = '/images/moonbeam.svg';
export const MOONRIVER_IMAGE_URL = '/images/moonriver.svg';
export const NEAR_AURORA_MAINNET_IMAGE_URL = '/images/near-aurora.svg';
export const NEBULA_MAINNET_IMAGE_URL = '/images/nebula.svg';
export const OASYS_MAINNET_IMAGE_URL = '/images/oasys.svg';
export const OKXCHAIN_MAINNET_IMAGE_URL = '/images/okx.svg';
export const PGN_MAINNET_IMAGE_URL = '/images/pgn.svg';
export const ZKEVM_MAINNET_IMAGE_URL = '/images/polygon-zkevm.svg';
export const PULSECHAIN_MAINNET_IMAGE_URL = '/images/pulse.svg';
export const SHARDEUM_LIBERTY_2X_IMAGE_URL = '/images/shardeum-2.svg';
export const SHARDEUM_SPHINX_1X_IMAGE_URL = '/images/shardeum-1.svg';
export const SHIB_MAINNET_IMAGE_URL = '/images/shiba.svg';
export const SONGBIRD_MAINNET_IMAGE_URL = '/images/songbird.svg';
export const STEP_NETWORK_IMAGE_URL = '/images/step.svg';
export const TELOS_EVM_MAINNET_IMAGE_URL = '/images/telos.svg';
export const TENET_MAINNET_IMAGE_URL = '/images/tenet.svg';
export const VELAS_EVM_MAINNET_IMAGE_URL = '/images/velas.svg';
export const ZKATANA_MAINNET_IMAGE_URL = '/images/zkatana.png';
export const ZORA_MAINNET_IMAGE_URL = '/images/zora.svg';

export const DEFAULT_RPCS: RPCDefinition[] = [
  {
    chainId: CHAIN_IDS.POLYGON,
    nickname: `${POLYGON_DISPLAY_NAME} ${capitalize(NETWORK_TYPES.MAINNET)}`,
    rpcUrl: `https://polygon-mainnet.infura.io/v3/${infuraProjectId}`,
    ticker: CURRENCY_SYMBOLS.MATIC,
    rpcPrefs: {
      blockExplorerUrl: 'https://polygonscan.com/',
      imageUrl: MATIC_TOKEN_IMAGE_URL,
    },
  },
  {
    chainId: CHAIN_IDS.MAINNET,
    nickname: MAINNET_DISPLAY_NAME,
    rpcUrl: MAINNET_RPC_URL,
    ticker: CURRENCY_SYMBOLS.ETH,
    rpcPrefs: {
      blockExplorerUrl: 'https://etherscan.io',
      imageUrl: ETH_TOKEN_IMAGE_URL,
    },
  },
  {
    chainId: CHAIN_IDS.SEPOLIA,
    nickname: SEPOLIA_DISPLAY_NAME,
    rpcUrl: SEPOLIA_RPC_URL,
    ticker: CURRENCY_SYMBOLS.ETH,
    rpcPrefs: {
      blockExplorerUrl: `https://${NETWORK_TYPES.SEPOLIA}.etherscan.io`,
      imageUrl: TEST_ETH_TOKEN_IMAGE_URL,
    },
  }
];
