import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { CondominiumAdapter } from "../typechain-types";
import { ethers } from "ethers";

describe("CondominiumAdapter", function () {
  enum Options {
    EMPTY = 0,
    YES = 1,
    NO = 2,
    ABSTENTION = 3,
  } //0,1,2,3

  enum Status {
    IDLE = 0,
    VOTING = 1,
    APPROVED = 2,
    DENIED = 3,
    DELETED = 4,
    SPENT = 5
  } //0,1,2,3,4,5

  enum Category {
    DECISION = 0,
    SPENT = 1,
    CHANGE_QUOTA = 2,
    CHANGE_MANAGER = 3,
  } //0,1,2,3

  async function addResidents(
    adapter: CondominiumAdapter,
    count: number,
    accounts: SignerWithAddress[]
  ) {
    for (let i = 1; i <= count; i++) {
      const residenceId =
        1000 * Math.ceil(i / 25) +
        100 * Math.ceil(i / 5) +
        (i - 5 * Math.floor((i - 1) / 5));
      await adapter.addResident(accounts[i].address, residenceId);
      
      const instance = adapter.connect(accounts[i]);
      await instance.payQuota(residenceId, {value: ethers.parseEther("0.01")})
    }
  }

  async function addVotes(
    adapter: CondominiumAdapter,
    count: number,
    accounts: SignerWithAddress[],
    shouldApproved: boolean = true
  ) {
    for (let i = 1; i <= count; i++) {
      const instance = adapter.connect(accounts[i]);
      await instance.vote("topic 1", shouldApproved ? Options.YES : Options.NO);
    }
  }
  async function deployAdapterFixture() {
    const hre = require("hardhat");
    const accounts = await hre.ethers.getSigners();
    const manager = accounts[0];
    const CondominiumAdapter = await hre.ethers.getContractFactory(
      "CondominiumAdapter"
    );
    const adapter = await CondominiumAdapter.deploy();
    return { adapter, manager, accounts };
  }

  async function deployImplementationFixture() {
    const hre = require("hardhat");

    const Condominium = await hre.ethers.getContractFactory("Condominium");
    const contract = await Condominium.deploy();
    const deployedContract = await contract.waitForDeployment();
    const contractAddress = await deployedContract.getAddress();

    return { contract: deployedContract, contractAddress };
  }

  it("Should upgrade", async function () {
    const { adapter, manager, accounts } = await deployAdapterFixture();
    const { contract, contractAddress } = await deployImplementationFixture();

    await adapter.upgrade(contractAddress);
    const implementationAddress = await adapter.getImplementAddress();

    expect(implementationAddress).to.equal(contractAddress);
  });

  it("Should NOT upgrade (permission)", async function () {
    const { adapter, manager, accounts } = await deployAdapterFixture();
    const { contract, contractAddress } = await deployImplementationFixture();

    const instance = adapter.connect(accounts[1]);
    await expect(instance.upgrade(contractAddress)).to.be.rejectedWith(
      "You do not have permission"
    );
  });

  it("Should add resident", async function () {
    const { adapter, manager, accounts } = await deployAdapterFixture();
    const { contract, contractAddress } = await deployImplementationFixture();

    await adapter.upgrade(contractAddress);
    await adapter.addResident(accounts[1].address, 1301);

    expect(await contract.isResident(accounts[1].address)).to.equal(true);
  });

  it("Should NOT add resident(upgrade)", async function () {
    const { adapter, manager, accounts } = await deployAdapterFixture();
    const { contract, contractAddress } = await deployImplementationFixture();

    await expect(
      adapter.addResident(accounts[1].address, 1301)
    ).to.be.rejectedWith("You must upgrad first");
  });

  it("Should remove resident", async function () {
    const { adapter, manager, accounts } = await deployAdapterFixture();
    const { contract, contractAddress } = await deployImplementationFixture();

    await adapter.upgrade(contractAddress);
    await adapter.addResident(accounts[1].address, 1301);
    await adapter.removeResident(accounts[1].address);
    expect(await contract.isResident(accounts[1].address)).to.equal(false);
  });

  it("Should NOT remove resident(upgrade)", async function () {
    const { adapter, manager, accounts } = await deployAdapterFixture();
    const { contract, contractAddress } = await deployImplementationFixture();

    await expect(
      adapter.removeResident(accounts[1].address)
    ).to.be.rejectedWith("You must upgrad first");
  });

  it("Should set counseler", async function () {
    const { adapter, manager, accounts } = await deployAdapterFixture();
    const { contract, contractAddress } = await deployImplementationFixture();

    await adapter.upgrade(contractAddress);
    await adapter.addResident(accounts[1].address, 1301);
    await adapter.setConsuelor(accounts[1].address, true);

    expect(await contract.counselors(accounts[1].address)).to.equal(true);
  });

  it("Should NOT set counseler", async function () {
    const { adapter, manager, accounts } = await deployAdapterFixture();
    const { contract, contractAddress } = await deployImplementationFixture();

    await expect(
      adapter.setConsuelor(accounts[3].address, true)
    ).to.be.rejectedWith("You must upgrad first");
  });

  it("Should add topic", async function () {
    const { adapter, manager, accounts } = await deployAdapterFixture();
    const { contract, contractAddress } = await deployImplementationFixture();

    await adapter.upgrade(contractAddress);

    await adapter.addTopic(
      "topic 1",
      "description 1",
      Category.DECISION,
      0,
      manager.address
    );
    expect(await contract.topicExists("topic 1")).to.equal(true);
  });

  it("Should edit topic", async function () {
    const { adapter, manager, accounts } = await deployAdapterFixture();
    const { contract, contractAddress } = await deployImplementationFixture();

    await adapter.upgrade(contractAddress);

    await adapter.addTopic(
      "topic 1",
      "description 1",
      Category.DECISION,
      0,
      manager.address
    );

    await adapter.editTopic(
      "topic 1",
      "New description 1",
      0,
      manager.address
    );

    const topic = await contract.getTopic('topic 1');
    expect(topic.description).to.equal("New description 1")
  
  });

  it("Should NOT edit topic (upgrade)", async function () {
    const { adapter, manager, accounts } = await deployAdapterFixture();
    const { contract, contractAddress } = await deployImplementationFixture();

    await expect(
      adapter.editTopic(
        "topic 1",
        "description 1",
        0,
        manager.address
      )
    ).to.be.rejectedWith("You must upgrad first");
  });

  it("Should NOT add topic (upgrade)", async function () {
    const { adapter, manager, accounts } = await deployAdapterFixture();
    const { contract, contractAddress } = await deployImplementationFixture();

    await expect(
      adapter.addTopic(
        "topic 1",
        "description 1",
        Category.DECISION,
        0,
        manager.address
      )
    ).to.be.rejectedWith("You must upgrad first");
  });

  it("Should remove topic", async function () {
    const { adapter, manager, accounts } = await deployAdapterFixture();
    const { contract, contractAddress } = await deployImplementationFixture();

    await adapter.upgrade(contractAddress);

    await adapter.addTopic(
      "topic 1",
      "description 1",
      Category.DECISION,
      0,
      manager.address
    );
    await adapter.removeTopic("topic 1");
    expect(await contract.topicExists("topic 1")).to.equal(false);
  });

  it("Should NOT remove topic (upgrade)", async function () {
    const { adapter, manager, accounts } = await deployAdapterFixture();
    const { contract, contractAddress } = await deployImplementationFixture();

    await expect(adapter.removeTopic("topic 1")).to.be.rejectedWith(
      "You must upgrad first"
    );
  });

  it("Should open voting", async function () {
    const { adapter, manager, accounts } = await deployAdapterFixture();
    const { contract, contractAddress } = await deployImplementationFixture();

    await adapter.upgrade(contractAddress);

    await adapter.addTopic(
      "topic 1",
      "description 1",
      Category.DECISION,
      0,
      manager.address
    );
    await adapter.openVoting("topic 1");

    const topic = await contract.getTopic("topic 1");
    expect(topic.status).to.equal(Status.VOTING);
  });

  
  it("Should NOT open voting(upgrade)", async function () {
    const { adapter, manager, accounts } = await deployAdapterFixture();
    const { contract, contractAddress } = await deployImplementationFixture();

    await expect(adapter.openVoting("topic 1")).to.be.rejectedWith(
      "You must upgrad first"
    );
  });

  it("Should vote", async function () {
    const { adapter, manager, accounts } = await deployAdapterFixture();
    const { contract, contractAddress } = await deployImplementationFixture();

    await adapter.upgrade(contractAddress);
    await adapter.addResident(accounts[1].address, 1301);

    await adapter.addTopic(
      "topic 1",
      "description 1",
      Category.DECISION,
      0,
      manager.address
    );
    await adapter.openVoting("topic 1");

    const instance = adapter.connect(accounts[1]);
    await instance.payQuota(1301, {value: ethers.parseEther("0.01")})
    await instance.vote("topic 1", Options.NO);

    expect(await contract.numberOfVotes("topic 1")).to.equal(1);
  });

  it("Should NOT vote(upgrade)", async function () {
    const { adapter, manager, accounts } = await deployAdapterFixture();
    const { contract, contractAddress } = await deployImplementationFixture();

    await expect(adapter.vote("topic 1", Options.YES)).to.be.rejectedWith(
      "You must upgrad first"
    );
  });

  it("Should close voting(manager)", async function () {
    const { adapter, manager, accounts } = await deployAdapterFixture();
    const { contract, contractAddress } = await deployImplementationFixture();

    await adapter.upgrade(contractAddress);
    await addResidents(adapter, 15, accounts);

    await adapter.addTopic(
      "topic 1",
      "description 1",
      Category.CHANGE_MANAGER,
      0,
      accounts[2].address
    );
    await adapter.openVoting("topic 1");

    await addVotes(adapter, 15, accounts);

    expect(await adapter.closeVoting("topic 1")).to.emit(adapter, "ManagerChanged").withArgs(accounts[2]);
  });

  it("Should close voting(quota)", async function () {
    const { adapter, manager, accounts } = await deployAdapterFixture();
    const { contract, contractAddress } = await deployImplementationFixture();

    await adapter.upgrade(contractAddress);
    await addResidents(adapter, 20, accounts);

    await adapter.addTopic(
      "topic 1",
      "description 1",
      Category.CHANGE_QUOTA,
      4,
      manager.address
    );
    await adapter.openVoting("topic 1");

    await addVotes(adapter, 20, accounts);

    expect(await adapter.closeVoting("topic 1")).to.emit(adapter, "QuotaChanged").withArgs(4n);
  });

  it("Should close voting(decision approved)", async function () {
    const { adapter, manager, accounts } = await deployAdapterFixture();
    const { contract, contractAddress } = await deployImplementationFixture();

    await adapter.upgrade(contractAddress);
    await addResidents(adapter, 5, accounts);

    await adapter.addTopic(
      "topic 1",
      "description 1",
      Category.DECISION,
      0,
      manager.address
    );
    await adapter.openVoting("topic 1");

    await addVotes(adapter, 5, accounts);

    await adapter.closeVoting("topic 1");

    const topic = await contract.getTopic("topic 1");

    expect(topic.status).to.equal(Status.APPROVED);
  });

  it("Should close voting(decision denied)", async function () {
    const { adapter, manager, accounts } = await deployAdapterFixture();
    const { contract, contractAddress } = await deployImplementationFixture();

    await adapter.upgrade(contractAddress);
    await addResidents(adapter, 5, accounts);

    await adapter.addTopic(
      "topic 1",
      "description 1",
      Category.DECISION,
      0,
      manager.address
    );
    await adapter.openVoting("topic 1");

    await addVotes(adapter, 5, accounts, false);

    await adapter.closeVoting("topic 1");

    const topic = await contract.getTopic("topic 1");

    expect(topic.status).to.equal(Status.DENIED);
  });

  it("Should NOT close voting(upgrade)", async function () {
    const { adapter, manager, accounts } = await deployAdapterFixture();
    const { contract, contractAddress } = await deployImplementationFixture();

    await expect(adapter.closeVoting("topic 1")).to.be.rejectedWith(
      "You must upgrad first"
    );
  });

  it("Should NOT pay quota(upgrade)", async function () {
    const { adapter, manager, accounts } = await deployAdapterFixture();
    const { contract, contractAddress } = await deployImplementationFixture();

    await expect(adapter.payQuota(1101, {value: ethers.parseEther("0.01")})).to.be.rejectedWith(
      "You must upgrad first"
    );
  });

  it("Should transfer", async function () {
    const { adapter, manager, accounts } = await deployAdapterFixture();
    const { contract, contractAddress } = await deployImplementationFixture();

    const hre = require("hardhat");

    await adapter.upgrade(contractAddress);

    await adapter.addTopic(
      "topic 1",
      "description 1",
      Category.SPENT,
      100,
      accounts[11].address
    );
    await adapter.openVoting("topic 1");

    await addResidents(adapter, 10, accounts);
    await addVotes(adapter, 10 , accounts);
    await adapter.closeVoting("topic 1");

    const balanceBefore = await hre.ethers.provider.getBalance(contractAddress);
    const balanceBeforeServiceProvider = await hre.ethers.provider.getBalance(accounts[11]);

    await adapter.transfer('topic 1', 100);

    const balanceAfter = await hre.ethers.provider.getBalance(contractAddress);
    const balanceBeforeAfterProvider = await hre.ethers.provider.getBalance(accounts[11]);
    const topic =  await contract.getTopic("topic 1");

    expect(balanceAfter).to.equal(balanceBefore - 100n);
    expect(balanceBeforeAfterProvider - balanceBeforeServiceProvider ).to.equal(100n);
    expect(topic.status).to.equal(Status.SPENT);

  });

  it("Should NOT transfer(upgrade)", async function () {
    const { adapter, manager, accounts } = await deployAdapterFixture();
    const { contract, contractAddress } = await deployImplementationFixture();

    await expect(adapter.transfer("topic 1", 100n)).to.be.rejectedWith(
      "You must upgrad first"
    );
  });
});
