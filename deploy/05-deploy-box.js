const { network, ethers } = require("hardhat");
const { developmentChains } = require("../helper.hardhat.config");
const { verify } = require("../utils/verify");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("deploying box contract .................");

  const box = await deploy("Box", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("verifying ................");
    await verify(box.address, []);
  }

  const boxContract = await ethers.getContract("Box");
  const timeLock = await ethers.getContract("TimeLock");

  const transferTx = await boxContract.transferOwnership(timeLock.address);
  await transferTx.wait(1);
};

module.exports.tags = ["all", "Box"];
