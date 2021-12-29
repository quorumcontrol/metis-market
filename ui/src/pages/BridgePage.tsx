import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";

interface BridgeFormData {
  address: string;
  tokenId: string;
}

const BridgePage: React.FC = () => {
  const { handleSubmit, register } = useForm<BridgeFormData>();

  const onSubmit = handleSubmit(() => {
    console.log("bridging");
    return;
  });

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
