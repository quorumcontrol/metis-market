import useSWR from "swr"
import useChain from "./useChain"


const useL2NFTs = (userAddress?:string) => {
  const { contracts } = useChain()

  const { data, mutate, error } = useSWR(() => {
    if (!userAddress || !contracts) {
      return null
    }
    return ['nfts', userAddress]
  }, {
    fetcher: async (_, address) => {
      if (!contracts) {
        throw new Error('no contracts')
      }
      const { l2KeyHandler } = await contracts
      const balance = await l2KeyHandler.balanceOf(address)
      return Promise.all(Array(balance.toNumber()).fill(true).map(async (_, i) => {
        const id = await l2KeyHandler.tokenOfOwnerByIndex(address, i)
        return l2KeyHandler.metadata(id)
      }))
    },
    onError: (err, key) => {
      console.error('error handling useL2NFTS: ', key, err)
      return true
    }
  })

  return {
    nfts: data,
    loading: !data && !error,
    error,
    mutate
  }
}

export default useL2NFTs
