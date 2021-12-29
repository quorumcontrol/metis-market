import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import buildAddressList from "../tasks/buildAddressList";

const func: DeployFunction = async function (_: HardhatRuntimeEnvironment) {
  buildAddressList()
};
export default func;
