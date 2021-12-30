import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { network } from "hardhat";

// see https://github.com/MetisProtocol/mvm/tree/develop/packages/contracts/deployments for contract addrs

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deploy, log, get, execute } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();

  if (network.live && network.name !== "rinkeby") {
    log("skipping lockbox on ", network.name, " network");
    return;
  }

  const messagePasserAddress = async () => {
    switch (network.name) {
      case "hardhat":
        return (await get("TestMessagePasser")).address;
      case "rinkeby":
        return "0xe4d0940df19f04C60006BA3420D13a82E3af7bA2";
    }
  };

  const l2keyhandlerAddress = async () => {
    switch (network.name) {
      case "hardhat":
        return (await get("L2KeyHandler")).address;
      case "rinkeby":
        return "0x77aD4f1978Fdc51bf7A659e042ed59CEB0E03db9"; // stardust l2keyhandler deploy
    }
  };

  const lockBoxDeploy = await deploy("LockBox", {
    log: true,
    deterministicDeployment: true,
    from: deployer,
    args: [await messagePasserAddress(), await l2keyhandlerAddress()],
  });

  if (!network.live && lockBoxDeploy.newlyDeployed) {
    await execute(
      "L2KeyHandler",
      {
        log: true,
        from: deployer,
      },
      "setupLockbox",
      lockBoxDeploy.address
    );
  }
};
export default func;
