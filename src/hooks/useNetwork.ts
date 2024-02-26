import { NETWORKS_STORAGE_KEY, SELECTED_NETWORK_STORAGE_KEY } from "@/constants";
import { CHAIN_IDS, ChainId, DEFAULT_RPCS, RPCDefinition } from "@/networks";
import { useLocalStorage } from "usehooks-ts";

const useNetworks = () => {
  const [selectedNetwork, setSelectedNetwork] = useLocalStorage<ChainId>(SELECTED_NETWORK_STORAGE_KEY, CHAIN_IDS.SEPOLIA);
  const [networks, setNetworks] = useLocalStorage(NETWORKS_STORAGE_KEY, DEFAULT_RPCS);

  const addNetwork = (network: RPCDefinition) => {
    setNetworks([...networks, network]);
  }

  const removeNetwork = (chainId: string) => {
    setNetworks(networks.filter(network => network.chainId !== chainId));
  }

  return {
    selectedNetwork: networks.find(network => network.chainId === selectedNetwork),
    selectNetwork: setSelectedNetwork,
    networks,
    addNetwork,
    removeNetwork
  }
}

export default useNetworks;
