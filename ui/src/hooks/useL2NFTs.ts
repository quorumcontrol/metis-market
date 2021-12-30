import axios from "axios"
import useSWR from "swr"
import { ERC721__factory } from "../chain/typechain"
import { NFTMetadata } from "../utils/nftMetadata"
import useChain from "./useChain"


const useL2NFTs = (userAddress?:string) => {
  const { contracts, chain } = useChain()

  const { data, mutate, error } = useSWR(() => {
    if (!userAddress || !contracts || !chain) {
      return null
    }
    return ['l2NFTs', userAddress]
  }, {
    fetcher: async (_, address) => {
      if (!contracts || !chain) {
        throw new Error('no contracts')
      }
      const mainnetProvider = chain.mainnetProvider

      const { l2KeyHandler } = await contracts
      const balance = await l2KeyHandler.balanceOf(address)
      return Promise.all(Array(balance.toNumber()).fill(true).map(async (_, i) => {
        const id = await l2KeyHandler.tokenOfOwnerByIndex(address, i)
        const l2Metadata = await l2KeyHandler.metadata(id)
        console.log("l2 metadata: ", l2Metadata)
        const mainnetContract = ERC721__factory.connect(l2Metadata.tokenContract, mainnetProvider)
        const tokenURI = await mainnetContract.tokenURI(l2Metadata.tokenId)
        const metadataResponse = await axios.get(tokenURI)
        return {
          id: l2Metadata.tokenId,
          tokenContract: l2Metadata.tokenContract,
          ...metadataResponse.data,
          network: 'metis',
          l2Network: {
            id: id,
          }
        } as NFTMetadata
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
