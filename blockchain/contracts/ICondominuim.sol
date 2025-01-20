// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {CondominiumLib as Lib} from "./CondominiumLib.sol";

interface ICondominium {
    function monthlyQuota() external view returns (uint);

    function addResident(address resident, uint16 residenceId) external;

    function removeResident(address resident) external;

    function setConsuelor(address resident, bool isEntering) external;

    function addTopic(
        string memory title,
        string memory description,
        Lib.Category category,
        uint amount,
        address responsible
    ) external;

    function editTopic(
        string memory topicToEdit,
        string memory description,
        uint amount,
        address responsible
    ) external returns(Lib.TopicUpdate memory);

    function removeTopic(string memory title) external returns(Lib.TopicUpdate memory);

    function openVoting(string memory title) external returns(Lib.TopicUpdate memory);

    function vote(string memory title, Lib.Options option) external;

    function closeVoting(string memory title) external returns(Lib.TopicUpdate memory);

    function payQuota(uint16 residenceId) external payable;

    function transfer(string memory topicTitle, uint amount) external returns(Lib.TransferReceipt memory);

    function getManager()external view returns(address);

    function getQuota() external view returns(uint);

    function getResident(address resident) external view returns(Lib.Resident memory);

    function getResidents(uint page, uint pageSize) external view returns(Lib.ResidentsPage memory);

    function getTopic(string memory title) external view returns(Lib.Topic memory);

    function getTopics(uint page, uint pageSize) external view returns(Lib.TopicsPage memory);

    function getVotes(string memory topicTitle) external view returns(Lib.Vote[] memory);
}
