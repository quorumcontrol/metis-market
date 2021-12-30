import { providers, Signer } from "ethers"
import { useEffect, useState } from "react"
import Chain, { CONNECTION_CHANGE, EXPECTED_MAINNET_CHAIN_ID, EXPECTED_METIS_CHAIN_ID } from "../chain/Chain"

const chain = new Chain()

interface ChainStateExcludingDesired {
  chain: Chain
  signer?: Signer
  provider?: providers.Provider
  network?: providers.Network
  contracts?: Chain['contracts']
  address?: string
}

interface ChainState extends ChainStateExcludingDesired {
  desiredNetwork: number
  setDesiredNetwork: React.Dispatch<React.SetStateAction<number>>
}

const useChain = ():ChainState => {
  const [desiredNetwork, setDesiredNetwork] = useState(EXPECTED_METIS_CHAIN_ID)
  const [chainState, setChainState] = useState<ChainStateExcludingDesired>({
    chain,
    signer: chain.signer,
    provider: chain.provider,
    network: chain.network,
    contracts: chain.contracts,
    address: chain.address,
  })

  useEffect(() => {
    const handleConnectionChange = () => {
      setChainState((s) => {
        return {
          ...s,
          chain,
          address: chain.address,
          signer: chain.signer,
          provider: chain.provider,
          network: chain.network,
          contracts: chain.contracts,
        }
      })
    }
    chain.on(CONNECTION_CHANGE, handleConnectionChange)
    return () => {
      chain.off(CONNECTION_CHANGE, handleConnectionChange)
    }
  })

  return {
    ...chainState,
    desiredNetwork,
    setDesiredNetwork
  }
}

export default useChain
