import { Box, Button } from '@chakra-ui/react'
import React, { useCallback } from 'react'
import useChain from '../hooks/useChain'

const ConnectPage:React.FC = () => {
  const { chain } = useChain()

  const onConnect = useCallback(() => {
    console.log("connecting: ", chain)
    chain?.connect()
  }, [chain])

  return (
    <Box>
      <Button onClick={onConnect}>Connect</Button>
    </Box>
  )
}

export default ConnectPage