import { Box, Button } from '@chakra-ui/react'
import React, { useCallback, useMemo } from 'react'
import useChain from '../hooks/useChain'
import useIsNetwork from '../hooks/useIsNetwork'

const ConnectPage:React.FC = () => {
  const { chain, network, desiredNetwork } = useChain()

  const onConnect = useCallback(() => {
    chain?.connect()
  }, [chain])

  const isDesired = useIsNetwork(desiredNetwork)

  const isConnected = useMemo(() => {
    console.log("is connected: ", !!network)
    return !!network
  }, [network])

  if (isConnected && !isDesired) {
    return (
      <Box>
        <p>Please switch your wallet to point to {desiredNetwork} network. (TODO: make that number word)</p>
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