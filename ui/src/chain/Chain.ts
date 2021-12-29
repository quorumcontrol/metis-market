import { Signer, providers } from 'ethers'
import EventEmitter from 'events';
import Web3Modal from 'web3modal'
import { L2KeyHandler, L2KeyHandler__factory, LockBox, LockBox__factory } from './typechain';

type Web3ModalProvider = any

const networkName = [undefined, ""].includes(process.env.REACT_APP_NETWORK_NAME) ? "localhost" : process.env.REACT_APP_NETWORK_NAME

const addresses = require(`../deployments/${networkName}/addresses.json`)

function isLocalHost() {
  return networkName === "localhost"
}

export const CONNECTION_CHANGE = 'conected'

export let EXPECTED_MAINNET_CHAIN_ID = 4 // rinkeby
export let EXPECTED_METIS_CHAIN_ID = 588 // stardust

if (isLocalHost()) {
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

interface Contracts {
  lockBox:LockBox
  l2KeyHandler:L2KeyHandler
}

class Chain extends EventEmitter {
  signer?:Signer
  provider?:providers.Web3Provider
  network?: providers.Network

  contracts?:Promise<Contracts>

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

  private async setupContracts() {
    if (!this.signer || !this.provider) {
      throw new Error('need to have a provider and signer')
    }
    return {
      lockBox: new LockBox__factory(this.signer).attach(addresses.LockBox),
      l2KeyHandler: new L2KeyHandler__factory(this.signer).attach(addresses.L2KeyHandler),
    }
  }

  private async handleConnection() {
    this.provider = new providers.Web3Provider(this.web3ModalProvider)
    this.signer = this.provider.getSigner()
    this.network = await this.provider.getNetwork()
    this.contracts = this.setupContracts()
    this.emit(CONNECTION_CHANGE)
  }
}

export default Chain
