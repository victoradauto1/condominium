"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
describe("Condominium", function () {
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
    async function deployCondominiumFixture() {
        const hre = require("hardhat");
        const [manager, resident] = await hre.ethers.getSigners();
        const Condominium = await hre.ethers.getContractFactory("Condominium");
        const contract = await Condominium.deploy();
        return { contract, manager, resident };
    }
    it("Should be residence", async function () {
        const { contract } = await deployCondominiumFixture();
        (0, chai_1.expect)(await contract.residenceExists(2102)).to.equal(true);
    });
    it("Should be manager", async function () {
        const { contract, manager } = await deployCondominiumFixture();
        (0, chai_1.expect)(await contract.manager()).to.equal(manager.address);
    });
    it("Should add resident", async function () {
        const { contract, manager, resident } = await deployCondominiumFixture();
        await contract.addResident(resident.address, 2102);
        (0, chai_1.expect)(await contract.isResident(resident.address)).to.equal(true);
    });
    it("Should NOT add resident (permission)", async function () {
        const { contract, resident } = await deployCondominiumFixture();
        const instance = contract.connect(resident);
        await (0, chai_1.expect)(instance.addResident(resident.address, 2102)).to.be.rejectedWith("Only the manager or the council can call this function");
    });
    it("Should NOT add resident (residence)", async function () {
        const { contract, resident } = await deployCondominiumFixture();
        await (0, chai_1.expect)(contract.addResident(resident.address, 21020)).to.be.rejectedWith("Residence does not exist");
    });
    it("Should remove resident", async function () {
        const { contract, resident } = await deployCondominiumFixture();
        await contract.addResident(resident.address, 2102);
        await contract.removeResident(resident.address);
        (0, chai_1.expect)(await contract.isResident(resident.address)).to.equal(false);
    });
    it("Should NOT remove resident (permission)", async function () {
        const { contract, resident } = await deployCondominiumFixture();
        await contract.addResident(resident.address, 2102);
        const instance = contract.connect(resident);
        await (0, chai_1.expect)(instance.removeResident(resident.address)).to.be.rejectedWith("Only manager can call this function");
    });
    it("Should NOT remove resident (counselor)", async function () {
        const { contract, resident } = await deployCondominiumFixture();
        await contract.addResident(resident.address, 2102);
        await contract.setConsuelor(resident.address, true);
        await (0, chai_1.expect)(contract.removeResident(resident.address)).to.be.rejectedWith("The council cannot be removed");
    });
    it("Should be resident", async function () {
        const { contract, resident } = await deployCondominiumFixture();
        await contract.addResident(resident.address, 2102);
        (0, chai_1.expect)(await contract.isResident(resident.address)).to.equal(true);
    });
    it("Should set Counselor", async function () {
        const { contract, resident } = await deployCondominiumFixture();
        await contract.addResident(resident.address, 2102);
        await contract.setConsuelor(resident.address, true);
        (0, chai_1.expect)(await contract.counselors(resident.address)).to.equal(true);
    });
    it("Should NOT set Counselor (permission)", async function () {
        const { contract, resident } = await deployCondominiumFixture();
        await contract.addResident(resident.address, 2102);
        const instance = contract.connect(resident);
        await (0, chai_1.expect)(instance.setConsuelor(resident.address, true)).to.be.rejectedWith("Only manager can call this function");
    });
    it("Should NOT set Counselor (not resident)", async function () {
        const { contract, resident } = await deployCondominiumFixture();
        await (0, chai_1.expect)(contract.setConsuelor(resident.address, true)).to.be.rejectedWith("The consuelor must be a resident");
    });
    // it("Should set Manager", async function () {
    //   const { contract, resident } = await deployCondominiumFixture();
    //   await contract.addResident(resident.address, 2102);
    //   await contract.setManager(resident.address);
    //   expect(await contract.manager()).to.equal(resident.address);
    // });
    it("Should add topic", async function () {
        const { contract, manager, resident } = await deployCondominiumFixture();
        await contract.addTopic("topic 1", "description 1");
        (0, chai_1.expect)(await contract.topicExists("topic 1")).to.equal(true);
    });
    it("Should NOT add topic(permission)", async function () {
        const { contract, manager, resident } = await deployCondominiumFixture();
        const instance = contract.connect(resident); //not resident in this case
        await (0, chai_1.expect)(instance.addTopic("topic 1", "description 1")).to.be.rejectedWith("Only the manager or residents can call this function");
    });
    it("Should NOT add topic(repeted)", async function () {
        const { contract, manager, resident } = await deployCondominiumFixture();
        await contract.addTopic("topic 1", "description 1");
        await (0, chai_1.expect)(contract.addTopic("topic 1", "description 1")).to.be.rejectedWith("Topic already exists");
    });
    it("Should remove topic", async function () {
        const { contract, manager, resident } = await deployCondominiumFixture();
        await contract.addTopic("topic 1", "description 1");
        await contract.removeTopic("topic 1");
        (0, chai_1.expect)(await contract.topicExists("topic 1")).to.equal(false);
    });
    it("Should NOT remove topic(permission)", async function () {
        const { contract, manager, resident } = await deployCondominiumFixture();
        await contract.addResident(resident.address, 2102);
        await contract.addTopic("topic 1", "description 1");
        const instance = contract.connect(resident);
        await (0, chai_1.expect)(instance.removeTopic("topic 1")).to.be.rejectedWith("Only manager can call this function");
    });
    it("Should NOT remove topic(exists)", async function () {
        const { contract, manager, resident } = await deployCondominiumFixture();
        await (0, chai_1.expect)(contract.removeTopic("topic 1")).to.be.rejectedWith("Topic does not exist");
    });
    it("Should NOT remove topic(status)", async function () {
        const { contract, manager, resident } = await deployCondominiumFixture();
        await contract.addTopic("topic 1", "description 1");
        await contract.openVoting("topic 1");
        await (0, chai_1.expect)(contract.removeTopic("topic 1")).to.be.rejectedWith("Only topics in IDLE status can be removed");
    });
    it("Should vote", async function () {
        const { contract, manager, resident } = await deployCondominiumFixture();
        await contract.addResident(resident.address, 2102);
        await contract.addTopic("topic 1", "description 1");
        await contract.openVoting("topic 1");
        const instance = contract.connect(resident);
        await instance.vote("topic 1", Options.YES);
        (0, chai_1.expect)(await instance.numberOfVotes("topic 1")).to.equal(1);
    });
    it("Should NOT vote (duplicated vote)", async function () {
        const { contract, manager, resident } = await deployCondominiumFixture();
        await contract.addResident(resident.address, 2102);
        await contract.addTopic("topic 1", "description 1");
        await contract.openVoting("topic 1");
        const instance = contract.connect(resident);
        await instance.vote("topic 1", Options.YES);
        await (0, chai_1.expect)(instance.vote("topic 1", Options.YES)).to.be.rejectedWith("A residence should vote only once");
    });
    it("Should NOT vote (status)", async function () {
        const { contract, manager, resident } = await deployCondominiumFixture();
        await contract.addResident(resident.address, 2102);
        await contract.addTopic("topic 1", "description 1");
        const instance = contract.connect(resident);
        await (0, chai_1.expect)(instance.vote("topic 1", Options.YES)).to.be.rejectedWith("Only VOTING topics can be voted");
    });
    it("Should NOT vote (topic does not exist)", async function () {
        const { contract, manager, resident } = await deployCondominiumFixture();
        await contract.addResident(resident.address, 2102);
        const instance = contract.connect(resident);
        await (0, chai_1.expect)(instance.vote("topic 1", Options.YES)).to.be.rejectedWith("The topic does not exist");
    });
    it("Should NOT vote (not resident)", async function () {
        const { contract, manager, resident } = await deployCondominiumFixture();
        await contract.addTopic("topic 1", "description 1");
        await contract.openVoting("topic 1");
        const instance = contract.connect(resident);
        await (0, chai_1.expect)(instance.vote("topic 1", Options.YES)).to.be.rejectedWith("Only the manager or residents can call this function");
    });
    it("Should NOT vote (empyt vote)", async function () {
        const { contract, manager, resident } = await deployCondominiumFixture();
        await contract.addResident(resident.address, 2102);
        await contract.addTopic("topic 1", "description 1");
        await contract.openVoting("topic 1");
        const instance = contract.connect(resident);
        await (0, chai_1.expect)(instance.vote("topic 1", Options.EMPTY)).to.be.rejectedWith("The option cannot be EMPTY");
    });
    it("Should close voting", async function () {
        const { contract, manager, resident } = await deployCondominiumFixture();
        await contract.addResident(resident.address, 2102);
        await contract.addTopic("topic 1", "description 1");
        await contract.openVoting("topic 1");
        await contract.vote("topic 1", Options.YES);
        const instance = contract.connect(resident);
        await instance.vote("topic 1", Options.YES);
        await contract.closeVoting("topic 1");
        const topic = await contract.getTopic("topic 1");
        (0, chai_1.expect)(topic.status).to.equal(Status.APPROVED);
    });
    it("Should NOT close voting (permission)", async function () {
        const { contract, manager, resident } = await deployCondominiumFixture();
        await contract.addResident(resident.address, 2102);
        await contract.addTopic("topic 1", "description 1");
        await contract.openVoting("topic 1");
        await contract.vote("topic 1", Options.YES);
        const instance = contract.connect(resident);
        await instance.vote("topic 1", Options.YES);
        await (0, chai_1.expect)(instance.closeVoting("topic 1")).to.be.rejectedWith("Only manager can call this function");
    });
    it("Should NOT close voting (not exists)", async function () {
        const { contract, manager, resident } = await deployCondominiumFixture();
        await (0, chai_1.expect)(contract.closeVoting("topic 1")).to.be.rejectedWith("The topic does not exist");
    });
    it("Should NOT close voting (status)", async function () {
        const { contract, manager, resident } = await deployCondominiumFixture();
        await contract.addTopic("topic 1", "description 1");
        await (0, chai_1.expect)(contract.closeVoting("topic 1")).to.be.rejectedWith("Only VOTING topis can be closed");
    });
    it("Should NOT open voting (status)", async function () {
        const { contract, manager, resident } = await deployCondominiumFixture();
        await contract.addResident(resident.address, 2102);
        await contract.addTopic("topic 1", "description 1");
        const instance = contract.connect(resident);
        await (0, chai_1.expect)(instance.openVoting("topic 1")).to.be.rejectedWith("Only manager can call this function");
    });
});
//# sourceMappingURL=Condominium.test.js.map