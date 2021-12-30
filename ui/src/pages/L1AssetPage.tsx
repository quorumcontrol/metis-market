import { Box, Spinner, Image, Text, Heading, Flex, Button, HStack } from '@chakra-ui/react'
import React, { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { EXPECTED_MAINNET_CHAIN_ID, EXPECTED_METIS_CHAIN_ID } from '../chain/Chain'
import { IERC721__factory } from '../chain/typechain'
import CryptoLogo from '../components/CryptoLogo'
import useChain from '../hooks/useChain'
import useIsNetwork from '../hooks/useIsNetwork'
import { useMainnetNFTMetadata } from '../hooks/useMainnetNFTs'

const L1AssetPage:React.FC = () => {
  const { tokenContract, id } = useParams()
  if (!tokenContract || !id) {
    throw new Error('missing params')
  }
  const [bridgeLoading, setBridgeLoading] = useState(false)
  const [justBridged, setJustBridged] = useState(false)
  const { contracts, signer, setDesiredNetwork, address } = useChain()
  const { metadata, loading } = useMainnetNFTMetadata(tokenContract, id)
  const isMainnet = useIsNetwork(EXPECTED_MAINNET_CHAIN_ID)
  console.log("metadata: ", metadata?.owner, address)
  const isOwner = metadata && (metadata.owner.toLowerCase() === address?.toLowerCase())

  const onBridge = useCallback(async () => {
    if (!signer || !contracts) {
      throw new Error('no signer or contracts')
    }
    if (!isMainnet) {
      console.log('setting desired network')
      setDesiredNetwork(EXPECTED_MAINNET_CHAIN_ID)
      return
    }
    setBridgeLoading(true)
    try {
      const { lockBox } = await contracts
      console.log("bridging");
      const ierc721 = IERC721__factory.connect(tokenContract, signer)
      const tx = await ierc721["safeTransferFrom(address,address,uint256)"](address!, lockBox?.address, id)
      console.log('bridge tx: ', tx.hash)
      await tx.wait()
      console.log('bridging done')
      setDesiredNetwork(EXPECTED_METIS_CHAIN_ID)
      setJustBridged(true)
      return;
    } catch (err) {
      console.error('error: ', err)
    } finally {
      setBridgeLoading(false)
    }
  }, [signer, contracts, isMainnet, setBridgeLoading, tokenContract, id, setDesiredNetwork]);

  if (loading || !metadata) {
    return (
      <Box>
        <Spinner />
      </Box>
    )
  }

  if (justBridged) {
    return (
      <Box>
        <Text>This asset is in the process of bridging to the METIS network. Give it a few minutes.</Text>
      </Box>
    )
  }

  return (
    <Box>
      <Flex>
        <Box width="md">
          <Image src={metadata.image_url} />
          <Text mt="8">{metadata.description}</Text>
        </Box>
        <Box width="md">
          <HStack>
            <CryptoLogo network='mainnet' />
            <Heading>{metadata.name}</Heading>
          </HStack>
          {isOwner && (bridgeLoading ? <Spinner /> : <Button onClick={onBridge} mt="8">Bridge</Button>) }
        </Box>
      </Flex>
    </Box>
  )
}

export default L1AssetPage