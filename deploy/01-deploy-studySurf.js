const { standardUri, enterpriseUri } = require("../uri/uri");
const { network, ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;

  const uri = "";
  const args = ["StudySurf", "SDS", standardUri];

  const studySurf = await deploy("StudySurfPremium", {
    contract: "StudySurfPremium",
    from: deployer,
    args: args,
    gasLimit: 20000000,
    blockConfirmations: 1,
    log: true,
  });

  log("-------------------------------");

  if (!developmentChains.includes(network.name)) {
    await verify(studySurf.address, args);
  }
};

module.exports.tags = ["all", "surf"];
