import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { network } from 'hardhat'


const func: DeployFunction = async function(hre: HardhatRuntimeEnvironment) {
  const { deploy, log, get, execute } = hre.deployments
  const { deployer } = await hre.getNamedAccounts()

  if(network.live && network.name !== "stardust") {
    log("skipping l2keyhandler on ", network.name, " network")
    return
  }

  const messagePasserAddress = async () => {
    console.log('network name: ', network.name)
    switch (network.name) {
      case 'hardhat':
        return (await get('TestMessagePasser')).address
      case 'stardust':
        return '0x4200000000000000000000000000000000000000'
    }
  }

  const lockBoxAddress = async () => {
    switch(network.name) {
      case 'hardhat':
        return (await get('LockBox')).address
      case 'stardust':
        return '0xB5642C348Ef444d801ED799fb9b122f980bf7178' // rinkeby deploy
    }
  }

  await deploy("L2KeyHandler", {
    log: true,
    from: deployer,
    args: [await messagePasserAddress()]
  })
  
  await execute(
    "L2KeyHandler", 
    {
      log: true,
      from: deployer,
    },
    "setupLockbox",
    lockBoxAddress(),
  )

}
export default func
