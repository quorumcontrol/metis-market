import { Box, HStack, VStack } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { EXPECTED_MAINNET_CHAIN_ID } from '../chain/Chain'
import useChain from '../hooks/useChain'
import useIsNetwork from '../hooks/useIsNetwork'
import ConnectPage from '../pages/ConnectPage'

const MainLayout:React.FC = ({ children }) => {
  const isRinkeby = useIsNetwork(EXPECTED_MAINNET_CHAIN_ID)

  return (
    <Box fontSize="xl">
      <nav>
      <HStack bgColor={"black"} textColor={"white"} p="2">
        <p>Metis NFT Market</p>
      </HStack>
      </nav>
      <VStack p="2">
        <Box>
          {isRinkeby ? children : <ConnectPage />}
        </Box>
      </VStack>
    </Box>
  )
}

export default MainLayout
