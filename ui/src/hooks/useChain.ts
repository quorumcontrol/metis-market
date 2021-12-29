import { providers, Signer } from "ethers"
import { useEffect, useState } from "react"
import Chain from "../chain/Chain"

const chain = new Chain()

interface ChainState {
  chain: Chain
  signer?: Signer
  provider?: providers.Provider
  network?: providers.Network
}

const useChain = () => {
  const [chainState, setChainState] = useState<ChainState>({
    chain,
    signer: chain.signer,
    provider: chain.provider,
    network: chain.network
  })

  useEffect(() => {
    chain.on('connected', () => {
      setChainState({
        chain,
        signer: chain.signer,
        provider: chain.provider,
        network: chain.network
      })
    })
  })

  return chainState
}

export default useChain
