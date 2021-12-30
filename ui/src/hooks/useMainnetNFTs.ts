import axios from "axios"
import { BigNumber, BigNumberish } from "ethers"
import useSWR from "swr"
import { ERC721Enumerable__factory } from "../chain/typechain"
import { NFTExtendedMetadata, NFTMetadata } from "../utils/nftMetadata"
import useChain from "./useChain"

const TEST_NFT_ADDRESS = '0x68787e92b3b97dcEd24AD31d4569591e3015FC8E'

export const useMainnetNFTMetadata = (tokenContract:string, tokenId: BigNumberish) => {
  const { chain } = useChain()

  const { data, mutate, error } = useSWR(
    ['L1NFT', tokenContract, tokenId.toString()], 
    {
      fetcher: async (_, tokenContract:string, tokenId:BigNumberish) => {
        const mainnetProvider = chain.mainnetProvider
        const nftContract = ERC721Enumerable__factory.connect(tokenContract, mainnetProvider)
        const [owner,uri] = await Promise.all([
          nftContract.ownerOf(tokenId),
          nftContract.tokenURI(tokenId)
        ])
        console.log("owner: ", owner)
        const metadataReasponse = await axios.get(uri)
        return {
          ...metadataReasponse.data,
          id: BigNumber.from(tokenId),
          tokenContract: TEST_NFT_ADDRESS,
          network: 'mainnet',
          owner,
        } as NFTExtendedMetadata
      }
    })

  return {
    metadata: data,
    loading: !data && !error,
    mutate,
    error
  }
}

//TODO: use something like the graph, etc to get more than a single contract NFTs
const useMainnetNFTs = (userAddress?:string) => {
  const { chain } = useChain()

  const { data, mutate, error } = useSWR(() => {
    if (!userAddress || !chain) {
      return null
    }
    return ['mainnetNFTs', userAddress]
  }, {
    fetcher: async (_, address) => {
      const mainnetProvider = chain.mainnetProvider
      const nftContract = ERC721Enumerable__factory.connect(TEST_NFT_ADDRESS, mainnetProvider)
      const balance = await nftContract.balanceOf(address)

      console.log('balance')
      return Promise.all(Array(balance.toNumber()).fill(true).map(async (_, i) => {
        const id = await nftContract.tokenOfOwnerByIndex(address, i)
        return {
          id: id,
          tokenContract: TEST_NFT_ADDRESS,
          network: 'mainnet',
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

export default useMainnetNFTs
