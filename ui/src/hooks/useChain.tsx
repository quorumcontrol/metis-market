import { providers, Signer } from "ethers"
import React, { createContext, useContext, useEffect, useState } from "react"
import Chain, { CONNECTION_CHANGE, EXPECTED_METIS_CHAIN_ID } from "../chain/Chain"

const chain = new Chain()

interface ChainState {
  chain: Chain
  signer?: Signer
  provider?: providers.Provider
  network?: providers.Network
  contracts?: Chain['contracts']
  address?: string
  desiredNetwork: number
  setDesiredNetwork: React.Dispatch<React.SetStateAction<number>>
}

export const ChainContext = createContext<ChainState>({
  chain,
  signer: chain.signer,
  provider: chain.provider,
  network: chain.network,
  contracts: chain.contracts,
  address: chain.address,
  desiredNetwork: EXPECTED_METIS_CHAIN_ID,
  setDesiredNetwork: (number)=>true
})

export const ChainProvider:React.FC = ({ children }) => {
  const [desiredNetwork, setDesiredNetwork] = useState(EXPECTED_METIS_CHAIN_ID)
  const [chainState, setChainState] = useState<ChainState>({
    chain,
    signer: chain.signer,
    provider: chain.provider,
    network: chain.network,
    contracts: chain.contracts,
    address: chain.address,
    desiredNetwork,
    setDesiredNetwork
  })

  useEffect(() => {
    const handleConnectionChange = () => {
      console.log('connection change: ', chain.network)
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

   
  return (
    <ChainContext.Provider value={{
      ...chainState,
      desiredNetwork,
      setDesiredNetwork
    }}>
      {children}
    </ChainContext.Provider>
  )
}

const useChain = () => {
  return useContext(ChainContext)
}

export default useChain
