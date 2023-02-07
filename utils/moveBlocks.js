const { network } = require("hardhat");

async function moveBlocks(amount) {
  console.log("moving Blocks");

  for (let i = 0; i < amount.length; i++) {
    await network.provider.request({
      method: "evm_mine",
      params: [],
    });
  }
}

module.exports = {
  moveBlocks,
};
