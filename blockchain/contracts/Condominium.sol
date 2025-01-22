// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {CondominiumLib as Lib} from "./CondominiumLib.sol";
import "./ICondominuim.sol";

contract Condominium is ICondominium {
    address public manager; //Ownable
    uint public monthlyQuota = 0.01 ether;

    mapping(uint16 => bool) public residences;
    Lib.Resident[] residents;
    mapping(address => uint) private _residentIndex;
    address[] public counselors;

    mapping(uint16 => uint) private _nextPayment; //unidade (residencial) => timestamp próximo pagamento

    Lib.Topic[] topics;
    mapping(bytes32 => uint) private _topicIndex;
    mapping(bytes32 => Lib.Vote[]) private _votes;

    uint private constant _thirtyDays  = 30 * 24 * 60 * 60;

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
        tx.origin == manager || _isCounselor(tx.origin),
        "Only the manager or the council can call this function"
    );
    _;
}
   modifier onlyResident() {
    if (tx.origin != manager) {
        require(
            isResident(tx.origin),
            "Only the manager or residents can call this function"
        );
        Lib.Resident memory resident = _getResident(tx.origin);
        require(
            block.timestamp <= resident.nextPayment,
            "The resident must be defaulter"
        );
    }
    _;
}

    modifier validAddress(address addr) {
        require(addr != address(0), "Invalid address");
        _;
    }

    // Manager function

    function getManager() external view returns (address) {
        return manager;
    }

    function isManager(address resident) public view returns (bool) {
        return resident == manager;
    }

    // Resident functions
    function residenceExists(uint16 residenceId) public view returns (bool) {
        return residences[residenceId];
    }

    function isResident(address resident) public view returns (bool) {
        return _getResident(resident).residence > 0;
    }

    function _getResident(
        address resident
    ) private view returns (Lib.Resident memory) {
        uint index = _residentIndex[resident];
        if (index < residents.length) {
            Lib.Resident memory result = residents[index];
            if (result.wallet == resident) {
                result.nextPayment = _nextPayment[result.residence];
                return result;
            }
        }

        return
            Lib.Resident({
                wallet: address(0),
                residence: 0,
                isCounselor: false,
                isManager: false,
                nextPayment: 0
            });
    }

    function getResident(
        address resident
    ) external view returns (Lib.Resident memory) {
        return _getResident(resident);
    }

    function getResidents(
        uint page,
        uint pageSize
    ) external view returns (Lib.ResidentsPage memory) {
        Lib.Resident[] memory result = new Lib.Resident[](pageSize);
        uint skip = ((page - 1) * pageSize);
        uint index = 0;

        for (uint i = skip; i < (skip + pageSize) && i < residents.length; i++) {
            result[index++] = _getResident(residents[i].wallet);
        }

        return Lib.ResidentsPage({residents: result, total: residents.length});
    }

    function addResident(
        address resident,
        uint16 residenceId
    ) external onlyCouncil validAddress(resident) {
        require(residenceExists(residenceId), "Residence does not exist");
        residents.push(
            Lib.Resident({
                wallet: resident,
                residence: residenceId,
                isCounselor: false,
                isManager: resident == manager,
                nextPayment: 0
            })
        );
        _residentIndex[resident] = residents.length - 1;
    }

    function removeResident(address resident) external onlyManager {
        require(!_isCounselor(resident), "The council cannot be removed");
        uint index = _residentIndex[resident];

        if (index != residents.length - 1) {
            Lib.Resident memory latest = residents[residents.length - 1];
            residents[index] = latest;
            _residentIndex[latest.wallet] = index;
        }

        residents.pop();
        delete _residentIndex[resident];
    }

    // Counselor functions
    function _isCounselor(address resident) private view returns (bool) {
    for (uint i = 0; i < counselors.length; i++) {
        if (counselors[i] == resident) {
            return true;
        }
    }
    return false;
}

    function _addCounselor(
        address counselor
    ) private onlyManager validAddress(counselor) {

        require(isResident(counselor), "The consuelor must be a resident");
        counselors.push(counselor);
        residents[_residentIndex[counselor]].isCounselor = true;
    }

    function _removeCounselor(
        address counselor
    ) private onlyManager validAddress(counselor) {
        uint index = 1000000;
        for (uint i = 0; i < counselors.length; i++) {
            if (counselors[i] == counselor) {
                index = i;
                break;
            }
        }

        require(index != 1000000, "Counselor not found");

        if (index != counselors.length - 1) {
            address latest = counselors[counselors.length - 1];
            counselors[index] = latest;
        }
        counselors.pop();
        residents[_residentIndex[counselor]].isCounselor = false;
    }

    function setConsuelor(address resident, bool isEntering) external {
        if (isEntering) {
            _addCounselor(resident);
        } else _removeCounselor(resident);
    }

    //Topics functions

    function getTopic(string memory title) external view returns(Lib.Topic memory){
        return _getTopic(title);
    } 

    function _getTopic(
        string memory title
    ) private view returns (Lib.Topic memory) {
        bytes32 topicId = keccak256(bytes(title));
        uint index = _topicIndex[topicId];

        if (index < topics.length){
            Lib.Topic memory result = topics[index];
            if(index > 0 || keccak256(bytes(result.title)) == topicId){
                return result;
            }
            
        }
        return Lib.Topic({
            title:"",
            description:"",
            status: Lib.Status.DELETED,
            createdDate: 0,
            startDate: 0,
            endDate: 0,
            responsible: address(0),
            amount: 0,
            category: Lib.Category.DECISION
        });
    }

    function topicExists(string memory title) public view returns (bool) {
        return _getTopic(title).createdDate > 0;
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

        _topicIndex[keccak256(bytes(title))] = topics.length;
        topics.push(newTopic);
    }

    function removeTopic(
    string memory title
) external onlyManager returns (Lib.TopicUpdate memory) {
    Lib.Topic memory topic = _getTopic(title);
    require(topicExists(title), "Topic does not exist");
    require(
        topic.status == Lib.Status.IDLE,
        "Only topics in IDLE status can be removed"
    );

    bytes32 topicId = keccak256(bytes(title));
    uint index = _topicIndex[topicId];
    
    // If not the last element, swap with the last one
    if (index != topics.length - 1) {
        Lib.Topic memory latest = topics[topics.length - 1];
        topics[index] = latest;
        _topicIndex[keccak256(bytes(latest.title))] = index;
    }

    // Remove the last element
    topics.pop();
    delete _topicIndex[topicId];

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
    ) external onlyManager returns (Lib.TopicUpdate memory) {
        Lib.Topic memory topic = _getTopic(topicToEdit);
        require(topic.createdDate > 0, "This topic does not exists");
        require(
            topic.status == Lib.Status.IDLE,
            "Only IDLE topics can be edited"
        );

        bytes32 topicId = keccak256(bytes(topicToEdit));
        uint index = _topicIndex[topicId];


        if (bytes(description).length > 0)
            topics[index].description = description;

        if (amount > 0) topics[index].amount = amount;

        if (responsible != address(0))
            topics[index].responsible = responsible;
        return
            Lib.TopicUpdate({
                id: topicId,
                title: topic.title,
                status: topic.status,
                category: topic.category
            });
    }

     function getTopics(
        uint page,
        uint pageSize
    ) external view returns (Lib.TopicsPage memory) {
        Lib.Topic[] memory result = new Lib.Topic[](pageSize);
        uint skip = ((page - 1) * pageSize);
        uint index = 0;

        for (uint i = skip; i < (skip + pageSize) && i < topics.length; i++) {
            result[index++] = topics[i];
        }

        return Lib.TopicsPage({topics: result, total: topics.length});
    }

    // Voting functions
    function openVoting(
        string memory title
    ) external onlyManager returns (Lib.TopicUpdate memory) {
        Lib.Topic memory topic = _getTopic(title);
        require(topic.createdDate > 0, "The topic does not exist");
        require(
            topic.status == Lib.Status.IDLE,
            "Only IDLE topis can be open for voting"
        );

        bytes32 topicId = keccak256(bytes(title));
        uint index = _topicIndex[topicId];
        topics[index].status = Lib.Status.VOTING;
        topics[index].startDate = block.timestamp;

        return
            Lib.TopicUpdate({
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

        Lib.Topic memory topic = _getTopic(title);
        require(topic.createdDate > 0, "The topic does not exist");
        require(
            topic.status == Lib.Status.VOTING,
            "Only VOTING topics can be voted"
        );

        uint16 resident = residents[_residentIndex[tx.origin]].residence;
        bytes32 topicId = keccak256(bytes(title));

        Lib.Vote[] storage topicVotes = _votes[topicId];
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

        _votes[topicId].push(newVote);
    }

    function closeVoting(
        string memory title
    ) external onlyManager returns (Lib.TopicUpdate memory) {
        Lib.Topic memory topic = _getTopic(title);
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
        Lib.Vote[] memory topicVotes = _votes[topicId];

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

        uint index = _topicIndex[topicId];
        topics[index].status = newStatus;
        topics[index].endDate = block.timestamp;

        if (newStatus == Lib.Status.APPROVED) {
            if (topic.category == Lib.Category.CHANGE_QUOTA) {
                monthlyQuota = topic.amount;
            } else if (topic.category == Lib.Category.CHANGE_MANAGER) {
                if(isResident(manager)){
                    residents[_residentIndex[manager]].isManager = false;
                }
                manager = topic.responsible;

                if(isManager(topic.responsible))
                    residents[_residentIndex[manager]].isManager = true;
            }
        }
        return
            Lib.TopicUpdate({
                id: topicId,
                title: topic.title,
                category: topic.category,
                status: newStatus
            });
    }

    function numberOfVotes(string memory title) public view returns (uint256) {
        bytes32 topicId = keccak256(bytes(title));
        return _votes[topicId].length;
    }

    function getVotes(string memory topicTitle) external view returns(Lib.Vote[] memory){
        return _votes[keccak256(bytes(topicTitle))];
    }

    //Quota functions
    function payQuota(uint16 residenceId) external payable {
        require(residenceExists(residenceId), "The residence does not exists");
        require(msg.value >= monthlyQuota, "Wrong value");
        require(
            block.timestamp > _nextPayment[residenceId],
            "You cannot pay twice a month"
        );

        if(_nextPayment[residenceId] == 0)
            _nextPayment[residenceId] = block.timestamp + _thirtyDays ;
        else
            _nextPayment[residenceId] += _thirtyDays ;
    }

    function getQuota() external view returns (uint) {
        return monthlyQuota;
    }

    //Transfer function

    function transfer(
        string memory topicTitle,
        uint amount
    ) external onlyManager returns (Lib.TransferReceipt memory) {
        require(address(this).balance >= amount, "Insufficient founds");

        Lib.Topic memory topic = _getTopic(topicTitle);
        require(
            topic.status == Lib.Status.APPROVED &&
                topic.category == Lib.Category.SPENT,
            "Only APPROVED SPENT topics can be used for transfers"
        );

        require(
            topic.amount >= amount,
            "The amount must be less or equal the APPROVED topic"
        );

        payable(topic.responsible).transfer(amount);

        bytes32 topicId = keccak256(bytes(topicTitle));
        uint index = _topicIndex[topicId];
        topics[index].status = Lib.Status.SPENT;

        return
            Lib.TransferReceipt({
                to: topic.responsible,
                amount: amount,
                topic: topicTitle
            });
    }
}
