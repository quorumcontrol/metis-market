import { BigNumber } from "ethers";

export interface NFTMetadata {
  id: BigNumber,
  tokenContract: string,
  network: 'mainnet' | 'metis'
  l2Network?: {
    id: BigNumber
  }
}

export interface NFTExtendedMetadata extends NFTMetadata {
  owner: string,
  name?: string
  description?: string
  image_url?: string
}
