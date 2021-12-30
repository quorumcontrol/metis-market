import {
  Box,
  Heading,
  Image,
  List,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import CryptoLogo from "../components/CryptoLogo";
import useL2NFTs from "../hooks/useL2NFTs";
import useMainnetNFTs, { useMainnetNFTMetadata } from "../hooks/useMainnetNFTs";
import { NFTMetadata } from "../utils/nftMetadata";

interface NFTListProps {
  nfts: NFTMetadata[];
}

interface NFTBoxProps {
  nft: NFTMetadata;
}

const NFTBox: React.FC<NFTBoxProps> = ({ nft }) => {
  console.log('nft box: ', nft.tokenContract, nft.id)
  const { metadata, loading } = useMainnetNFTMetadata(
    nft.tokenContract,
    nft.id
  );

  if (loading || !metadata) {
    return (
      <Box border="1px" rounded="lg" p="4" maxW="lg">
        <Spinner />
      </Box>
    );
  }

  return (
    <Link to={`/asset/l1/${nft.tokenContract}/${nft.id.toString()}`}>
      <Box border="1px" rounded="lg" p="4" maxW="lg">
        <VStack>
          <CryptoLogo network={nft.network} />
          <Image src={metadata.image_url} />
          <Text>{metadata.name}</Text>
        </VStack>
      </Box>
    </Link>
  );
};

const NFTList: React.FC<NFTListProps> = ({ nfts }) => {
  return (
    <List>
      {nfts.map((nft, i) => {
        return (
          <NFTBox
            key={`nft-list-box-${nft.tokenContract}-${nft.id.toString()}`}
            nft={nft}
          />
        );
      })}
    </List>
  );
};

const ProfilePage: React.FC = () => {
  const { address } = useParams();
  const { nfts: l2Nfts, loading: l2Loading } = useL2NFTs(address);
  const { nfts: mainnetNfts, loading: mainnetLoading } =
    useMainnetNFTs(address);

  const nfts = useMemo(() => {
    if (!l2Nfts || !mainnetNfts) {
      return [];
    }
    return l2Nfts.concat(mainnetNfts);
  }, [l2Nfts, mainnetNfts]);

  if (l2Loading || mainnetLoading) {
    return (
      <VStack>
        <Spinner />
      </VStack>
    );
  }

  if (!nfts) {
    return (
      <VStack>
        <Box>Nothing collected.</Box>
      </VStack>
    );
  }

  return (
    <VStack>
      <Box>
        <Heading mb="10">{address}</Heading>
        <NFTList nfts={nfts} />
      </Box>
    </VStack>
  );
};

export default ProfilePage;
