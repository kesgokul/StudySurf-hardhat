const { ethers, network } = require("hardhat");
const { assert, expect } = require("chai");
const helpers = require("@nomicfoundation/hardhat-network-helpers");
const { standardUri, enterpriseUri } = require("../../uri/uri");

const ONE_MONTH = ethers.BigNumber.from(30 * 24 * 60 * 60);
const STANDARD_PRICE = ethers.utils.parseEther("0.001");

const stdPlanArgs = ["standard", standardUri, STANDARD_PRICE, ONE_MONTH];

network.config.chainId !== 31337
  ? describe.skip
  : describe("StudySurfPremium", function () {
      let studySurf, deployer, signers, studySurfContract;
      beforeEach(async function () {
        await deployments.fixture(["all"]);
        deployer = (await getNamedAccounts()).deployer;
        signers = await ethers.getSigners();
        studySurf = await ethers.getContract("StudySurfPremium", deployer);
        studySurfContract = studySurf.connect(signers[0]);
      });

      describe("add plan", function () {
        it("should revert if not owner", async function () {
          const ssc1 = await studySurf.connect(signers[1]);
          await expect(ssc1.addPlan(...stdPlanArgs)).to.be.reverted;
        });

        it("should add the plan and emit the event", async function () {
          const tx = await studySurfContract.addPlan(...stdPlanArgs);
          const txReceipt = await tx.wait(1);

          console.log(txReceipt.events[0].args[1].toString());

          assert.equal(txReceipt.events[0].args[0], "standard");
        });

        it("should store and return the correct plan details", async function () {
          const tx = await studySurfContract.addPlan(...stdPlanArgs);
          const txReceipt = await tx.wait(1);
          const planId = txReceipt.events[0].args[1].toString();
          console.log(planId);

          // getting the tokenUri
          const uri = await studySurfContract.tokenURI(planId);
          const price = await studySurfContract.tokenPrice(planId);

          assert.equal(uri, standardUri);
          assert.equal(price.toString(), STANDARD_PRICE);
        });
      });

      describe("subscribe function", function () {
        let planId;
        async function subscribe() {
          const tx = await studySurfContract.subscribe(planId, {
            value: STANDARD_PRICE,
          });
          const txReceipt = await tx.wait(1);
          return txReceipt;
        }
        beforeEach(async function () {
          const tx = await studySurfContract.addPlan(...stdPlanArgs);
          const txReceipt = await tx.wait(1);
          planId = txReceipt.events[0].args[1].toString();
        });
        it("should revert if not enough eth is sent", async function () {
          await expect(studySurfContract.subscribe(planId)).to.be.revertedWith(
            "StudySurf__NotEnoughEthSent"
          );
          await expect(
            studySurfContract.subscribe(planId, {
              value: ethers.utils.parseEther("0.0001"),
            })
          ).to.be.revertedWith("StudySurf__NotEnoughEthSent");
        });

        it("should subscribe, mint the NFT and emit event", async function () {
          const txReceipt = await subscribe();

          const subscriberBalance = await studySurfContract.balanceOf(
            deployer,
            planId
          );

          assert.equal(txReceipt.events[2].args[0], deployer);
          assert.equal(
            txReceipt.events[2].args[1].toString(),
            planId.toString()
          );
          assert.equal(subscriberBalance.toString(), "1");
        });

        it("should revert if already subscribed", async function () {
          await subscribe();

          await expect(
            studySurfContract.subscribe(planId, { value: STANDARD_PRICE })
          ).to.be.revertedWith("StudySurf__AlreadySubscribed");
        });

        it("should re-subscribe if the existing subscription has expired", async function () {
          await subscribe();
          await helpers.time.increase(30 * 24 * 60 * 60);

          const txReceipt = await subscribe();
          const eventArgs = txReceipt.events[2].args;

          const subscriberBalance = await studySurfContract.balanceOf(
            deployer,
            planId
          );

          assert.equal(eventArgs[0], deployer);
          assert.equal(eventArgs[1].toString(), planId.toString());
          assert.equal(subscriberBalance.toString(), "1");
        });
      });
    });
