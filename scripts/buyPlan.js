const { ethers, network, deployments, getNamedAccounts } = require("hardhat");
const { standardUri, enterpriseUri } = require("../uri/uri");

const ONE_MONTH = ethers.BigNumber.from(30 * 24 * 60 * 60);
const STANDARD_PRICE = ethers.utils.parseEther("0.01");
const ENTERPRISE_PRICE = ethers.utils.parseEther("0.07");

async function main() {
  if (network.config.chainId === 31337) {
    await deployments.fixture(["all"]);
  }

  const { deployer } = await getNamedAccounts();
  const signers = await ethers.getSigners();
  const owner = signers[0];

  const studySurf = await ethers.getContract("StudySurfPremium", deployer);
  const studySurfContract = studySurf.connect(owner);

  const tx = await studySurfContract.subscribe(1, {
    value: STANDARD_PRICE,
  });
  const txReceipt = await tx.wait(1);
  console.log(txReceipt);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
