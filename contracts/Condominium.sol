// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {CondominiumLib as Lib} from "./CondominiumLib.sol";
import "./ICondominuim.sol";

contract Condominium is ICondominium {
    address public manager; //Ownable
    uint public monthlyQuota = 0.01 ether;

    mapping(uint16 => bool) public residences;
    mapping(address => uint16) public residents;
    mapping(address => bool) public counselors;

    mapping(uint16 => uint) public payments; //unidade (residencial) => timestamp último pagamento

    mapping(bytes32 => Lib.Topic) public topics;
    mapping(bytes32 => Lib.Vote[]) public votes;

    constructor() {
        manager = msg.sender;

        for (uint16 i = 0; i <= 2; i++) {
            //blocos
            for (uint16 j = 0; j <= 5; j++) {
                //andares
                for (uint16 k = 1; k <= 5; k++) {
                    //unidades
                    residences[(i * 1000) + (j * 100) + k] = true;
                }
            }
        }
    }

    modifier onlyManager() {
        require(tx.origin == manager, "Only manager can call this function");
        _;
    }

    modifier onlyCouncil() {
        require(
            tx.origin == manager || counselors[tx.origin],
            "Only the manager or the council can call this function"
        );
        _;
    }

    modifier onlyResident() {
        require(
            tx.origin == manager || isResident(tx.origin),
            "Only the manager or residents can call this function"
        );
        require(tx.origin == manager || block.timestamp < payments[residents[tx.origin]] + (30*24*60*60), "The resident must be defaulter");
        _;
    }

    modifier validAddress(address addr) {
        require(addr != address(0), "Invalid address");
        _;
    }

    function residenceExists(uint16 residenceId) public view returns (bool) {
        return residences[residenceId];
    }

    function isResident(address resident) public view returns (bool) {
        return residents[resident] > 0;
    }

    function addResident(
        address resident,
        uint16 residenceId
    ) external onlyCouncil validAddress(resident) {
        require(residenceExists(residenceId), "Residence does not exist");
        residents[resident] = residenceId;
    }

    function removeResident(address resident) external onlyManager {
        require(!counselors[resident], "The council cannot be removed");
        delete residents[resident];
    }

    function setConsuelor(
        address resident,
        bool isEntering
    ) external onlyManager validAddress(resident) {
        if (isEntering) {
            require(isResident(resident), "The consuelor must be a resident");
            counselors[resident] = true;
        } else {
            counselors[resident] = false;
        }
    }

    function getTopic(
        string memory title
    ) public view returns (Lib.Topic memory) {
        bytes32 topicId = keccak256(bytes(title));
        return topics[topicId];
    }

    function topicExists(string memory title) public view returns (bool) {
        return getTopic(title).createdDate > 0;
    }

    function addTopic(
        string memory title,
        string memory description,
        Lib.Category category,
        uint amount,
        address responsible
    ) external onlyResident {
        require(!topicExists(title), "Topic already exists");
        if (amount > 0) {
            require(
                category == Lib.Category.CHANGE_QUOTA ||
                    category == Lib.Category.SPENT,
                "Wrong category"
            );
        }

        Lib.Topic memory newTopic = Lib.Topic({
            title: title,
            description: description,
            createdDate: block.timestamp,
            startDate: 0,
            endDate: 0,
            status: Lib.Status.IDLE,
            category: category,
            amount: amount,
            responsible: responsible != address(0) ? responsible : tx.origin
        });

        topics[keccak256(bytes(title))] = newTopic;
    }

    function removeTopic(string memory title) external onlyManager  returns(Lib.TopicUpdate memory){
        Lib.Topic memory topic = getTopic(title);
        require(topicExists(title), "Topic does not exist");
        require(
            topic.status == Lib.Status.IDLE,
            "Only topics in IDLE status can be removed"
        );

        bytes32 topicId = keccak256(bytes(title));
        delete topics[topicId];

        return Lib.TopicUpdate({
            id: topicId,
            title: topic.title,
            category: topic.category,
            status: Lib.Status.DELETED
        });
    }

    function editTopic(
        string memory topicToEdit,
        string memory description,
        uint amount,
        address responsible
    ) external onlyManager  returns(Lib.TopicUpdate memory){
        Lib.Topic memory topic = getTopic(topicToEdit);
        require(topic.createdDate > 0, "This topic does not exists");
        require(
            topic.status == Lib.Status.IDLE,
            "Only IDLE topics can be edited"
        );

        bytes32 topicId = keccak256(bytes(topicToEdit));

        if (bytes(description).length > 0)
            topics[topicId].description = description;

        if (amount > 0) topics[topicId].amount = amount;

        if (responsible != address(0))
            topics[topicId].responsible = responsible;
        return Lib.TopicUpdate({
            id: topicId,
            title: topic.title,
            status: topic.status,
            category: topic.category
        });
    }

    function openVoting(string memory title) external onlyManager returns(Lib.TopicUpdate memory) {
        Lib.Topic memory topic = getTopic(title);
        require(topic.createdDate > 0, "The topic does not exist");
        require(
            topic.status == Lib.Status.IDLE,
            "Only IDLE topis can be open for voting"
        );

        bytes32 topicId = keccak256(bytes(title));
        topics[topicId].status = Lib.Status.VOTING;
        topics[topicId].startDate = block.timestamp;

        return Lib.TopicUpdate({
            id: topicId,
            title: topic.title,
            category: topic.category,
            status: Lib.Status.VOTING
        });
    }

    function vote(
        string memory title,
        Lib.Options option
    ) external onlyResident {
        require(option != Lib.Options.EMPTY, "The option cannot be EMPTY");

        Lib.Topic memory topic = getTopic(title);
        require(topic.createdDate > 0, "The topic does not exist");
        require(
            topic.status == Lib.Status.VOTING,
            "Only VOTING topics can be voted"
        );

        uint16 resident = residents[tx.origin];
        bytes32 topicId = keccak256(bytes(title));

        Lib.Vote[] storage topicVotes = votes[topicId];
        for (uint8 i = 0; i < topicVotes.length; i++) {
            require(
                topicVotes[i].resident != msg.sender,
                "A residence should vote only once"
            );
        }

        Lib.Vote memory newVote = Lib.Vote({
            residence: resident,
            resident: tx.origin,
            option: option,
            timestamp: block.timestamp
        });

        votes[topicId].push(newVote);
    }

    function closeVoting(string memory title) external onlyManager returns(Lib.TopicUpdate memory){
        Lib.Topic memory topic = getTopic(title);
        require(topic.createdDate > 0, "The topic does not exist");
        require(
            topic.status == Lib.Status.VOTING,
            "Only VOTING topis can be closed"
        );

        uint8 minimumVotes = 5;
        if (topic.category == Lib.Category.SPENT) minimumVotes = 10;
        else if (topic.category == Lib.Category.CHANGE_MANAGER)
            minimumVotes = 15;
        else if (topic.category == Lib.Category.CHANGE_QUOTA) minimumVotes = 20;

        require(
            numberOfVotes(title) >= minimumVotes,
            "You cannot finish a voting without the minimum votes"
        );

        uint8 approved = 0;
        uint8 denied = 0;
        uint8 abstentions = 0;
        bytes32 topicId = keccak256(bytes(title));
        Lib.Vote[] memory topicVotes = votes[topicId];

        for (uint8 i = 0; i < topicVotes.length; i++) {
            if (topicVotes[i].option == Lib.Options.YES) {
                approved++;
            } else if (topicVotes[i].option == Lib.Options.NO) {
                denied++;
            } else {
                abstentions++;
            }
        }

        Lib.Status newStatus = approved > denied
            ? Lib.Status.APPROVED
            : Lib.Status.DENIED;
        topics[topicId].status = newStatus;
        topics[topicId].endDate = block.timestamp;

        if (newStatus == Lib.Status.APPROVED) {
            if (topic.category == Lib.Category.CHANGE_QUOTA) {
                monthlyQuota = topic.amount;
            } else if (topic.category == Lib.Category.CHANGE_MANAGER) {
                manager = topic.responsible;
            }
        }
        return Lib.TopicUpdate({
            id: topicId,
            title: topic.title,
            category: topic.category,
            status: newStatus
        });
    }

    function numberOfVotes(string memory title) public view returns (uint256) {
        bytes32 topicId = keccak256(bytes(title));
        return votes[topicId].length;
    }

    function payQuota(uint16 residenceId) external payable{
        require(residenceExists(residenceId), "The residence does not exists");
        require(msg.value >= monthlyQuota, "Wrong value");
        require(block.timestamp > payments[residenceId] + (30*24*60*60),"You cannot pay twice a month" );
        payments[residenceId] = block.timestamp;
    }

     function transfer(string memory topicTitle, uint amount) external onlyManager returns(Lib.TransferReceipt memory){
        require(address(this).balance >= amount, "Insufficient founds");

        Lib.Topic memory topic = getTopic(topicTitle);
        require(topic.status == Lib.Status.APPROVED && topic.category == Lib.Category.SPENT, "Only APPROVED SPENT topics can be used for transfers");

        require(topic.amount >= amount, "The amount must be less or equal the APPROVED topic");

        payable(topic.responsible).transfer(amount);

        bytes32 topicId = keccak256(bytes(topicTitle));
        topics[topicId].status = Lib.Status.SPENT;

        return Lib.TransferReceipt({
            to: topic.responsible,
            amount: amount,
            topic: topicTitle
        });
     }

    function getManager()external view returns(address){
        return manager;
    }

    function getQuota() external view returns(uint){
        return monthlyQuota; 
    }

}
