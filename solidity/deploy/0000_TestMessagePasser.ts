import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { network } from 'hardhat'

const func: DeployFunction = async function(hre: HardhatRuntimeEnvironment) {
  const { deploy, log } = hre.deployments
  const { deployer } = await hre.getNamedAccounts()

  if(network.live) {
    log("skipping test message handler because live network")
    return
  }

  await deploy("TestMessagePasser", {
    log: true,
    deterministicDeployment: true,
    from: deployer
  })
  
}
export default func
