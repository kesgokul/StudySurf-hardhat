const { ethers, getNamedAccounts } = require("hardhat");

const arcanaWallet = "0xeE85c160C9b82623BEb6E3A24c7F89ea5f136ba1";

async function main() {
  const signers = await ethers.getSigners();
  const tx = await signers[0].sendTransaction({
    from: signers[0].address,
    to: arcanaWallet,
    value: ethers.utils.parseEther("0.1"),
  });

  //   console.log(tx);

  const txReceipt = await tx.wait(1);
  console.log(txReceipt);
  const balance = await ethers.provider.getBalance(arcanaWallet);
  console.log(ethers.utils.formatEther(balance));
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
