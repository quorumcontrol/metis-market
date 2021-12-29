import { useMemo } from "react"
import useChain from "./useChain"

const useIsNetwork = (chainId:number) => {
  const { network } = useChain()

  return useMemo(() => {
    return network?.chainId === chainId
  }, [network, chainId])
}

export default useIsNetwork