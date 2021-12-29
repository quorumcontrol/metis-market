import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { IERC721__factory } from "../chain/typechain";
import useChain from "../hooks/useChain";

interface BridgeFormData {
  address: string;
  tokenId: string;
}

const BridgePage: React.FC = () => {
  const { signer, contracts } = useChain()
  const { handleSubmit, register } = useForm<BridgeFormData>();
  const [loading, setLoading] = useState(false)

  const onSubmit = handleSubmit(async ({ address, tokenId }) => {
    if (!signer || !contracts) {
      throw new Error('no signer or contracts')
    }
    setLoading(true)
    try {
      const { lockBox } = await contracts
      console.log("bridging");
      const ierc721 = IERC721__factory.connect(address, signer)
      const tx = await ierc721["safeTransferFrom(address,address,uint256)"](await signer.getAddress(), lockBox?.address, tokenId)
      console.log('bridge tx: ', tx.hash)
      await tx.wait()
      console.log('bridging done')
      return;
    } catch (err) {
      console.error('error: ', err)
    } finally {
      setLoading(false)
    }

  });

  if (loading) {
    return (
      <VStack>
        <Spinner />
      </VStack>
    )
  }

  return (
    <VStack>
      <form onSubmit={onSubmit}>
        <VStack spacing="8">
          <FormControl>
            <FormLabel htmlFor="address">Token address</FormLabel>
            <Input
              id="address"
              type="text"
              {...register("address", { required: true })}
            />
            <FormHelperText>The address of the token contract</FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="tokenId">Token id</FormLabel>
            <Input
              id="tokenId"
              type="number"
              {...register("tokenId", { required: true })}
            />
            <FormHelperText>The tokenId to bridge</FormHelperText>
          </FormControl>
          <Button type="submit">Bridge</Button>
        </VStack>
      </form>
    </VStack>
  );
};

export default BridgePage;
