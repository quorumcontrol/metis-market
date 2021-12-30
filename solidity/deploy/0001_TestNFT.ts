import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { network } from 'hardhat'

const func: DeployFunction = async function(hre: HardhatRuntimeEnvironment) {
  const { deploy, log } = hre.deployments
  const { deployer } = await hre.getNamedAccounts()

  if(network.live && network.name !== "rinkeby") {
    log("skipping test NFT because live network that is not rinkeby")
    return
  }

  await deploy("TestNFT", {
    log: true,
    deterministicDeployment: true,
    from: deployer
  })
  
}
export default func
