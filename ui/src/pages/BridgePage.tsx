import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";

const BridgePage: React.FC = () => {
  const { handleSubmit, register } = useForm()

  const onSubmit = handleSubmit(() => {
    return
  })

  return (
    <VStack>
      <form onSubmit={onSubmit}>
        <FormControl>
          <FormLabel htmlFor="address">Token address</FormLabel>
          <Input id="address" type="text" {...register("address", { required: true })} />
          <FormHelperText>The address of the token contract</FormHelperText>
        </FormControl>
      </form>
    </VStack>
  );
};

export default BridgePage;
