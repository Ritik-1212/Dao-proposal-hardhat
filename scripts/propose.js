const { ethers, network } = require("hardhat");
const {
  VOTING_DELAY,
  proposalFile,
  FUNC,
  STORE_VALUE,
  PROPOSAL_DESCRIPTION,
} = require("../helper.hardhat.config");
const { moveBlocks } = require("../utils/moveBlocks");
const { fs } = require("fs");

async function Propose(functionToCall, arguments, proposalDescription) {
  const boxContract = await ethers.getContract("Box");
  const governor = await ethers.getContract("GovernanceContract");

  const encodeFunctionCall = boxContract.interface.encodeFunctionData(
    functionToCall,
    arguments
  );
  console.log(
    `proposing ${functionToCall} function from ${boxContract.address} with ${arguments}`
  );
  const proposeTx = await governor.propose(
    [boxContract.address],
    [0],
    [encodeFunctionCall],
    proposalDescription
  );

  //if on the local chain then to fasten the process by moving blocks
  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_DELAY + 1);
  }

  const proposalReceipt = await proposeTx.wait(1);

  const proposalId = proposalReceipt.events[0].args.proposalId;

  let proposalIdStored = JSON.parse(fs.readFileSync(proposalFile, "utf8"));

  const chainId = network.config.chainId.toString();

  proposalIdStored[chainId].push(proposalId.toString());

  fs.writeFileSync(proposalFile, JSON.stringify(proposalIdStored));
}

Propose(FUNC, [STORE_VALUE], PROPOSAL_DESCRIPTION)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
