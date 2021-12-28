import { providers, Signer } from "ethers"
import { useEffect, useState } from "react"
import Chain from "../chain/Chain"

const chain = new Chain()

const useChain = () => {
  const [signer, setSigner] = useState<Signer|undefined>(chain.signer)
  const [provider, setProvider] = useState<providers.Provider|undefined>(chain.provider)

  useEffect(() => {
    chain.on('connected', () => {
      setSigner(chain.signer)
      setProvider(chain.provider)
    })
  })

  return { signer, provider, chain }
}

export default useChain
