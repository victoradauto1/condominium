import { expect } from "chai";
import exp from "constants";
import hre from "hardhat";

describe("Condominium", function () {
 
  async function deployCondominiumFixture() {
  
    const [manager, resident] = await hre.ethers.getSigners();

    const Condominium = await hre.ethers.getContractFactory("Condominium");
    const contract = await Condominium.deploy();

    return {contract, manager, resident };
  }

  it("Should be residence", async function () {
    const { contract, manager, resident } = await deployCondominiumFixture();
    expect(await contract.residenceExists(2102)).to.equal(true);
  });

  it("Should be manager", async function () {
    const { contract, manager, resident } = await deployCondominiumFixture();
    expect(await contract.manager()).to.equal(manager.address);
  });

  it("Should add resident", async function () {
    const { contract, manager, resident } = await deployCondominiumFixture();
    await contract.addResident(resident.address, 2102);
    expect(await contract.isResident(resident.address)).to.equal(true);
  });

  it("Should NOT add resident (permission)", async function () {
    const { contract, manager, resident } = await deployCondominiumFixture();
    const instance = contract.connect(resident);
    await expect( instance.addResident(resident.address, 2102)).to.be.revertedWith("Only the manager can add residents");
  });

  it("Should NOT add resident (residence)", async function () {
    const { contract, manager, resident } = await deployCondominiumFixture();
    await expect( contract.addResident(resident.address, 21020)).to.be.revertedWith("Residence does not exist");
  });

  it("Should remove resident", async function () {
    const { contract, manager, resident } = await deployCondominiumFixture();
    await contract.addResident(resident.address, 2102);
    await contract.removeResident(resident.address);

    expect(await contract.isResident(resident.address)).to.equal(false);
  });

  it("Should NOT remove resident(permission)", async function () {
    const { contract, manager, resident } = await deployCondominiumFixture();
    await contract.addResident(resident.address, 2102);

    const instance = contract.connect(resident);  

    expect(await instance.removeResident(resident.address)).to.be.revertedWith("Only the manager can remove residents");
  });

  // it("Should NOT remove resident(consuelor)", async function () {
  //   const { contract, manager, resident } = await deployCondominiumFixture();
  //   await contract.addResident(resident.address, 2102);

  // });

  it("Should be resident", async function () {
    const { contract, manager, resident } = await deployCondominiumFixture();
    expect( await contract.isResident(resident.address)).to.equal(true);
  })

  
});
