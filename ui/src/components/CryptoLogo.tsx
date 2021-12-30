import { Image } from '@chakra-ui/react';
import React from 'react'
import { NFTMetadata } from '../utils/nftMetadata';
import ethLogo from "../assets/eth-logo.png";
import metisLogo from "../assets/metis-logo.png";

interface CryptoLogoProps {
  network: NFTMetadata["network"];
}

const CryptoLogo: React.FC<CryptoLogoProps> = ({ network }) => {
  switch (network) {
    case "mainnet":
      return <Image src={ethLogo} height="64px" />;
    case "metis":
      return <Image src={metisLogo} height="64px" />;
  }
};

export default CryptoLogo