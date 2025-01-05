// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

library CondominiumLib {
    
    enum Status {
        IDLE,
        VOTING,
        APPROVED,
        DENIED
    } //0,1,2,3

    enum Options {
        EMPTY,
        YES,
        NO,
        ABSTENTION
    } //0,1,2,3

     enum Category{
        DECISION,
        SPEND,
        CHANGE_QUOTA,
        CHANGE_MANAGER
    } //0,1,2,3

    struct Topic {
        string title;
        string description;
        Status status;
        uint256 createdDate;
        uint256 startDate;
        uint256 endDate;
    }

    struct Vote {
        address resident;
        uint16 residence;
        Options option;
        uint256 timestamp;
    }
} 