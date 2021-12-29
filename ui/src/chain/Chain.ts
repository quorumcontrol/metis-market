import { Signer, providers } from 'ethers'
import EventEmitter from 'events';
import Web3Modal from 'web3modal'

type Web3ModalProvider = any

export const CONNECTION_CHANGE = 'conected'

export let EXPECTED_MAINNET_CHAIN_ID = 4 // rinkeby
export let EXPECTED_METIS_CHAIN_ID = 588 // stardust

if (process.env.REACT_APP_LOCAL_TEST) {
  console.log("Using local-only setup")
  EXPECTED_MAINNET_CHAIN_ID = 31337 // rinkeby
  EXPECTED_METIS_CHAIN_ID = 31337 // stardust
}


const providerOptions = {
  /* See Provider Options Section */
};

const web3Modal = new Web3Modal({
  network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions // required
});


class Chain extends EventEmitter {
  signer?:Signer
  provider?:providers.Web3Provider
  network?: providers.Network

  private web3ModalProvider?:Web3ModalProvider

  async connect() {
    const provider = await web3Modal.connect();
    this.web3ModalProvider = provider

    provider.on("accountsChanged", (accounts: string[]) => {
      this.handleConnection()
    });
    
    // Subscribe to chainId change
    provider.on("chainChanged", (chainId: number) => {
      this.handleConnection()
    });
    
    // Subscribe to provider connection
    provider.on("connect", (info: { chainId: number }) => {
      this.handleConnection()
    });
    
    // Subscribe to provider disconnection
    provider.on("disconnect", (error: { code: number; message: string }) => {
      this.signer = undefined
      this.provider = undefined
      this.network = undefined
      this.emit(CONNECTION_CHANGE)
    });

    return this.handleConnection()
  }

  private async handleConnection() {
    this.provider = new providers.Web3Provider(this.web3ModalProvider)
    this.signer = this.provider.getSigner()
    this.network = await this.provider.getNetwork()
    this.emit(CONNECTION_CHANGE)
  }

}

export default Chain
