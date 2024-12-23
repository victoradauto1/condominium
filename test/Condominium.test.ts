import { expect } from "chai";
import hre from "hardhat";

describe("Condominium", function () {
 
  async function deployCondominiumFixture() {
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
      .to.be.revertedWith("Only the manager or the council can call this function");
  });

  it("Should NOT add resident (residence)", async function () {
    const { contract, resident } = await deployCondominiumFixture();
    await expect(contract.addResident(resident.address, 21020))
      .to.be.revertedWith("Residence does not exist");
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
      .to.be.revertedWith("Only manager can call this function");
  });

  it("Should NOT remove resident (counselor)", async function () {
    const { contract, resident } = await deployCondominiumFixture();
    await contract.addResident(resident.address, 2102);
    await contract.setConsuelor(resident.address, true);
    await expect(contract.removeResident(resident.address))
      .to.be.revertedWith("The council cannot be removed");
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
      .to.be.revertedWith("Only manager can call this function");
  });

  it("Should NOT set Counselor (not resident)", async function () {
    const { contract, resident } = await deployCondominiumFixture();
    await expect(contract.setConsuelor(resident.address, true))
      .to.be.revertedWith("The consuelor must be a resident");
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
      .to.be.revertedWith("Only manager can call this function");
  });

  it("Should NOT set Manager (Invalid address)", async function () {
    const { contract } = await deployCondominiumFixture();
    await expect(contract.setManager("0x0000000000000000000000000000000000000000"))
      .to.be.revertedWith("The address must be valid");
  });

  it("Should add topic", async function () {
    const { contract, manager, resident } = await deployCondominiumFixture();
    await contract.addTopic("topic 1", "description 1");
    expect(await contract.topicExists("topic 1")).to.equal(true);
  });

  it("Should NOT add topic(permission)", async function () {
    const { contract, manager, resident } = await deployCondominiumFixture();
    const instance = contract.connect(resident);//not resident in this case
    
    await expect(instance.addTopic("topic 1", "description 1")).to.be.revertedWith("Only the manager or the council can call this function");
  });

  it("Should NOT add topic(repeted)", async function () {
    const { contract, manager, resident } = await deployCondominiumFixture();
    await contract.addTopic("topic 1", "description 1");

    await expect(contract.addTopic("topic 1", "description 1")).to.be.revertedWith("Topic already exists");
  });

  it("Should remove topic", async function () {
    const { contract, manager, resident } = await deployCondominiumFixture();
    await contract.addTopic("topic 1", "description 1");
    await contract.removeTopic("topic 1")
    expect(await contract.topicExists("topic 1")).to.equal(false);
  });

  it("Should NOT remove topic(permission)", async function () {
    const { contract, manager, resident } = await deployCondominiumFixture();
    await contract.addTopic("topic 1", "description 1");
    const instance = contract.connect(resident);
    await expect(instance.removeTopic("topic 1")).to.be.revertedWith("Only the manager or the council can call this function")
  });

  it("Should NOT remove topic(exists)", async function () {
    const { contract, manager, resident } = await deployCondominiumFixture();
   
    await expect(contract.removeTopic("topic 1")).to.be.revertedWith("Topic does not exist")
  });

  it("Should NOT remove topic(status)", async function () {
    const { contract, manager, resident } = await deployCondominiumFixture();
    await contract.addTopic('topic 1', 'description 1');

    await expect(contract.removeTopic("topic 1")).to.be.revertedWith("Topic does not exist")
  });


});