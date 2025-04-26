// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrowdXCampaign {
    uint public campaignCounter = 1;

    struct Campaign {
        string  title;
        string  description;
        uint    goalAmount;
        uint    currentAmount;
        uint    startTime;
        uint    endTime;
        address creator;
        bool    closed;
        bool    exists;
    }

    mapping(uint => Campaign) public campaigns;

    /// @notice Emitted when a new campaign is created
    event CampaignCreated(
        uint indexed campaignId,
        string title,
        string description,
        uint goalAmount,
        uint startTime,
        uint endTime,
        address indexed creator
    );

    /// @notice Emitted each time someone donates
    event DonationReceived(
        uint indexed campaignId,
        address indexed donor,
        uint amount
    );

    /// @notice Emitted when funds are finally released to the creator
    event CampaignClosed(
        uint indexed campaignId,
        address indexed creator,
        uint totalRaised
    );

    /// @notice Create a new campaign
    function createCampaign(
        string memory _title,
        string memory _description,
        uint _goalAmount,
        uint _startTime,
        uint _endTime
    ) external {
        require(_goalAmount > 0, "Goal must be > 0");
        require(_startTime < _endTime, "Start must be before end");

        uint id = campaignCounter;
        campaigns[id] = Campaign({
            title:         _title,
            description:   _description,
            goalAmount:    _goalAmount,
            currentAmount: 0,
            startTime:     _startTime,
            endTime:       _endTime,
            creator:       msg.sender,
            closed:        false,
            exists:        true
        });

        emit CampaignCreated(
            id, _title, _description, _goalAmount, _startTime, _endTime, msg.sender
        );

        campaignCounter++;
    }

    /// @notice Donate ETH to an existing campaign
    ///         Once the goal is reached, the creator is paid immediately.
    ///         Further donations are only accepted for 30 more seconds,
    ///         and then the campaign is fully closed.
    function donateCampaign(uint _campaignId) external payable {
        Campaign storage c = campaigns[_campaignId];
        require(c.exists,                  "Campaign not found");
        require(block.timestamp >= c.startTime, "Not started yet");
        require(!c.closed,                 "Campaign already closed");
        require(msg.value > 0,             "Must send ETH");

        // If we've already hit the goal, only allow 30 more seconds
        if (c.currentAmount >= c.goalAmount) {
            require(
                block.timestamp <= c.endTime + 30,
                "Funding goal met and window has expired"
            );
        }

        // 1) Effects
        c.currentAmount += msg.value;
        emit DonationReceived(_campaignId, msg.sender, msg.value);

        // 2) Interactions (payout) — only once when first crossing the goal
        if (
            c.currentAmount >= c.goalAmount &&
            !c.closed &&
            address(this).balance >= c.currentAmount
        ) {
            c.closed = true;                              // mark closed first
            uint payout = c.currentAmount;                // snapshot
            (bool sent, ) = payable(c.creator).call{value: payout}("");
            require(sent, "Fund transfer to creator failed");
            emit CampaignClosed(_campaignId, c.creator, payout);
        }
    }

    /// @notice Allows anyone to check if a campaign is closed
    function isClosed(uint _campaignId) external view returns (bool) {
        require(campaigns[_campaignId].exists, "Campaign not found");
        return campaigns[_campaignId].closed;
    }
}
