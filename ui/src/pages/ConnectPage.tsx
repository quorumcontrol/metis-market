import { Box, Button } from '@chakra-ui/react'
import React, { useCallback, useMemo } from 'react'
import { EXPECTED_MAINNET_CHAIN_ID } from '../chain/Chain'
import useChain from '../hooks/useChain'
import useIsNetwork from '../hooks/useIsNetwork'

const ConnectPage:React.FC = () => {
  const { chain, network } = useChain()

  const onConnect = useCallback(() => {
    chain?.connect()
  }, [chain])

  const isRinkeby = useIsNetwork(EXPECTED_MAINNET_CHAIN_ID)

  const isConnected = useMemo(() => {
    return !!network
  }, [network])

  if (isConnected && !isRinkeby) {
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