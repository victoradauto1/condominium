// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {CondominiumLib as Lib} from './CondominiumLib.sol';
import './ICondominuim.sol';

contract Condominium is ICondominium {
    address public manager; //Ownable
    mapping(uint16 => bool) public residences;
    mapping(address => uint16) public residents;
    mapping(address => bool) public counselors;


    mapping(bytes32 => Lib.Topic) public topics;
    mapping(bytes32 => Lib.Vote[]) public votes;

    constructor() {
        manager = msg.sender;

        for (uint8 i = 0; i <= 2; i++) {
            //blocos
            for (uint8 j = 0; j <= 5; j++) {
                //andares
                for (uint8 k = 1; k <= 5; k++) {
                    //unidades
                    unchecked {
                        residences[(i * 1000) + (j * 100) + k] = true;
                    }
                }
            }
        }
    }

    modifier onlyManager() {
        require(msg.sender == manager, "Only manager can call this function");
        _;
    }

    modifier onlyCouncil() {
        require(
            msg.sender == manager || counselors[msg.sender],
            "Only the manager or the council can call this function"
        );
        _;
    }

    modifier onlyResident() {
        require(
            msg.sender == manager || isResident(msg.sender),
            "Only the manager or residents can call this function"
        );
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
    ) external onlyCouncil {
        require(residenceExists(residenceId), "Residence does not exist");
        residents[resident] = residenceId;
    }

    function removeResident(address resident) external onlyManager {
        require(!counselors[resident], "The council cannot be removed");
        delete residents[resident];

        if (counselors[resident]) {
            delete counselors[resident];
        }
    }

    function setConsuelor(
        address resident,
        bool isEntering
    ) external onlyManager {
        if (isEntering) {
            require(isResident(resident), "The consuelor must be a resident");
            counselors[resident] = true;
        } else {
            counselors[resident] = false;
        }
    }

    function setManager(address newManager) external onlyManager {
        require(newManager != address(0), "The address must be valid");
        manager = newManager;
    }

    function getTopic(string memory title) public view returns (Lib.Topic memory) {
        bytes32 topicId = keccak256(bytes(title));
        return topics[topicId];
    }

    function topicExists(string memory title) public view returns (bool) {
        return getTopic(title).createdDate > 0;
    }

    function addTopic(
        string memory title,
        string memory description
    ) external onlyResident {
        require(!topicExists(title), "Topic already exists");
        Lib.Topic memory newTopic = Lib.Topic({
            title: title,
            description: description,
            createdDate: block.timestamp,
            startDate: 0,
            endDate: 0,
            status: Lib.Status.IDLE
        });

        topics[keccak256(bytes(title))] = newTopic;
    }

    function removeTopic(string memory title) external onlyManager {
        Lib.Topic memory topic = getTopic(title);
        require(topicExists(title), "Topic does not exist");
        require(
            topic.status == Lib.Status.IDLE,
            "Only topics in IDLE status can be removed"
        );
        delete topics[keccak256(bytes(title))];
    }

    function openVoting(string memory title) external onlyManager {
        Lib.Topic memory topic = getTopic(title);
        require(topic.createdDate > 0, "The topic does not exist");
        require(
            topic.status == Lib.Status.IDLE,
            "Only IDLE topis can be open for voting"
        );

        bytes32 topicId = keccak256(bytes(title));
        topics[topicId].status = Lib.Status.VOTING;
        topics[topicId].startDate = block.timestamp;
    }

    function vote(string memory title, Lib.Options option) external onlyResident {
        require(option != Lib.Options.EMPTY, "The option cannot be EMPTY");

        Lib.Topic memory topic = getTopic(title);
        require(topic.createdDate > 0, "The topic does not exist");
        require(
            topic.status == Lib.Status.VOTING,
            "Only VOTING topics can be voted"
        );

        uint16 resident = residents[msg.sender];
        bytes32 topicId = keccak256(bytes(title));

        Lib.Vote[] storage topicVotes = votes[topicId];
        for (uint8 i = 0; i < topicVotes.length; i++) {
            if (topicVotes[i].residence == resident)
                require(false, "A residence should vote only once");
        }

        Lib.Vote memory newVote = Lib.Vote({
            residence: resident,
            resident: msg.sender,
            option: option,
            timestamp: block.timestamp
        });

        votes[topicId].push(newVote);
    }

    function closeVoting(string memory title) external onlyManager {
        Lib.Topic memory topic = getTopic(title);
        require(topic.createdDate > 0, "The topic does not exist");
        require(
            topic.status == Lib.Status.VOTING,
            "Only VOTING topis can be closed"
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

        if (approved > denied) {
            topics[topicId].status = Lib.Status.APPROVED;
        } else {
            topics[topicId].status = Lib.Status.DENIED;
        }
        topics[topicId].endDate = block.timestamp;
    }

    function numberOfVotes(string memory title) external view returns(uint256){
        bytes32 topicId = keccak256(bytes(title));
        return votes[topicId].length;
    }
}
