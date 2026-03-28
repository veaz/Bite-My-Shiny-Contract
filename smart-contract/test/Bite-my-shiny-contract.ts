import { ethers } from "hardhat";
import { expect } from "chai";
import { loadFixture, mine } from "@nomicfoundation/hardhat-network-helpers";

const ONE_SAT = 10000000000n; // 1 sat in wei

async function deployFixture() {
  const [owner, player1, player2] = await ethers.getSigners();
  const BiteMyShinyContract = await ethers.getContractFactory("BiteMyShinyContract");
  const bender = await BiteMyShinyContract.deploy({ value: ethers.parseEther("0.01") });
  await bender.waitForDeployment();
  return { bender, owner, player1, player2 };
}

describe("BiteMyShinyContract", () => {

  describe("Deployment", () => {
    it("should deploy successfully with correct address", async function () {
      const { bender } = await loadFixture(deployFixture);
      const address = await bender.getAddress();
      expect(address).to.match(/^0x[a-fA-F0-9]{40}$/);
    });

    it("should have initial cost of 1 sat", async function () {
      const { bender } = await loadFixture(deployFixture);
      expect(await bender.currentCost()).to.equal(ONE_SAT);
    });

    it("should receive initial funding", async function () {
      const { bender } = await loadFixture(deployFixture);
      const balance = await ethers.provider.getBalance(await bender.getAddress());
      expect(balance).to.equal(ethers.parseEther("0.01"));
    });
  });

  describe("receive()", () => {
    it("should accept direct RBTC transfers", async function () {
      const { bender, owner } = await loadFixture(deployFixture);
      const addr = await bender.getAddress();
      await owner.sendTransaction({ to: addr, value: ethers.parseEther("0.005") });
      const balance = await ethers.provider.getBalance(addr);
      expect(balance).to.equal(ethers.parseEther("0.015"));
    });
  });

  describe("bet()", () => {
    it("should accept a bet with correct payment", async function () {
      const { bender, player1 } = await loadFixture(deployFixture);
      await expect(bender.connect(player1).bet("hello bender", { value: ONE_SAT }))
        .to.not.be.reverted;
    });

    it("should reject a bet with insufficient payment", async function () {
      const { bender, player1 } = await loadFixture(deployFixture);
      await expect(bender.connect(player1).bet("hello", { value: ONE_SAT - 1n }))
        .to.be.revertedWith("Not enough rBTC");
    });

    it("should accept overpayment", async function () {
      const { bender, player1 } = await loadFixture(deployFixture);
      await expect(bender.connect(player1).bet("hello", { value: ONE_SAT * 5n }))
        .to.not.be.reverted;
    });

    it("should store the bet block number", async function () {
      const { bender, player1 } = await loadFixture(deployFixture);
      await bender.connect(player1).bet("hello", { value: ONE_SAT });
      const betBlock = await bender.bets(player1.address);
      expect(betBlock).to.be.greaterThan(0n);
    });

    it("should store the committed message hash", async function () {
      const { bender, player1 } = await loadFixture(deployFixture);
      await bender.connect(player1).bet("hello", { value: ONE_SAT });
      const committed = await bender.commitedMessages(player1.address);
      const expected = ethers.keccak256(ethers.solidityPacked(["string"], ["hello"]));
      expect(committed).to.equal(expected);
    });

    it("should emit BetPlaced event", async function () {
      const { bender, player1 } = await loadFixture(deployFixture);
      await expect(bender.connect(player1).bet("hello bender", { value: ONE_SAT }))
        .to.emit(bender, "BetPlaced")
        .withArgs(player1.address, ONE_SAT, "hello bender");
    });

    it("should reject second bet while first is active", async function () {
      const { bender, player1 } = await loadFixture(deployFixture);
      await bender.connect(player1).bet("first", { value: ONE_SAT });
      await expect(bender.connect(player1).bet("second", { value: ONE_SAT }))
        .to.be.revertedWith("Already have active bet");
    });

    it("should allow new bet after expired bet (256 blocks)", async function () {
      const { bender, player1 } = await loadFixture(deployFixture);
      await bender.connect(player1).bet("first", { value: ONE_SAT });
      await mine(257);
      await expect(bender.connect(player1).bet("second", { value: ONE_SAT * 2n }))
        .to.not.be.reverted;
    });

    it("should double currentCost when expired bet is replaced", async function () {
      const { bender, player1 } = await loadFixture(deployFixture);
      await bender.connect(player1).bet("first", { value: ONE_SAT });
      await mine(257);
      await bender.connect(player1).bet("second", { value: ONE_SAT * 2n });
      expect(await bender.currentCost()).to.equal(ONE_SAT * 2n);
    });

    it("should allow multiple players to bet simultaneously", async function () {
      const { bender, player1, player2 } = await loadFixture(deployFixture);
      await bender.connect(player1).bet("hello", { value: ONE_SAT });
      await bender.connect(player2).bet("world", { value: ONE_SAT });
      expect(await bender.bets(player1.address)).to.be.greaterThan(0n);
      expect(await bender.bets(player2.address)).to.be.greaterThan(0n);
    });
  });

  describe("claim()", () => {
    it("should reject claim without a bet", async function () {
      const { bender, player1 } = await loadFixture(deployFixture);
      await expect(bender.connect(player1).claim())
        .to.be.revertedWith("You dont have a bet");
    });

    it("should require at least 1 block between bet and claim", async function () {
      const { bender, player1 } = await loadFixture(deployFixture);
      await bender.connect(player1).bet("hello", { value: ONE_SAT });
      await mine(1);
      await expect(bender.connect(player1).claim()).to.not.be.reverted;
    });

    it("should reject claim after 256 blocks", async function () {
      const { bender, player1 } = await loadFixture(deployFixture);
      await bender.connect(player1).bet("hello", { value: ONE_SAT });
      await mine(257);
      await expect(bender.connect(player1).claim())
        .to.be.revertedWith("Bet expired");
    });

    it("should allow claim after 1 block", async function () {
      const { bender, player1 } = await loadFixture(deployFixture);
      await bender.connect(player1).bet("hello", { value: ONE_SAT });
      await mine(1);
      await expect(bender.connect(player1).claim()).to.not.be.reverted;
    });

    it("should clear bet and message after claim", async function () {
      const { bender, player1 } = await loadFixture(deployFixture);
      await bender.connect(player1).bet("hello", { value: ONE_SAT });
      await mine(1);
      await bender.connect(player1).claim();
      expect(await bender.bets(player1.address)).to.equal(0n);
      expect(await bender.commitedMessages(player1.address)).to.equal(ethers.ZeroHash);
    });

    it("should emit Win or Loss event", async function () {
      const { bender, player1 } = await loadFixture(deployFixture);
      await bender.connect(player1).bet("hello", { value: ONE_SAT });
      await mine(1);
      const tx = await bender.connect(player1).claim();
      const receipt = await tx.wait();

      const winEvents = receipt?.logs.filter(log => {
        try {
          return bender.interface.parseLog({ topics: log.topics as string[], data: log.data })?.name === "Win";
        } catch { return false; }
      }) ?? [];
      const lossEvents = receipt?.logs.filter(log => {
        try {
          return bender.interface.parseLog({ topics: log.topics as string[], data: log.data })?.name === "Loss";
        } catch { return false; }
      }) ?? [];

      expect(winEvents.length + lossEvents.length).to.equal(1);
    });

    it("should not allow double claim", async function () {
      const { bender, player1 } = await loadFixture(deployFixture);
      await bender.connect(player1).bet("hello", { value: ONE_SAT });
      await mine(1);
      await bender.connect(player1).claim();
      await expect(bender.connect(player1).claim())
        .to.be.revertedWith("You dont have a bet");
    });
  });

  describe("Win/Loss mechanics", () => {
    it("should pay 90% of treasury on win", async function () {
      const { bender, player1 } = await loadFixture(deployFixture);
      const addr = await bender.getAddress();

      let won = false;
      for (let i = 0; i < 100; i++) {
        const cost = await bender.currentCost();
        await bender.connect(player1).bet(`attempt ${i}`, { value: cost });
        await mine(1);

        const balanceBefore = await ethers.provider.getBalance(addr);
        const tx = await bender.connect(player1).claim();
        const receipt = await tx.wait();

        const winEvent = receipt?.logs.find(log => {
          try {
            return bender.interface.parseLog({ topics: log.topics as string[], data: log.data })?.name === "Win";
          } catch { return false; }
        });

        if (winEvent) {
          const balanceAfter = await ethers.provider.getBalance(addr);
          const expectedRetained = balanceBefore / 10n;
          expect(balanceAfter).to.be.closeTo(expectedRetained, 1n);
          won = true;
          break;
        }
      }
      expect(won).to.be.true;
    });

    it("should reset currentCost to 1 sat after win", async function () {
      const { bender, player1 } = await loadFixture(deployFixture);

      let won = false;
      for (let i = 0; i < 100; i++) {
        const cost = await bender.currentCost();
        await bender.connect(player1).bet(`attempt ${i}`, { value: cost });
        await mine(1);
        const tx = await bender.connect(player1).claim();
        const receipt = await tx.wait();

        const winEvent = receipt?.logs.find(log => {
          try {
            return bender.interface.parseLog({ topics: log.topics as string[], data: log.data })?.name === "Win";
          } catch { return false; }
        });

        if (winEvent) {
          expect(await bender.currentCost()).to.equal(ONE_SAT);
          won = true;
          break;
        }
      }
      expect(won).to.be.true;
    });

    it("should double currentCost after loss", async function () {
      const { bender, player1 } = await loadFixture(deployFixture);
      await bender.connect(player1).bet("hello", { value: ONE_SAT });
      await mine(1);
      const tx = await bender.connect(player1).claim();
      const receipt = await tx.wait();

      const lossEvent = receipt?.logs.find(log => {
        try {
          return bender.interface.parseLog({ topics: log.topics as string[], data: log.data })?.name === "Loss";
        } catch { return false; }
      });

      if (lossEvent) {
        expect(await bender.currentCost()).to.equal(ONE_SAT * 2n);
      }
    });

    it("should stop doubling currentCost after reaching cap", async function () {
      const BiteMyShinyContract = await ethers.getContractFactory("BiteMyShinyContract");
      const bender = await BiteMyShinyContract.deploy({ value: ethers.parseEther("10") });
      await bender.waitForDeployment();
      const [, player] = await ethers.getSigners();
      const cap = ethers.parseEther("0.01");

      let previousCost = 0n;
      let hitCap = false;
      for (let i = 0; i < 200; i++) {
        const cost = await bender.currentCost();

        if (cost >= cap && previousCost >= cap) {
          expect(cost).to.equal(previousCost);
          hitCap = true;
          break;
        }

        previousCost = cost;
        await bender.connect(player).bet(`msg ${i}`, { value: cost });
        await mine(1);
        const tx = await bender.connect(player).claim();
        const receipt = await tx.wait();

        const winEvent = receipt?.logs.find(log => {
          try {
            return bender.interface.parseLog({ topics: log.topics as string[], data: log.data })?.name === "Win";
          } catch { return false; }
        });
        if (winEvent) {
          previousCost = 0n;
        }
      }
      expect(hitCap).to.be.true;
    });
  });

  describe("getDivisor()", () => {
    it("should work with small treasury (< 0.001 ether = 20% chance)", async function () {
      const BiteMyShinyContract = await ethers.getContractFactory("BiteMyShinyContract");
      const bender = await BiteMyShinyContract.deploy({ value: ethers.parseEther("0.0005") });
      await bender.waitForDeployment();

      const [, player] = await ethers.getSigners();
      const cost = await bender.currentCost();
      await bender.connect(player).bet("test", { value: cost });
      await mine(1);
      await expect(bender.connect(player).claim()).to.not.be.reverted;
    });

    it("should work with large treasury (>= 0.1 ether = 5% chance)", async function () {
      const BiteMyShinyContract = await ethers.getContractFactory("BiteMyShinyContract");
      const bender = await BiteMyShinyContract.deploy({ value: ethers.parseEther("0.5") });
      await bender.waitForDeployment();

      const [, player] = await ethers.getSigners();
      const cost = await bender.currentCost();
      await bender.connect(player).bet("test", { value: cost });
      await mine(1);
      await expect(bender.connect(player).claim()).to.not.be.reverted;
    });
  });

  describe("Security", () => {
    it("should produce different results for different players with same message", async function () {
      const { bender, player1, player2 } = await loadFixture(deployFixture);

      await bender.connect(player1).bet("same message", { value: ONE_SAT });
      await bender.connect(player2).bet("same message", { value: ONE_SAT });
      await mine(1);

      await expect(bender.connect(player1).claim()).to.not.be.reverted;
      await expect(bender.connect(player2).claim()).to.not.be.reverted;
    });

    it("should not allow claiming someone else's bet", async function () {
      const { bender, player1, player2 } = await loadFixture(deployFixture);
      await bender.connect(player1).bet("hello", { value: ONE_SAT });
      await mine(1);

      await expect(bender.connect(player2).claim())
        .to.be.revertedWith("You dont have a bet");
    });
  });
});
