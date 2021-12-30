import { Box, Heading, List, Spinner, VStack } from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import React from 'react'
import { useParams } from 'react-router-dom'
import useL2NFTs from '../hooks/useL2NFTs'

interface NFTMetadata {
  tokenContract:string
  tokenId:BigNumber
}

interface NFTListProps {
  nfts: NFTMetadata[]
}

interface NFTBoxProps {
  nft: NFTMetadata
}

const NFTBox:React.FC<NFTBoxProps> = ({ nft }) => {
  return (
    <Box>
      <p>{nft.tokenContract}</p>
      <p>{nft.tokenId.toString()}</p>
    </Box>
  )
}

const NFTList:React.FC<NFTListProps> = ({ nfts }) => {

  return (
    <List>
      {nfts.map((nft, i) => {
        return <NFTBox key={`nft-list-box-${nft.tokenContract}-${nft.tokenId.toString()}`} nft={nft} />
      })}
    </List>
  )
}

const ProfilePage:React.FC = () => {
  const params = useParams()
  console.log("params: ", params)
  const { nfts, loading } = useL2NFTs(params.address)

  if (loading) {
    return (
      <VStack>
        <Spinner />
      </VStack>
    )
  }

  if (!nfts) {
    return (
      <VStack>
        <Box>
          Nothing collected.
        </Box>
      </VStack>
    )
  }

  return (
    <VStack>
      <Box>
        <Heading>address</Heading>
        <NFTList nfts={nfts} />
      </Box>
    </VStack>
  )
}

export default ProfilePage
