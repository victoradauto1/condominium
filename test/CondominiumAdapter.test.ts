import { expect } from "chai";


describe("CondominiumAdapter", function () {

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

  async function deployAdapterFixture() {
    const hre = require("hardhat"); 
    const accounts = await hre.ethers.getSigners();
    const manager = accounts[0];
    const CondominiumAdapter = await hre.ethers.getContractFactory("CondominiumAdapter");
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
    await expect(instance.upgrade(contractAddress)).to.be.rejectedWith("You do not have permission");
    
});


});