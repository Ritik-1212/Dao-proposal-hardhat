const { ethers, network } = require("hardhat");
const { fs } = require("fs");
const {
  proposalFile,
  developmentChains,
  VOTING_PERIOD,
} = require("../helper.hardhat.config");
const { moveBlocks } = require("../utils/moveBlocks");

async function Main() {
  const box = await ethers.getContract("Box");
  const governor = await ethers.getContract("GovernanceContract");

  const proposal = JSON.parse(fs.readFileSync(proposalFile, "utf8"));
  const proposalId = proposal[network.config.chainId].at(-1);

  const voteIndex = 1;
  const reason = " this is the voting Reason";

  console.log("voting..............");

  const voteTx = await governor.castVoteWithReason(
    proposalId,
    voteIndex,
    reason
  );

  const voteReceipt = await voteTx.wait(1);

  console.log(voteReceipt.events[0].args.reason);

  const proposalState = await governor.state(proposalId);

  console.log(`current proposal state ${proposalState}`);

  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 1);
  }
}

Main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
