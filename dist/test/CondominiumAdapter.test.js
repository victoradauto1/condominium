"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
describe("CondominiumAdapter", function () {
    let Options;
    (function (Options) {
        Options[Options["EMPTY"] = 0] = "EMPTY";
        Options[Options["YES"] = 1] = "YES";
        Options[Options["NO"] = 2] = "NO";
        Options[Options["ABSTENTION"] = 3] = "ABSTENTION";
    })(Options || (Options = {})); //0,1,2,3
    let Status;
    (function (Status) {
        Status[Status["IDLE"] = 0] = "IDLE";
        Status[Status["VOTING"] = 1] = "VOTING";
        Status[Status["APPROVED"] = 2] = "APPROVED";
        Status[Status["DENIED"] = 3] = "DENIED";
    })(Status || (Status = {})); //0,1,2,3
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
        (0, chai_1.expect)(implementationAddress).to.equal(contractAddress);
    });
    it("Should NOT upgrade (permission)", async function () {
        const { adapter, manager, accounts } = await deployAdapterFixture();
        const { contract, contractAddress } = await deployImplementationFixture();
        const instance = adapter.connect(accounts[1]);
        await (0, chai_1.expect)(instance.upgrade(contractAddress)).to.be.rejectedWith("You do not have permission");
    });
    it("Should add resident", async function () {
        const { adapter, manager, accounts } = await deployAdapterFixture();
        const { contract, contractAddress } = await deployImplementationFixture();
        await adapter.upgrade(contractAddress);
        await adapter.addResident(accounts[1].address, 1301);
        (0, chai_1.expect)(await contract.isResident(accounts[1].address)).to.equal(true);
    });
    it("Should remove resident", async function () {
        const { adapter, manager, accounts } = await deployAdapterFixture();
        const { contract, contractAddress } = await deployImplementationFixture();
        await adapter.upgrade(contractAddress);
        await adapter.addResident(accounts[1].address, 1301);
        await adapter.removeResident(accounts[1].address);
        (0, chai_1.expect)(await contract.isResident(accounts[1].address)).to.equal(false);
    });
    it("Should set counseler", async function () {
        const { adapter, manager, accounts } = await deployAdapterFixture();
        const { contract, contractAddress } = await deployImplementationFixture();
        await adapter.upgrade(contractAddress);
        await adapter.addResident(accounts[1].address, 1301);
        await adapter.setConsuelor(accounts[1].address, true);
        (0, chai_1.expect)(await contract.counselors(accounts[1].address)).to.equal(true);
    });
    it("Should add topic", async function () {
        const { adapter, manager, accounts } = await deployAdapterFixture();
        const { contract, contractAddress } = await deployImplementationFixture();
        await adapter.upgrade(contractAddress);
        await adapter.addTopic("topic 1", "descripiton 1");
        (0, chai_1.expect)(await contract.topicExists("topic 1")).to.equal(true);
    });
    it("Should remove topic", async function () {
        const { adapter, manager, accounts } = await deployAdapterFixture();
        const { contract, contractAddress } = await deployImplementationFixture();
        await adapter.upgrade(contractAddress);
        await adapter.addTopic("topic 1", "descripiton 1");
        await adapter.removeTopic("topic 1");
        (0, chai_1.expect)(await contract.topicExists("topic 1")).to.equal(false);
    });
    it("Should open voting", async function () {
        const { adapter, manager, accounts } = await deployAdapterFixture();
        const { contract, contractAddress } = await deployImplementationFixture();
        await adapter.upgrade(contractAddress);
        await adapter.addTopic("topic 1", "descripiton 1");
        await adapter.openVoting("topic 1");
        const topic = await contract.getTopic("topic 1");
        (0, chai_1.expect)(topic.status).to.equal(Status.VOTING);
    });
    it("Should vote", async function () {
        const { adapter, manager, accounts } = await deployAdapterFixture();
        const { contract, contractAddress } = await deployImplementationFixture();
        await adapter.upgrade(contractAddress);
        await adapter.addResident(accounts[1].address, 1301);
        await adapter.addTopic("topic 1", "descripiton 1");
        await adapter.openVoting("topic 1");
        const instance = adapter.connect(accounts[1]);
        await instance.vote("topic 1", Options.NO);
        (0, chai_1.expect)(await contract.numberOfVotes("topic 1")).to.equal(1);
    });
    it("Should close voting", async function () {
        const { adapter, manager, accounts } = await deployAdapterFixture();
        const { contract, contractAddress } = await deployImplementationFixture();
        await adapter.upgrade(contractAddress);
        await adapter.addResident(accounts[1].address, 1301);
        await adapter.addTopic("topic 1", "descripiton 1");
        await adapter.openVoting("topic 1");
        const instance = adapter.connect(accounts[1]);
        await instance.vote("topic 1", Options.NO);
        await adapter.closeVoting("topic 1");
        const topic = await contract.getTopic("topic 1");
        (0, chai_1.expect)(topic.status).to.equal(Status.DENIED);
    });
});
//# sourceMappingURL=CondominiumAdapter.test.js.map