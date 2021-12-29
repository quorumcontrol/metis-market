import { Signer, providers } from 'ethers'
import EventEmitter from 'events';
import Web3Modal from 'web3modal'

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

  async connect() {
    const web3Provider = await web3Modal.connect();
    this.provider = new providers.Web3Provider(web3Provider)
    this.signer = this.provider.getSigner()
    this.network = await this.provider.getNetwork()
    this.emit('connected')
  }

}

export default Chain
