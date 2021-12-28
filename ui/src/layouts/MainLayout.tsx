import { Box, HStack, VStack } from '@chakra-ui/react'
import React from 'react'
import useChain from '../hooks/useChain'
import ConnectPage from '../pages/ConnectPage'

const MainLayout:React.FC = ({ children }) => {
  const { provider } = useChain()

  return (
    <Box fontSize="xl">
      <HStack bgColor={"black"} textColor={"white"} p="2">
        <p>Nav</p>
      </HStack>
      <VStack p="2">
        <Box>
          {provider ? children : <ConnectPage />}
        </Box>
      </VStack>
    </Box>
  )
}

export default MainLayout
