import { providers, Signer } from "ethers"
import { useEffect, useState } from "react"
import Chain, { CONNECTION_CHANGE } from "../chain/Chain"

const chain = new Chain()

interface ChainState {
  chain: Chain
  signer?: Signer
  provider?: providers.Provider
  network?: providers.Network
  contracts?: Chain['contracts']
}

const useChain = () => {
  const [chainState, setChainState] = useState<ChainState>({
    chain,
    signer: chain.signer,
    provider: chain.provider,
    network: chain.network,
    contracts: chain.contracts,
  })

  useEffect(() => {
    const handleConnectionChange = () => {
      setChainState({
        chain,
        signer: chain.signer,
        provider: chain.provider,
        network: chain.network,
        contracts: chain.contracts
      })
    }
    chain.on(CONNECTION_CHANGE, handleConnectionChange)
    return () => {
      chain.off(CONNECTION_CHANGE, handleConnectionChange)
    }
  })

  return chainState
}

export default useChain
