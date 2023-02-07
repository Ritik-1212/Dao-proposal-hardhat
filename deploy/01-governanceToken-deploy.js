const { network, ethers } = require("hardhat");
const { developmentChains } = require("../helper.hardhat.config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("deploying ......................");

  const governanceToken = await deploy("GovernanceToken", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("verifying ..................");

    await verify(governanceToken.address, []);
  }

  await delegate(governanceToken.address, deployer);
  log("delegated");
};

async function delegate(governanceTokenAddress, delegatedAccount) {
  const governanceToken = await ethers.getContractAt(
    "GovernanceToken",
    governanceTokenAddress
  );

  const tx = await governanceToken.delegate(delegatedAccount);
  await tx.wait(1);
  console.log(
    `checkpoints: ${await governanceToken.numCheckPoints(delegatedAccount)}`
  );
}

module.exports.tags = ["Governancetoken", "all"];
