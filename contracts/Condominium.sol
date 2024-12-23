// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Condominium {

    address public manager;//Ownable
    mapping (uint16 => bool) public residences;
    mapping (address => uint16) public residents;
    mapping (address => bool) public counselors;

    enum Status{
        IDLE,
        VOTING,
        APPROVED,
        DENIED
    }//0,1,2,3

        struct Topic {
            string title;
            string description;
            Status status;
            uint256 createdDate;
            uint256 startDate;
            uint256 endDate;
        }

        mapping (bytes32 => Topic) public topics;

    constructor() {
        manager = msg.sender;

        for(uint8 i = 0; i <=2; i++) {//blocos
            for(uint8 j = 0; j <= 5; j++) {//andares
                for(uint8 k = 1; k<= 5; k++){//unidades
                    unchecked {
                        residences[(i*1000) + (j*100) + k] = true;
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
        require(msg.sender == manager || counselors[msg.sender], "Only the manager or the council can call this function");
        _;
    }

    modifier onlyResident() {
        require(msg.sender == manager || isResident(msg.sender), "Only the manager or residents can call this function");
        _;

    }

    function residenceExists (uint16 residenceId) public view returns(bool){
        return residences[residenceId];
    }
    function isResident(address resident)public view returns(bool){
        return residents[resident] > 0;
    }

    function addResident(address resident, uint16 residenceId) external onlyCouncil {
        require(residenceExists(residenceId), "Residence does not exist");
        residents[resident] = residenceId;
    }

    function removeResident(address resident) external onlyManager {
        require(!counselors[resident], "The council cannot be removed");
        delete residents[resident];

        if(counselors[resident]){
            delete counselors[resident];
        }
    }

    function setConsuelor(address resident, bool isEntering) external onlyManager {
        if(isEntering){
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
    
    function getTopic(string memory title) public view returns(Topic memory){
        bytes32 topicId = keccak256(bytes(title));
        return topics[topicId];
    }

    function topicExists(string memory title) public view returns(bool){
       return getTopic(title).createdDate > 0;
    }

    function addTopic(string memory title, string memory description) external onlyResident {
        require(!topicExists(title), "Topic already exists");
        Topic memory newTopic = Topic({
            title:title,
            description:description,
            createdDate: block.timestamp,
            startDate: 0,
            endDate: 0,
            status: Status.IDLE
        });

        topics[keccak256(bytes(title))] = newTopic;
    }

    function removeTopic(string memory title) external onlyManager {
        Topic memory topic = getTopic(title);
        require(topicExists(title), "Topic does not exist");
        require(topic.status == Status.IDLE, "Only topics in IDLE status can be removed");
        delete topics[keccak256(bytes(title))];
    }
}