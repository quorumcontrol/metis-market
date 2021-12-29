import { Box, Button } from '@chakra-ui/react'
import React, { useCallback, useMemo } from 'react'
import useChain from '../hooks/useChain'

const ConnectPage:React.FC = () => {
  const { chain, network } = useChain()

  const onConnect = useCallback(() => {
    console.log("connecting: ", chain)
    chain?.connect()
  }, [chain])

  const isMainnet = useMemo(() => {
    return network?.chainId === 1
  }, [network])

  const isConnected = useMemo(() => {
    return !!network
  }, [network])

  if (isConnected && !isMainnet) {
    return (
      <Box>
        <p>Please switch your wallet to point to Rinkeby network.</p>
      </Box>
    )
  }

  return (
    <Box>
      <Button onClick={onConnect}>Connect</Button>
    </Box>
  )
}

export default ConnectPage