import { Box, HStack, VStack } from '@chakra-ui/react'
import React from 'react'
import useChain from '../hooks/useChain'
import useIsNetwork from '../hooks/useIsNetwork'
import ConnectPage from '../pages/ConnectPage'

const MainLayout:React.FC = ({ children }) => {
  const { desiredNetwork } = useChain()
  const isDesiredChain = useIsNetwork(desiredNetwork)

  return (
    <Box fontSize="xl">
      <nav>
      <HStack bgColor={"black"} textColor={"white"} p="2">
        <p>Metis NFT Market</p>
      </HStack>
      </nav>
      <VStack p="2">
        <Box>
          {isDesiredChain ? children : <ConnectPage />}
        </Box>
      </VStack>
    </Box>
  )
}

export default MainLayout
