// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import './ICondominuim.sol';
import {CondominiumLib as Lib} from "./CondominiumLib.sol";

contract CondominiumAdapter {
    
    ICondominium private implementation;
    address public immutable owner;

    constructor(){
        owner = msg.sender;
    }

    modifier upgraded(){
        require( address(implementation) != address(0), "You must upgrad first");
        _;
    }

    function upgrade(address newImplementation) external {
        require( msg.sender == owner, "You do not have permission");
        implementation = ICondominium(newImplementation);
    }

    function getImplementAddress() external view returns(address) {
        return address(implementation);
    }

    function addResident(address resident, uint16 residenceId) upgraded external{
        return implementation.addResident(resident, residenceId);
    }

    function removeResident(address resident) external upgraded{
        return implementation.removeResident(resident);
    }

    function setConsuelor(address resident, bool isEntering) external upgraded{
        return implementation.setConsuelor(resident, isEntering);
    }


    function addTopic(string memory title, string memory description, Lib.Category category, uint amount, address responsible) external upgraded {
        return implementation.addTopic(title, description, category, amount, responsible);
    }

    function editTopic(string memory topicToEdit, string memory description, uint amount, address responsible) external upgraded {
        return implementation.editTopic(topicToEdit, description, amount, responsible);
    }

    function removeTopic(string memory title) external upgraded{
        return implementation.removeTopic(title);
    }

    function openVoting(string memory title) external upgraded{
        return implementation.openVoting(title);
    }

    function vote(string memory title, Lib.Options option) external upgraded{
        return implementation.vote(title, option);
    }

    function closeVoting(string memory title) external upgraded{
        return implementation.closeVoting(title);
    }

    //TODO: pay quota

    //TODO: tranfer
}