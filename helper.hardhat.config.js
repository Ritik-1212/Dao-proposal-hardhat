const MIN_DELAY = 3600;
const QUORUM_PERCENTAGE = 4;

const VOTING_DELAY = 1; //block
const VOTING_PERIOD = 5; //block
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

const developmentChains = ["hardhat", "localhost"];
const proposalFile = "proposal.json";
const FUNC = "store";
const PROPOSAL_DESCRIPTION = "proposal #1 55 stored in the box";
const STORE_VALUE = 55;

module.exports = {
  MIN_DELAY,
  QUORUM_PERCENTAGE,
  VOTING_DELAY,
  VOTING_PERIOD,
  developmentChains,
  ADDRESS_ZERO,
  FUNC,
  PROPOSAL_DESCRIPTION,
  STORE_VALUE,
  proposalFile,
};
