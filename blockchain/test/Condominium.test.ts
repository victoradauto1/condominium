import { SignerWithAddress} from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { Condominium } from "../typechain-types";
import { ethers, ZeroAddress } from "ethers";
import {time} from "@nomicfoundation/hardhat-network-helpers";

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
    SPENT = 4,
  } //0,1,2,3

  enum Category {
    DECISION = 0,
    SPENT = 1,
    CHANGE_QUOTA = 2,
    CHANGE_MANAGER = 3,
  } //0,1,2,3

  type Resident = {
    wallet: string;
    residence: number;
    isCounselor: boolean;
    isManager: boolean;
    nextPayment: number;
  };
  
  type Topic = {
    title: string;
    description: string;
    status: number;
    createdDate: number;
    startDate: number;
    endDate: number;
    category: number;
    amount: number;
    responsible: string;
  }; 

  type Vote = {
    resident: string;
    residence: number;
    option: number;
    timestamp: number;
  };
  

  async function addResidents(
    contract: Condominium,
    count: number,
    accounts: SignerWithAddress[]
  ) {

    const skip = count < 20? 0: 1;
    for (let i = 1; i <= count; i++) {
      const residenceId =
        1000 * Math.ceil(i / 25) +
        100 * Math.ceil(i / 5) +
        (i - 5 * Math.floor((i - 1) / 5));
      await contract.addResident(accounts[i - skip].address, residenceId);

      const instance = contract.connect(accounts[i - skip]);
      await instance.payQuota(residenceId, {
        value: ethers.parseEther("0.01"),
      });
    }
  }

  async function addVotes(
    contract: Condominium,
    count: number,
    accounts: SignerWithAddress[],
    shouldApproved: boolean = true
  ) {
    const skip = count < 20? 0: 1;
    for (let i = 1; i <= count; i++) {
      const instance = contract.connect(accounts[i - skip]);
      await instance.vote("topic 1", shouldApproved ? Options.YES : Options.NO);
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

  it("Should allow counselor to add resident", async function () {
    const { contract, accounts } = await deployCondominiumFixture();

    // Adiciona um residente que será conselheiro
    await contract.addResident(accounts[1].address, 2102);
    await contract.setConsuelor(accounts[1].address, true);

    // Conecta como conselheiro e tenta adicionar novo residente
    const counselorInstance = contract.connect(accounts[1]);
    await counselorInstance.addResident(accounts[2].address, 2103);

    // Verifica se o residente foi adicionado
    expect(await contract.isResident(accounts[2].address)).to.equal(true);
  });

  it("Should NOT allow non-counselor to add resident", async function () {
    const { contract, accounts } = await deployCondominiumFixture();

    // Adiciona um residente normal (não conselheiro)
    await contract.addResident(accounts[1].address, 2102);

    // Conecta como residente normal e tenta adicionar novo residente
    const residentInstance = contract.connect(accounts[1]);
    await expect(
      residentInstance.addResident(accounts[2].address, 2103)
    ).to.be.rejectedWith(
      "Only the manager or the council can call this function"
    );
  });

  it("Should add resident", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();
    await contract.addResident(accounts[1].address, 2102);
    expect(await contract.isResident(accounts[1].address)).to.equal(true);
  });

  it("Should get residents page", async function () {
    const { contract, accounts } = await deployCondominiumFixture();
    // Adiciona 15 residentes para testar paginação
    await addResidents(contract, 15, accounts);

    // Testa primeira página com 10 residentes
    const page1 = await contract.getResidents(1, 10);
    expect(page1.residents.length).to.equal(10);
    expect(page1.total).to.equal(15);

    // Testa segunda página com 5 residentes restantes
    const page2 = await contract.getResidents(2, 10);
    expect(page2.residents.length).to.equal(10); // Deve retornar array do tamanho solicitado
    expect(
      page2.residents.filter((r: Resident) => r.wallet !== ethers.ZeroAddress).length
    ).to.equal(5); // Mas apenas 5 endereços válidos
    expect(page2.total).to.equal(15);
  });

  it("Should get empty residents page when no residents", async function () {
    const { contract } = await deployCondominiumFixture();

    const page = await contract.getResidents(1, 10);
    expect(page.residents.length).to.equal(10); // Retorna array do tamanho solicitado
    expect(
      page.residents.filter((r: Resident) => r.wallet !== ethers.ZeroAddress).length
    ).to.equal(0); // Mas sem endereços válidos
    expect(page.total).to.equal(0);
  });

  it("Should NOT add resident (address)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();
    await expect(
      contract.addResident(ethers.ZeroAddress, 2102)
    ).to.be.rejectedWith("Invalid address");
  });

  it("Should NOT add resident (permission)", async function () {
    const { contract, accounts } = await deployCondominiumFixture();
    await contract.addResident(accounts[2].address, 1201);
    await contract.setConsuelor(accounts[2].address, true);
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
    await contract.addResident(accounts[2].address, 2105);
    await contract.removeResident(accounts[1].address);
    expect(await contract.isResident(accounts[1].address)).to.equal(false);
  });

  it("Should NOT remove resident (permission)", async function () {
    const { contract, accounts } = await deployCondominiumFixture();
    await contract.addResident(accounts[1].address, 2102);
    const instance = contract.connect(accounts[1]);
    await expect(
      instance.removeResident(accounts[1].address)
    ).to.be.rejectedWith("Only manager can call this function");
  });

  it("Should NOT remove resident (counselor)", async function () {
    const { contract, accounts } = await deployCondominiumFixture();
    await contract.addResident(accounts[1].address, 2102);
    await contract.setConsuelor(accounts[1].address, true);
    await expect(
      contract.removeResident(accounts[1].address)
    ).to.be.rejectedWith("The council cannot be removed");
  });

  it("Should be resident", async function () {
    const { contract, accounts } = await deployCondominiumFixture();
    await contract.addResident(accounts[1].address, 2102);
    expect(await contract.isResident(accounts[1].address)).to.equal(true);
  });

  it("Should add Counselor", async function () {
    const { contract, accounts, manager } = await deployCondominiumFixture();
    await contract.addResident(accounts[1].address, 2102);
    await contract.setConsuelor(accounts[1].address, true);
    const resident = await contract.getResident(accounts[1].address);

    expect(resident.isCounselor).to.equal(true);
  });

  it("Should NOT add Counselor(address)", async function () {
    const { contract, accounts, manager } = await deployCondominiumFixture();
    await contract.addResident(accounts[1].address, 2102);
    await expect(
      contract.setConsuelor(ethers.ZeroAddress, true)
    ).to.be.rejectedWith("Invalid address");
  });

  it("Should remove Counselor (first)", async function () {
    const { contract, accounts, manager } = await deployCondominiumFixture();
    await contract.addResident(accounts[1].address, 2102);
    await contract.addResident(accounts[2].address, 2104);
    await contract.setConsuelor(accounts[1].address, true);
    await contract.setConsuelor(accounts[2].address, true);
    await contract.setConsuelor(accounts[1].address, false);
    const resident = await contract.getResident(accounts[1].address);

    expect(resident.isCounselor).to.equal(false);
  });

  it("Should remove Counselor (last)", async function () {
    const { contract, accounts, manager } = await deployCondominiumFixture();
    await contract.addResident(accounts[1].address, 2102);
    await contract.addResident(accounts[2].address, 2104);
    await contract.setConsuelor(accounts[1].address, true);
    await contract.setConsuelor(accounts[2].address, true);
    await contract.setConsuelor(accounts[2].address, false);
    const resident = await contract.getResident(accounts[2].address);

    expect(resident.isCounselor).to.equal(false);
  });

  it("Should remove Counselor (not last)", async function () {
    const { contract, accounts, manager } = await deployCondominiumFixture();
    await contract.addResident(accounts[1].address, 2102);
    await contract.addResident(accounts[2].address, 2104);
    await contract.addResident(accounts[3].address, 2104);
    await contract.setConsuelor(accounts[1].address, true);
    await contract.setConsuelor(accounts[2].address, true);
    await contract.setConsuelor(accounts[3].address, true);
    await contract.setConsuelor(accounts[2].address, false);
    const resident = await contract.getResident(accounts[2].address);

    expect(resident.isCounselor).to.equal(false);
  })

  it("Should NOT remove Counselor(permission)", async function () {
    const { contract, accounts, manager } = await deployCondominiumFixture();
    await contract.addResident(accounts[1].address, 2102);
    await contract.setConsuelor(accounts[1].address, true);

    const instance  = contract.connect(accounts[3]);
    await expect(instance.setConsuelor(accounts[1].address, false)).to.be.rejectedWith("Only manager can call this function");
  });

  it("Should NOT remove Counselor(not found)", async function () {
    const { contract, accounts, manager } = await deployCondominiumFixture();

    await contract.addResident(accounts[1].address, 2102);
    await contract.setConsuelor(accounts[1].address, true);

    await contract.addResident(accounts[2].address, 2202);
    await contract.setConsuelor(accounts[2].address, true);

    await contract.addResident(accounts[3].address, 1102);

    await expect(contract.setConsuelor(accounts[3], false)).to.be.rejectedWith("Counselor not found");
  });

  it("Should NOT remove Counselor(not found - nothing registered)", async function () {
    const { contract, accounts, manager } = await deployCondominiumFixture();

    await expect(contract.setConsuelor(accounts[3], false)).to.be.rejectedWith("Counselor not found");
  });

  it("Should NOT remove Counselor(invalid address)", async function () {
    const { contract, accounts, manager } = await deployCondominiumFixture();
    await contract.addResident(accounts[1].address, 2102);
    await contract.setConsuelor(accounts[1].address, true);
    await expect(contract.setConsuelor(ZeroAddress, false)).to.be.rejectedWith("Invalid address");
  });

  it("Should NOT add Counselor (permission)", async function () {
    const { contract, accounts } = await deployCondominiumFixture();
    await contract.addResident(accounts[1].address, 2102);
    const instance = contract.connect(accounts[1]);
    await expect(
      instance.setConsuelor(accounts[1].address, true)
    ).to.be.rejectedWith("Only manager can call this function");
  });

  it("Should NOT add Counselor (not resident)", async function () {
    const { contract, accounts } = await deployCondominiumFixture();
    await expect(
      contract.setConsuelor(accounts[1].address, true)
    ).to.be.rejectedWith("The consuelor must be a resident");
  });

  it("Should change Manager (resident)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();
    await addResidents(contract, 15, accounts);
    await contract.addTopic(
      "topic 1",
      "description 1",
      Category.CHANGE_MANAGER,
      0,
      accounts[7].address
    );
    await contract.openVoting("topic 1");
    await addVotes(contract, 15, accounts);
    await contract.closeVoting("topic 1");
    expect(await contract.manager()).to.equal(accounts[7].address);
  });

  it("Should change Manager (not resident)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();
    await addResidents(contract, 15, accounts);
    const externalAddress = "0x6e086E6f338Ed493196326d4Ade46fe02EDAeCB7"
    await contract.addTopic(
      "topic 1",
      "description 1",
      Category.CHANGE_MANAGER,
      0,
      externalAddress
    );
    await contract.openVoting("topic 1");
    await addVotes(contract, 15, accounts);
    await contract.closeVoting("topic 1");
    expect(await contract.manager()).to.equal("0x6e086E6f338Ed493196326d4Ade46fe02EDAeCB7");
  });

  it("Should change Quota", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();
    await addResidents(contract, 20, accounts);
    const value = ethers.parseEther("0.02");
    await contract.addTopic(
      "topic 1",
      "description 1",
      Category.CHANGE_QUOTA,
      value,
      manager.address
    );
    await contract.openVoting("topic 1");
    await addVotes(contract, 20, accounts);
    await contract.closeVoting("topic 1");
    expect(await contract.monthlyQuota()).to.equal(value);
  });

  it("Should get topic", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();
    await contract.addTopic(
      "topic 1",
      "description 1",
      Category.DECISION,
      0,
      manager.address
    );

    await contract.addTopic(
      "topic 2",
      "description 2",
      Category.DECISION,
      0,
      manager.address
    );
    const topic = await contract.getTopic("topic 1");
    expect(topic.title).to.equal("topic 1");
  });

  it("Should get topics page", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();
    
    // Adiciona 15 tópicos para testar paginação
    for (let i = 1; i <= 15; i++) {
        await contract.addTopic(
            `topic ${i}`,
            `description ${i}`,
            Category.DECISION,
            0,
            manager.address
        );
    }
    
    // Testa primeira página com 10 tópicos
    const page1 = await contract.getTopics(1, 10);
    expect(page1.topics.length).to.equal(10);
    expect(page1.total).to.equal(15); // Agora verifica o número total correto de tópicos
    
    // Testa segunda página com 5 tópicos restantes
    const page2 = await contract.getTopics(2, 10);
    expect(page2.topics.length).to.equal(10);
    expect(page2.topics.filter((t: Topic)=> t.title !== "").length).to.equal(5);
    expect(page2.total).to.equal(15);
});
  it("Should get empty topics page when no topics", async function () {
    const { contract } = await deployCondominiumFixture();

    const page = await contract.getTopics(1, 10);
    expect(page.topics.length).to.equal(10);
    expect(page.topics.filter((t:Topic) => t.title !== "").length).to.equal(0);
  });

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

  it("Should NOT add topic(amount)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();
    await expect(
      contract.addTopic(
        "topic 1",
        "description 1",
        Category.DECISION,
        2,
        manager.address
      )
    ).to.be.rejectedWith("Wrong category");
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

  it("Should edit topic(filled description)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();
    await contract.addTopic(
      "topic 1",
      "description 1",
      Category.DECISION,
      0,
      manager.address
    );
    await contract.editTopic(
      "topic 1",
      "New Description 1",
      0,
      manager.address
    );

    const topic = await contract.getTopic("topic 1");
    expect(topic.description === "New Description 1").to.equal(true);
  });

  it("Should edit topic(empty description)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();
    await contract.addTopic(
      "topic 1",
      "description 1",
      Category.DECISION,
      0,
      manager.address
    );
    await contract.editTopic("topic 1", "", 0, manager.address);

    const topic = await contract.getTopic("topic 1");
    expect(topic.description).to.equal("description 1");
  });

  it("Should edit topic(amount)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();
    await contract.addTopic(
      "topic 1",
      "description 1",
      Category.SPENT,
      30,
      manager.address
    );
    await contract.editTopic("topic 1", "description 1", 40, manager.address);

    const topic = await contract.getTopic("topic 1");
    expect(topic.amount === 40n).to.equal(true);
  });

  it("Should NOT edit topic(permission)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();
    await contract.addTopic(
      "topic 1",
      "description 1",
      Category.DECISION,
      0,
      manager.address
    );

    await contract.addResident(accounts[2], 1302);
    const instance = await contract.connect(accounts[2]);
    await expect(
      instance.editTopic("topic 1", "New Description 1", 0, manager.address)
    ).to.be.rejectedWith("Only manager can call this function");
  });

  it("Should NOT edit topic(exists)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();

    await expect(
      contract.editTopic("topic 1", "New Description 1", 0, manager.address)
    ).to.be.rejectedWith("This topic does not exists");
  });

  it("Should NOT edit topic(status)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();
    await contract.addTopic(
      "topic 1",
      "description 1",
      Category.DECISION,
      0,
      manager.address
    );

    await contract.openVoting("topic 1");

    await expect(
      contract.editTopic("topic 1", "New Description 1", 0, manager.address)
    ).to.be.rejectedWith("Only IDLE topics can be edited");
  });

  it("Should NOT edit topic(nothing)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();
    await contract.addTopic(
      "topic 1",
      "description 1",
      Category.DECISION,
      0,
      manager.address
    );
    await contract.editTopic("topic 1", "description 1", 0, ethers.ZeroAddress);

    const topic = await contract.getTopic("topic 1");
    expect(topic.description === "description 1").to.equal(true);
  });

  it("Should remove topic (first)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();
    await contract.addTopic(
      "topic 1",
      "description 1",
      Category.DECISION,
      0,
      manager.address
    );
    await contract.addTopic(
      "topic 2",
      "description 2",
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

  it("Should get votes for a topic", async function () {
    const { contract, accounts } = await deployCondominiumFixture();

    // Adiciona residentes e cria um tópico
    await addResidents(contract, 5, accounts);
    await contract.addTopic(
      "topic 1",
      "description 1",
      Category.DECISION,
      0,
      accounts[0].address
    );
    await contract.openVoting("topic 1");

    // Adiciona votos
    await addVotes(contract, 5, accounts);

    // Verifica os votos
    const votes = await contract.getVotes("topic 1");
    expect(votes.length).to.equal(5);

    // Verifica se cada voto tem os campos corretos
    votes.forEach((vote: Vote) => {
      expect(vote.option).to.equal(Options.YES);
      expect(vote.resident).to.not.equal(ethers.ZeroAddress);
      expect(vote.residence).to.not.equal(0);
      expect(vote.timestamp).to.not.equal(0);
    });
  });

  it("Should get empty votes array for non-existent topic", async function () {
    const { contract } = await deployCondominiumFixture();

    const votes = await contract.getVotes("non-existent-topic");
    expect(votes.length).to.equal(0);
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
    await instance.payQuota(2102, { value: ethers.parseEther("0.01") });
    await instance.vote("topic 1", Options.ABSTENTION);
    expect(await instance.numberOfVotes("topic 1")).to.equal(1);
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
    await instance.payQuota(2102, { value: ethers.parseEther("0.01") });
    await instance.vote("topic 1", Options.ABSTENTION);
    expect(await instance.numberOfVotes("topic 1")).to.equal(1);
  });

  it("Should NOT vote (not defaulter)", async function () {
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

    await expect(instance.vote("topic 1", Options.ABSTENTION)).to.rejectedWith(
      "The resident must be defaulter"
    );
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
    await instance.payQuota(2102, { value: ethers.parseEther("0.01") });
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
    await instance.payQuota(2102, { value: ethers.parseEther("0.01") });
    await expect(instance.vote("topic 1", Options.YES)).to.be.rejectedWith(
      "Only VOTING topics can be voted"
    );
  });

  it("Should NOT vote (topic does not exist)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();

    await contract.addResident(accounts[1].address, 2102);

    const instance = contract.connect(accounts[1]);
    await instance.payQuota(2102, { value: ethers.parseEther("0.01") });

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
    await instance.payQuota(2102, { value: ethers.parseEther("0.01") });
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
    await instance.payQuota(2102, { value: ethers.parseEther("0.01") });

    await expect(instance.vote("topic 1", Options.EMPTY)).to.be.rejectedWith(
      "The option cannot be EMPTY"
    );
  });

  it("Should close voting(approved)", async function () {
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

    await addResidents(contract, 5, accounts);

    await addVotes(contract, 5, accounts);

    await contract.addResident(accounts[17].address, 2301);
    const instance = contract.connect(accounts[17]);
    await instance.payQuota(2301, { value: ethers.parseEther("0.01") });
    await instance.vote("topic 1", Options.ABSTENTION);

    await contract.closeVoting("topic 1");
    const topic = await contract.getTopic("topic 1");

    expect(topic.status).to.equal(Status.APPROVED);
  });

  it("Should close voting(denied)", async function () {
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

    await addResidents(contract, 5, accounts);

    await addVotes(contract, 5, accounts, false);

    await contract.closeVoting("topic 1");
    const topic = await contract.getTopic("topic 1");

    expect(topic.status).to.equal(Status.DENIED);
  });

  it("Should NOT close voting", async function () {
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

    await addResidents(contract, 5, accounts);

    await addVotes(contract, 2, accounts);

    await expect(contract.closeVoting("topic 1")).to.be.rejectedWith(
      "You cannot finish a voting without the minimum votes"
    );
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
    await instance.payQuota(2102, { value: ethers.parseEther("0.01") });

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

  it("Should NOT open voting (permission)", async function () {
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

  it("Should NOT open voting (status)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();
    await contract.addTopic(
      "topic 1",
      "description 1",
      Category.DECISION,
      0,
      manager.address
    );
    await contract.openVoting("topic 1");

    await expect(contract.openVoting("topic 1")).to.be.rejectedWith(
      "Only IDLE topis can be open for voting"
    );
  });

  it("Should NOT open voting (exists)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();
    await expect(contract.openVoting("topic 1")).to.be.rejectedWith(
      "The topic does not exist"
    );
  });

  it("Should pay quota", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();
  
    await contract.addResident(accounts[1].address, 1301);
    const instance = await contract.connect(accounts[1]);

    await instance.payQuota(1301, { value: ethers.parseEther("0.01") });

    const residentBefore = await contract.getResident(accounts[1].address);
    const initialNextPayment = BigInt(residentBefore.nextPayment);  
   
    const thirtyDaysInSeconds = BigInt(30 * 24 * 60 * 60); 

    
    const thirtyOneDaysInSeconds = BigInt(31 * 24 * 60 * 60); 
    const newTimestamp = initialNextPayment + thirtyOneDaysInSeconds;

    // After 31 days
    await time.setNextBlockTimestamp(Number(newTimestamp));  
    await instance.payQuota(1301, { value: ethers.parseEther("0.01") });

 
    const residentAfter = await contract.getResident(accounts[1].address);
    const expectedNextPayment = initialNextPayment + thirtyDaysInSeconds;

   
    expect(residentAfter.nextPayment).to.equal(expectedNextPayment);
});


  it("Should NOT pay quota (residence not exists)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();

    await contract.addResident(accounts[1].address, 1301);
    const instance = await contract.connect(accounts[1]);
    await expect(
      instance.payQuota(9001, { value: ethers.parseEther("0.01") })
    ).to.be.rejectedWith("The residence does not exists");
  });

  it("Should NOT pay quota (wrong value)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();

    await contract.addResident(accounts[1].address, 1301);
    const instance = await contract.connect(accounts[1]);
    await expect(
      instance.payQuota(1301, { value: ethers.parseEther("0.00") })
    ).to.be.rejectedWith("Wrong value");
  });

  it("Should NOT pay quota (wrong value)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();

    await contract.addResident(accounts[1].address, 1301);
    const instance = await contract.connect(accounts[1]);
    await instance.payQuota(1301, { value: ethers.parseEther("0.01") });
    await expect(
      instance.payQuota(1301, { value: ethers.parseEther("0.01") })
    ).to.be.rejectedWith("You cannot pay twice a month");
  });

  it("Should NOT transfer (permission)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();

    const instance = await contract.connect(accounts[3]);

    await expect(instance.transfer("topic 1", 100)).to.be.rejectedWith(
      "Only manager can call this function"
    );
  });

  it("Should NOT transfer (insufficient founds)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();

    await expect(contract.transfer("topic 1", 100)).to.be.rejectedWith(
      "Insufficient founds"
    );
  });

  it("Should NOT transfer (category)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();

    await contract.addTopic(
      "topic 1",
      "description 1",
      Category.DECISION,
      0,
      manager
    );
    await contract.openVoting("topic 1");

    await addResidents(contract, 10, accounts);
    await addVotes(contract, 10, accounts);
    await contract.closeVoting("topic 1");

    await expect(contract.transfer("topic 1", 100)).to.be.rejectedWith(
      "Only APPROVED SPENT topics can be used for transfers"
    );
  });

  it("Should NOT transfer (status)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();

    await contract.addTopic(
      "topic 1",
      "description 1",
      Category.SPENT,
      100,
      accounts[11].address
    );
    await contract.openVoting("topic 1");

    await addResidents(contract, 10, accounts);
    await addVotes(contract, 10, accounts, false);
    await contract.closeVoting("topic 1");
    await expect(contract.transfer("topic 1", 100)).to.be.rejectedWith(
      "Only APPROVED SPENT topics can be used for transfers"
    );
  });

  it("Should NOT transfer(amount)", async function () {
    const { contract, manager, accounts } = await deployCondominiumFixture();

    await contract.addTopic(
      "topic 1",
      "description 1",
      Category.SPENT,
      100,
      accounts[11].address
    );
    await contract.openVoting("topic 1");

    await addResidents(contract, 10, accounts);
    await addVotes(contract, 10, accounts);
    await contract.closeVoting("topic 1");

    await expect(contract.transfer("topic 1", 200)).to.be.rejectedWith(
      "The amount must be less or equal the APPROVED topic"
    );
  });
});
