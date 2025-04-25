// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrowdX {
    uint public campaignCounter;

    event CampaignCreated(
        uint indexed campaignID,
        address indexed creator,
        string title,
        string description,
        uint goalAmount,
        uint startTime,
        uint endTime
    );
    event DonationReceived(uint indexed campaignID, address indexed donor, uint amount);

    struct Campaign {
        string  title;
        string  description;
        uint    goalAmount;
        uint    currentAmount;
        uint    startTime;
        uint    endTime;
        address creator;
    }

    mapping(uint => Campaign) public campaigns;

    function createCampaign(
        string calldata title,
        string calldata description,
        uint          goalAmount,
        uint          startTime,
        uint          endTime
    ) external {
        require(startTime < endTime, "start must be before end");
        require(goalAmount > 0,      "goal must be > 0");

        campaigns[campaignCounter] = Campaign({
            title:         title,
            description:   description,
            goalAmount:    goalAmount,
            currentAmount: 0,
            startTime:     startTime,
            endTime:       endTime,
            creator:       msg.sender
        });

        emit CampaignCreated(
            campaignCounter,
            msg.sender,
            title,
            description,
            goalAmount,
            startTime,
            endTime
        );
        campaignCounter++;
    }

    function donateCampaign(uint campaignID) external payable {
        Campaign storage c = campaigns[campaignID];
        require(c.goalAmount > 0,               "campaign not found");
        require(block.timestamp >= c.startTime, "not started");
        require(block.timestamp <= c.endTime,   "already ended");
        require(msg.value > 0,                  "donation must be > 0");

        c.currentAmount += msg.value;
        emit DonationReceived(campaignID, msg.sender, msg.value);
    }
}
