// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import './ICondominuim.sol';

contract CondominiumAdapter {
    
    ICondominium private implementation;
    address public immutable owner;

    constructor(){
        owner = msg.sender;
    }

    function upgrade(address newImplementation) external {
        require( msg.sender == owner, "You do not have permission");
        implementation = ICondominium(newImplementation);
    }

    function getImplementAddress() external view returns(address) {
        return address(implementation);
    }

    function addResident(address resident, uint16 residenceId) external{
        return implementation.addResident(resident, residenceId);
    }

    function removeResident(address resident) external{
        return implementation.removeResident(resident);
    }

    function setConsuelor(address resident, bool isEntering) external{
        return implementation.setConsuelor(resident, isEntering);
    }

    //TODO: mudar a função set manager
    function setManager(address newManager) external{
        return implementation.setManager(newManager);
    }

    //TODO: mudar a função add topic
    function addTopic(string memory title, string memory description) external{
        return implementation.addTopic(title, description);
    }

    //TODO: edit topics

    function removeTopic(string memory title) external{
        return implementation.removeTopic(title);
    }

    //TODO: set quota

    function openVoting(string memory title) external{
        return implementation.openVoting(title);
    }

    function vote(string memory title, Lib.Options option) external{
        return implementation.vote(title, option);
    }

    function closeVoting(string memory title) external{
        return implementation.closeVoting(title);
    }

    //TODO: pay quota

    //TODO: tranfer
}