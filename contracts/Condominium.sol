// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Condominium {

    address public manager;//Ownable
    mapping (uint16 => bool) public residences;
    mapping (address => uint16) public residents;
    mapping (address => bool) public counselors;

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
        manager = newManager;
    }
}