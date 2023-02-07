const { ethers, network } = require("hardhat");
const {
  PROPOSAL_DESCRIPTION,
  developmentChains,
  MIN_DELAY,
  FUNC,
  STORE_VALUE,
} = require("../helper.hardhat.config");
const { moveBlocks } = require("../utils/moveBlocks");
const { moveTime } = require("../utils/moveTime");

async function queueAndExecute(functionToCall, args) {
  const box = await ethers.getContract("Box");
  const governor = await ethers.getContract("GovernanceContract");

  const encodeFunctionCall = box.interface.encodeFunctionData(
    functionToCall,
    args
  );
  const descriptionHash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION)
  );
  console.log("queueing.........");
  const queueTx = await governor.queue(
    [box.address],
    [0],
    [encodeFunctionCall],
    descriptionHash
  );

  await queueTx.wait(1);

  if (developmentChains.includes(network.name)) {
    await moveTime(MIN_DELAY + 1);
    await moveBlocks(1);
  }

  console.log("executing......................");
  const executeTx = await governor.execute(
    [box.address],
    [0],
    [encodeFunctionCall],
    descriptionHash
  );

  await executeTx.wait(1);

  const boxValue = await box.retrieve();

  console.log(`current box value: ${boxValue.toString()}`);
}

queueAndExecute(FUNC, [STORE_VALUE])
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
