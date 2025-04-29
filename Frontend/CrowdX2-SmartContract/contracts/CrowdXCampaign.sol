// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrowdXCampaign {
    uint public campaignCounter = 1;

    struct Campaign {
        string  title;
        string  description;
        uint    goalAmount;
        uint    currentAmount;
        uint    totalRaised;
        uint    startTime;
        uint    endTime;
        address creator;
        bool    closed;
        bool    goalReached;
        bool    fundsClaimed;
        bool    exists;
        mapping(address => uint) donations;
    }

    mapping(uint => Campaign) private campaigns;

    event CampaignCreated(
        uint indexed campaignId,
        string title,
        string description,
        uint goalAmount,
        uint startTime,
        uint endTime,
        address indexed creator
    );

    event DonationReceived(
        uint indexed campaignId,
        address indexed donor,
        uint amount
    );

    event CampaignClosed(
        uint indexed campaignId,
        address indexed creator,
        uint totalRaised
    );

    event RefundClaimed(
        uint indexed campaignId,
        address indexed donor,
        uint amount
    );

    event FundsClaimed(
        uint indexed campaignId,
        address indexed creator,
        uint amount
    );

    function createCampaign(
        string memory _title,
        string memory _description,
        uint _goalAmount,
        uint _startTime,
        uint _endTime
    ) external {
        require(_goalAmount > 0, "Goal must be > 0");
        require(_startTime < _endTime, "Start must be before end");
        require(_endTime >= _startTime + 1 days, "Campaign must last at least 1 day");

        uint id = campaignCounter;
        Campaign storage c = campaigns[id];
        c.title = _title;
        c.description = _description;
        c.goalAmount = _goalAmount;
        c.startTime = _startTime;
        c.endTime = _endTime;
        c.creator = msg.sender;
        c.closed = false;
        c.goalReached = false;
        c.fundsClaimed = false;
        c.exists = true;
        c.currentAmount = 0;
        c.totalRaised = 0;

        emit CampaignCreated(
            id, _title, _description, _goalAmount, _startTime, _endTime, msg.sender
        );

        campaignCounter++;
    }

    function donateCampaign(uint _campaignId) external payable {
        Campaign storage c = campaigns[_campaignId];
        require(c.exists, "Campaign not found");
        require(block.timestamp >= c.startTime, "Campaign not started yet");
        require(block.timestamp <= c.endTime, "Campaign already ended");
        require(!c.closed, "Campaign already closed");
        require(msg.value > 0, "Must send ETH");

        c.currentAmount += msg.value;
        c.totalRaised += msg.value;
        c.donations[msg.sender] += msg.value;

        emit DonationReceived(_campaignId, msg.sender, msg.value);

        if (c.currentAmount >= c.goalAmount) {
            c.goalReached = true;
        }
    }

    function claimFunds(uint _campaignId) external {
        Campaign storage c = campaigns[_campaignId];
        require(c.exists, "Campaign not found");
        require(c.creator == msg.sender, "Only creator can claim");
        require(!c.closed, "Campaign already closed");
        require(c.goalReached, "Funding goal not reached");

        c.closed = true;
        c.fundsClaimed = true;
        uint payout = c.currentAmount;
        c.currentAmount = 0;

        (bool sent, ) = payable(c.creator).call{value: payout}("");
        require(sent, "Fund transfer failed");

        emit FundsClaimed(_campaignId, c.creator, payout);
    }

    function claimRefund(uint _campaignId) external {
        Campaign storage c = campaigns[_campaignId];
        require(c.exists, "Campaign not found");
        require(block.timestamp > c.endTime, "Campaign not ended yet");
        require(!c.goalReached, "Goal was reached, no refunds");
        require(c.donations[msg.sender] > 0, "No donation to refund");

        uint amount = c.donations[msg.sender];
        c.donations[msg.sender] = 0;
        c.currentAmount -= amount;

        (bool sent, ) = payable(msg.sender).call{value: amount}("");
        require(sent, "Refund failed");

        emit RefundClaimed(_campaignId, msg.sender, amount);
    }

    function isClosed(uint _campaignId) external view returns (bool) {
        require(campaigns[_campaignId].exists, "Campaign not found");
        return campaigns[_campaignId].closed;
    }

    function viewCampaign(uint _campaignId) external view returns (
        string memory, string memory, uint, uint, uint, uint, address, bool, bool, bool
    ) {
        Campaign storage c = campaigns[_campaignId];
        require(c.exists, "Campaign not found");
        return (
            c.title,
            c.description,
            c.goalAmount,
            c.totalRaised,
            c.startTime,
            c.endTime,
            c.creator,
            c.closed,
            c.goalReached,
            c.fundsClaimed
        );
    }
}
