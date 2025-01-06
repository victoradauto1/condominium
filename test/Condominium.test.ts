import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { Condominium } from "../dist/typechain-types";

describe("Condominium", function () {
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
  } //0,1,2,3

  enum Category {
    DECISION = 0,
    SPENT = 1,
    CHANGE_QUOTA = 2,
    CHANGE_MANAGER = 3,
  } //0,1,2,3

  async function addResidents(
    contract: Condominium,
    count: number,
    accounts: SignerWithAddress[]
  ) {
    for (let i = 1; i <= count; i++) {
      const residenceId =
        1000 * Math.ceil(i / 25) +
        100 * Math.ceil(i / 5) +
        (i - 5 * Math.floor((i - 1) / 5));
      await contract.addResident(accounts[i].address, residenceId);
    }
  }

  async function addVotes(
    contract: Condominium,
    count: number,
    accounts: SignerWithAddress[]
  ) {
    for (let i = 1; i <= count; i++) {
      const instance = contract.connect(accounts[i]);
      await instance.vote("topic 1", Options.YES);
    }
  }

  async function deployCondominiumFixture() {
    const hre = require("hardhat");
    const accounts = await hre.ethers.getSigners();
    const manager = accounts[0];
    const Condominium = await hre.ethers.getContractFactory("Condominium");
    const contract = await Condominium.deploy();
    return { contract, manager, accounts };
  }

  it("Should be residence", async function () {
    const { contract } = await deployCondominiumFixture();
    expect(await contract.residenceExists(2102)).to.equal(true);
  });

  it("Should be manager", async function () {
    const { contract, manager } = await deployCondominiumFixture();
    expect(await contract.manager()).to.equal(manager.address);
  });

  it("Should add resident", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();
    await contract.addResident(accounts[1].address, 2102);
    expect(await contract.isResident(accounts[1].address)).to.equal(true);
  });

  it("Should NOT add resident (permission)", async function () {
    const { contract, accounts } = await deployCondominiumFixture();
    const instance = contract.connect(accounts[1]);
    await expect(
      instance.addResident(accounts[1].address, 2102)
    ).to.be.rejectedWith(
      "Only the manager or the council can call this function"
    );
  });

  it("Should NOT add resident (residence)", async function () {
    const { contract, accounts } = await deployCondominiumFixture();
    await expect(
      contract.addResident(accounts[1].address, 21020)
    ).to.be.rejectedWith("Residence does not exist");
  });

  it("Should remove resident", async function () {
    const { contract, accounts } = await deployCondominiumFixture();
    await contract.addResident(accounts[1].address, 2102);
    await contract.removeResident(accounts[1].address);
    expect(await contract.isResident(accounts[1].address)).to.equal(false);
  });

  it("Should NOT remove resident (permission)", async function () {
    const { contract, accounts } = await deployCondominiumFixture();
    await contract.addResident(accounts[1].address, 2102);
    const instance = contract.connect(accounts[1]);
    await expect(instance.removeResident(accounts[1].address)).to.be.rejectedWith(
      "Only manager can call this function"
    );
  });

  it("Should NOT remove resident (counselor)", async function () {
    const { contract, accounts } = await deployCondominiumFixture();
    await contract.addResident(accounts[1].address, 2102);
    await contract.setConsuelor(accounts[1].address, true);
    await expect(contract.removeResident(accounts[1].address)).to.be.rejectedWith(
      "The council cannot be removed"
    );
  });

  it("Should be resident", async function () {
    const { contract, accounts } = await deployCondominiumFixture();
    await contract.addResident(accounts[1].address, 2102);
    expect(await contract.isResident(accounts[1].address)).to.equal(true);
  });

  it("Should set Counselor", async function () {
    const { contract, accounts} = await deployCondominiumFixture();
    await contract.addResident(accounts[1].address, 2102);
    await contract.setConsuelor(accounts[1].address, true);
    expect(await contract.counselors(accounts[1].address)).to.equal(true);
  });

  it("Should NOT set Counselor (permission)", async function () {
    const { contract, accounts } = await deployCondominiumFixture();
    await contract.addResident(accounts[1].address, 2102);
    const instance = contract.connect(accounts[1]);
    await expect(
      instance.setConsuelor(accounts[1].address, true)
    ).to.be.rejectedWith("Only manager can call this function");
  });

  it("Should NOT set Counselor (not resident)", async function () {
    const { contract, accounts } = await deployCondominiumFixture();
    await expect(
      contract.setConsuelor(accounts[1].address, true)
    ).to.be.rejectedWith("The consuelor must be a resident");
  });

  // it("Should set Manager", async function () {
  //   const { contract, resident } = await deployCondominiumFixture();
  //   await contract.addResident(resident.address, 2102);
  //   await contract.setManager(resident.address);
  //   expect(await contract.manager()).to.equal(resident.address);
  // });

  it("Should add topic", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();
    await contract.addTopic(
      "topic 1",
      "description 1",
      Category.DECISION,
      0,
      manager.address
    );
    expect(await contract.topicExists("topic 1")).to.equal(true);
  });

  it("Should NOT add topic(permission)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();
    const instance = contract.connect(accounts[1]); //not resident in this case

    await expect(
      instance.addTopic(
        "topic 1",
        "description 1",
        Category.DECISION,
        0,
        manager.address
      )
    ).to.be.rejectedWith(
      "Only the manager or residents can call this function"
    );
  });

  it("Should NOT add topic(repeted)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();
    await contract.addTopic(
      "topic 1",
      "description 1",
      Category.DECISION,
      0,
      manager.address
    );

    await expect(
      contract.addTopic(
        "topic 1",
        "description 1",
        Category.DECISION,
        0,
        manager.address
      )
    ).to.be.rejectedWith("Topic already exists");
  });

  it("Should remove topic", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();
    await contract.addTopic(
      "topic 1",
      "description 1",
      Category.DECISION,
      0,
      manager.address
    );
    await contract.removeTopic("topic 1");
    expect(await contract.topicExists("topic 1")).to.equal(false);
  });

  it("Should NOT remove topic(permission)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();
    await contract.addResident(accounts[1].address, 2102);
    await contract.addTopic(
      "topic 1",
      "description 1",
      Category.DECISION,
      0,
      manager.address
    );
    const instance = contract.connect(accounts[1]);
    await expect(instance.removeTopic("topic 1")).to.be.rejectedWith(
      "Only manager can call this function"
    );
  });

  it("Should NOT remove topic(exists)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();

    await expect(contract.removeTopic("topic 1")).to.be.rejectedWith(
      "Topic does not exist"
    );
  });

  it("Should NOT remove topic(status)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();
    await contract.addTopic(
      "topic 1",
      "description 1",
      Category.DECISION,
      0,
      manager.address
    );

    await contract.openVoting("topic 1");

    await expect(contract.removeTopic("topic 1")).to.be.rejectedWith(
      "Only topics in IDLE status can be removed"
    );
  });

  it("Should vote", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();

    await contract.addResident(accounts[1].address, 2102);
    await contract.addTopic(
      "topic 1",
      "description 1",
      Category.DECISION,
      0,
      manager.address
    );
    await contract.openVoting("topic 1");

    const instance = contract.connect(accounts[1]);

    await instance.vote("topic 1", Options.YES);
    expect(await instance.numberOfVotes("topic 1")).to.equal(1);
  });

  it("Should NOT vote (duplicated vote)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();

    await contract.addResident(accounts[1].address, 2102);
    await contract.addTopic(
      "topic 1",
      "description 1",
      Category.DECISION,
      0,
      manager.address
    );
    await contract.openVoting("topic 1");

    const instance = contract.connect(accounts[1]);

    await instance.vote("topic 1", Options.YES);
    await expect(instance.vote("topic 1", Options.YES)).to.be.rejectedWith(
      "A residence should vote only once"
    );
  });

  it("Should NOT vote (status)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();

    await contract.addResident(accounts[1].address, 2102);
    await contract.addTopic(
      "topic 1",
      "description 1",
      Category.DECISION,
      0,
      manager.address
    );

    const instance = contract.connect(accounts[1]);

    await expect(instance.vote("topic 1", Options.YES)).to.be.rejectedWith(
      "Only VOTING topics can be voted"
    );
  });

  it("Should NOT vote (topic does not exist)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();

    await contract.addResident(accounts[1].address, 2102);

    const instance = contract.connect(accounts[1]);

    await expect(instance.vote("topic 1", Options.YES)).to.be.rejectedWith(
      "The topic does not exist"
    );
  });

  it("Should NOT vote (not resident)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();

    await contract.addTopic(
      "topic 1",
      "description 1",
      Category.DECISION,
      0,
      manager.address
    );
    await contract.openVoting("topic 1");

    const instance = contract.connect(accounts[1]);

    await expect(instance.vote("topic 1", Options.YES)).to.be.rejectedWith(
      "Only the manager or residents can call this function"
    );
  });

  it("Should NOT vote (empyt vote)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();

    await contract.addResident(accounts[1].address, 2102);
    await contract.addTopic(
      "topic 1",
      "description 1",
      Category.DECISION,
      0,
      manager.address
    );
    await contract.openVoting("topic 1");

    const instance = contract.connect(accounts[1]);

    await expect(instance.vote("topic 1", Options.EMPTY)).to.be.rejectedWith(
      "The option cannot be EMPTY"
    );
  });

  it("Should close voting", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();

    await contract.addResident(accounts[1].address, 2102);
    await contract.addTopic(
      "topic 1",
      "description 1",
      Category.DECISION,
      0,
      manager.address
    );
    await contract.openVoting("topic 1");

    await contract.vote("topic 1", Options.YES);

    await addResidents(contract, 5, accounts )

    await addVotes(contract, 5, accounts)

    await contract.closeVoting("topic 1");
    const topic = await contract.getTopic("topic 1");

    expect(topic.status).to.equal(Status.APPROVED);
  });

  it("Should NOT close voting (permission)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();

    await contract.addResident(accounts[1].address, 2102);
    await contract.addTopic(
      "topic 1",
      "description 1",
      Category.DECISION,
      0,
      manager.address
    );
    await contract.openVoting("topic 1");

    await contract.vote("topic 1", Options.YES);

    const instance = contract.connect(accounts[1]);

    await instance.vote("topic 1", Options.YES);
    await expect(instance.closeVoting("topic 1")).to.be.rejectedWith(
      "Only manager can call this function"
    );
  });

  it("Should NOT close voting (not exists)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();

    await expect(contract.closeVoting("topic 1")).to.be.rejectedWith(
      "The topic does not exist"
    );
  });

  it("Should NOT close voting (status)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();

    await contract.addTopic(
      "topic 1",
      "description 1",
      Category.DECISION,
      0,
      manager.address
    );

    await expect(contract.closeVoting("topic 1")).to.be.rejectedWith(
      "Only VOTING topis can be closed"
    );
  });

  it("Should NOT open voting (status)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();

    await contract.addResident(accounts[1].address, 2102);
    await contract.addTopic(
      "topic 1",
      "description 1",
      Category.DECISION,
      0,
      manager.address
    );

    const instance = contract.connect(accounts[1]);

    await expect(instance.openVoting("topic 1")).to.be.rejectedWith(
      "Only manager can call this function"
    );
  });
});
