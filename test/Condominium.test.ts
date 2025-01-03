import { expect } from "chai";


describe("Condominium", function () {

  enum Options {
    EMPTY = 0,
    YES = 1,
    NO = 2,
    ABSTENTION = 3
  } //0,1,2,3

  enum Status {
    IDLE = 0,
    VOTING = 1,
    APPROVED = 2,
    DENIED = 3
} //0,1,2,3

  async function deployCondominiumFixture() {
    const hre = require("hardhat"); 
    const [manager, resident] = await hre.ethers.getSigners();
    const Condominium = await hre.ethers.getContractFactory("Condominium");
    const contract = await Condominium.deploy();
    return { contract, manager, resident };
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
    const { contract, manager, resident } = await deployCondominiumFixture();
    await contract.addResident(resident.address, 2102);
    expect(await contract.isResident(resident.address)).to.equal(true);
  });

  it("Should NOT add resident (permission)", async function () {
    const { contract, resident } = await deployCondominiumFixture();
    const instance = contract.connect(resident);
    await expect(instance.addResident(resident.address, 2102))
      .to.be.rejectedWith("Only the manager or the council can call this function");
  });

  it("Should NOT add resident (residence)", async function () {
    const { contract, resident } = await deployCondominiumFixture();
    await expect(contract.addResident(resident.address, 21020))
      .to.be.rejectedWith("Residence does not exist");
  });

  it("Should remove resident", async function () {
    const { contract, resident } = await deployCondominiumFixture();
    await contract.addResident(resident.address, 2102);
    await contract.removeResident(resident.address);
    expect(await contract.isResident(resident.address)).to.equal(false);
  });

  it("Should NOT remove resident (permission)", async function () {
    const { contract, resident } = await deployCondominiumFixture();
    await contract.addResident(resident.address, 2102);
    const instance = contract.connect(resident);
    await expect(instance.removeResident(resident.address))
      .to.be.rejectedWith("Only manager can call this function");
  });

  it("Should NOT remove resident (counselor)", async function () {
    const { contract, resident } = await deployCondominiumFixture();
    await contract.addResident(resident.address, 2102);
    await contract.setConsuelor(resident.address, true);
    await expect(contract.removeResident(resident.address))
      .to.be.rejectedWith("The council cannot be removed");
  });

  it("Should be resident", async function () {
    const { contract, resident } = await deployCondominiumFixture();
    await contract.addResident(resident.address, 2102);
    expect(await contract.isResident(resident.address)).to.equal(true);
  });

  it("Should set Counselor", async function () {
    const { contract, resident } = await deployCondominiumFixture();
    await contract.addResident(resident.address, 2102);
    await contract.setConsuelor(resident.address, true);
    expect(await contract.counselors(resident.address)).to.equal(true);
  });

  it("Should NOT set Counselor (permission)", async function () {
    const { contract, resident } = await deployCondominiumFixture();
    await contract.addResident(resident.address, 2102);
    const instance = contract.connect(resident);
    await expect(instance.setConsuelor(resident.address, true))
      .to.be.rejectedWith("Only manager can call this function");
  });

  it("Should NOT set Counselor (not resident)", async function () {
    const { contract, resident } = await deployCondominiumFixture();
    await expect(contract.setConsuelor(resident.address, true))
      .to.be.rejectedWith("The consuelor must be a resident");
  });

  it("Should set Manager", async function () {
    const { contract, resident } = await deployCondominiumFixture();
    await contract.addResident(resident.address, 2102);
    await contract.setManager(resident.address);
    expect(await contract.manager()).to.equal(resident.address);
  });

  it("Should NOT set Manager (permission)", async function () {
    const { contract, resident } = await deployCondominiumFixture();
    const instance = contract.connect(resident);
    await expect(instance.setManager(resident.address))
      .to.be.rejectedWith("Only manager can call this function");
  });

  it("Should NOT set Manager (Invalid address)", async function () {
    const { contract } = await deployCondominiumFixture();
    await expect(contract.setManager("0x0000000000000000000000000000000000000000"))
      .to.be.rejectedWith("The address must be valid");
  });

  it("Should add topic", async function () {
    const { contract, manager, resident } = await deployCondominiumFixture();
    await contract.addTopic("topic 1", "description 1");
    expect(await contract.topicExists("topic 1")).to.equal(true);
  });

  it("Should NOT add topic(permission)", async function () {
    const { contract, manager, resident } = await deployCondominiumFixture();
    const instance = contract.connect(resident);//not resident in this case

    await expect(instance.addTopic("topic 1", "description 1")).to.be.rejectedWith("Only the manager or residents can call this function");
  });

  it("Should NOT add topic(repeted)", async function () {
    const { contract, manager, resident } = await deployCondominiumFixture();
    await contract.addTopic("topic 1", "description 1");

    await expect(contract.addTopic("topic 1", "description 1")).to.be.rejectedWith("Topic already exists");
  });

  it("Should remove topic", async function () {
    const { contract, manager, resident } = await deployCondominiumFixture();
    await contract.addTopic("topic 1", "description 1");
    await contract.removeTopic("topic 1")
    expect(await contract.topicExists("topic 1")).to.equal(false);
  });

  it("Should NOT remove topic(permission)", async function () {
    const { contract, manager, resident } = await deployCondominiumFixture();
    await contract.addResident(resident.address, 2102);
    await contract.addTopic("topic 1", "description 1");
    const instance = contract.connect(resident);
    await expect(instance.removeTopic("topic 1")).to.be.rejectedWith( "Only manager can call this function");
  });

  it("Should NOT remove topic(exists)", async function () {
    const { contract, manager, resident } = await deployCondominiumFixture();

    await expect(contract.removeTopic("topic 1")).to.be.rejectedWith("Topic does not exist")
  });

  it("Should NOT remove topic(status)", async function () {
    const { contract, manager, resident } = await deployCondominiumFixture();
    await contract.addTopic('topic 1', 'description 1');

    await contract.openVoting('topic 1');

    await expect(contract.removeTopic("topic 1")).to.be.rejectedWith("Only topics in IDLE status can be removed");
  });

  it("Should vote", async function () {
    const { contract, manager, resident } = await deployCondominiumFixture();

    await contract.addResident(resident.address, 2102);
    await contract.addTopic('topic 1', 'description 1');
    await contract.openVoting("topic 1");

    const instance = contract.connect(resident);

    await instance.vote('topic 1', Options.YES);
    expect(await instance.numberOfVotes('topic 1')).to.equal(1);
  });

  it("Should NOT vote (duplicated vote)", async function () {
    const { contract, manager, resident } = await deployCondominiumFixture();

    await contract.addResident(resident.address, 2102);
    await contract.addTopic('topic 1', 'description 1');
    await contract.openVoting("topic 1");

    const instance = contract.connect(resident);

    await instance.vote('topic 1', Options.YES);
    await expect(instance.vote('topic 1', Options.YES)).to.be.rejectedWith("A residence should vote only once");
    
  });

  it("Should NOT vote (status)", async function () {
    const { contract, manager, resident } = await deployCondominiumFixture();

    await contract.addResident(resident.address, 2102);
    await contract.addTopic('topic 1', 'description 1');

    const instance = contract.connect(resident);

    await expect(instance.vote('topic 1', Options.YES)).to.be.rejectedWith("Only VOTING topics can be voted");
    
  });

  it("Should NOT vote (topic does not exist)", async function () {
    const { contract, manager, resident } = await deployCondominiumFixture();
    
    await contract.addResident(resident.address, 2102);

    const instance = contract.connect(resident);

    await expect(instance.vote('topic 1', Options.YES)).to.be.rejectedWith("The topic does not exist");
    
  });

  it("Should NOT vote (not resident)", async function () {
    const { contract, manager, resident } = await deployCondominiumFixture();

    await contract.addTopic('topic 1', 'description 1');
    await contract.openVoting("topic 1");

    const instance = contract.connect(resident);

    await expect(instance.vote('topic 1', Options.YES)).to.be.rejectedWith("Only the manager or residents can call this function");
    
  });

  it("Should NOT vote (empyt vote)", async function () {
    const { contract, manager, resident } = await deployCondominiumFixture();

    await contract.addResident(resident.address, 2102);
    await contract.addTopic('topic 1', 'description 1');
    await contract.openVoting("topic 1");

    const instance = contract.connect(resident);

    await expect(instance.vote('topic 1', Options.EMPTY)).to.be.rejectedWith("The option cannot be EMPTY");
    
  });

  it("Should close voting", async function () {
    const { contract, manager, resident } = await deployCondominiumFixture();

    await contract.addResident(resident.address, 2102);
    await contract.addTopic('topic 1', 'description 1');
    await contract.openVoting("topic 1");

    await contract.vote("topic 1", Options.YES);

    const instance = contract.connect(resident);

    await instance.vote('topic 1', Options.YES);

    await contract.closeVoting("topic 1");
    const topic = await contract.getTopic("topic 1");

    expect(topic.status).to.equal(Status.APPROVED);
  });

  it("Should NOT close voting (permission)", async function () {
    const { contract, manager, resident } = await deployCondominiumFixture();

    await contract.addResident(resident.address, 2102);
    await contract.addTopic('topic 1', 'description 1');
    await contract.openVoting("topic 1");

    await contract.vote("topic 1", Options.YES);

    const instance = contract.connect(resident);

    await instance.vote('topic 1', Options.YES);
    await expect(instance.closeVoting("topic 1")).to.be.rejectedWith("Only manager can call this function");
  });

  it("Should NOT close voting (not exists)", async function () {
    const { contract, manager, resident } = await deployCondominiumFixture();

    await expect(contract.closeVoting("topic 1")).to.be.rejectedWith("The topic does not exist");
  });

  it("Should NOT close voting (status)", async function () {
    const { contract, manager, resident } = await deployCondominiumFixture();

    await contract.addTopic('topic 1', 'description 1');

    await expect(contract.closeVoting("topic 1")).to.be.rejectedWith("Only VOTING topis can be closed");
  });

  it("Should NOT open voting (status)", async function () {
    const { contract, manager, resident } = await deployCondominiumFixture();

    await contract.addResident(resident.address, 2102);
    await contract.addTopic('topic 1', 'description 1');

    const instance = contract.connect(resident)

    await expect(instance.openVoting("topic 1")).to.be.rejectedWith("Only manager can call this function");
  });
});