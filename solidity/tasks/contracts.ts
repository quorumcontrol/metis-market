import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy";
import { Contract } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

async function getDeployer(env:HardhatRuntimeEnvironment) {
  const signers = await env.ethers.getSigners()
  return signers[0]
}

export async function fetchContract<T=Contract>(name:string, env:HardhatRuntimeEnvironment) {
  const factory = await env.ethers.getContractFactory(name)
  const { address } = await env.deployments.get(name)

  return factory.attach(address).connect(await getDeployer(env)) as any as T
}
