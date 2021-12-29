import { Box, HStack, VStack } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import useChain from '../hooks/useChain'
import ConnectPage from '../pages/ConnectPage'

const MainLayout:React.FC = ({ children }) => {
  const { network } = useChain()

  const isMainnet = useMemo(() => {
    return network?.chainId === 1
  }, [network])

  return (
    <Box fontSize="xl">
      <nav>
      <HStack bgColor={"black"} textColor={"white"} p="2">
        <p>Metis NFT Market</p>
      </HStack>
      </nav>
      <VStack p="2">
        <Box>
          {isMainnet ? children : <ConnectPage />}
        </Box>
      </VStack>
    </Box>
  )
}

export default MainLayout
