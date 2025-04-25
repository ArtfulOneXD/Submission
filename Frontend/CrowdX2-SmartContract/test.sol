// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrowdXCampaign {
    // Auto-incrementing counter for campaign IDs.
    uint public campaignCounter =1;

    // Structure that holds all the campaign information.
    struct Campaign {
        string title;          // Campaign title (from frontend input)
        string description;    // Detailed description
        uint goalAmount;       // Funding goal (could be in wei or a custom unit)
        uint currentAmount;    // Amount raised so far (starts at 0)
        uint startTime;        // Start date as Unix timestamp (from frontend input)
        uint endTime;          // End date as Unix timestamp (from frontend input)
        address creator;       // The wallet address of the campaign creator
        bool exists;           // A flag to confirm the campaign exists
    }
    
    // Mapping to store all campaigns by a unique ID.
    mapping(uint => Campaign) public campaigns;
    
    // Event to indicate that a campaign has been created.
    event CampaignCreated(
        uint indexed campaignId,
        string title,
        string description,
        uint goalAmount,
        uint startTime,
        uint endTime,
        address indexed creator
    );
    
    /**
     * @notice Creates a new campaign.
     * @param _title The title of the campaign.
     * @param _description The description for the campaign.
     * @param _goalAmount The funding goal for the campaign.
     * @param _startTime The starting timestamp (Unix time) for the campaign.
     * @param _endTime The ending timestamp (Unix time) for the campaign.
     */
    function createCampaign(
        string memory _title,
        string memory _description,
        uint _goalAmount,
        uint _startTime,
        uint _endTime
    ) external {
        // Validate input: goal must be greater than zero, and the start must occur before the end.
        require(_goalAmount > 0, "Goal amount must be greater than zero");
        require(_startTime < _endTime, "Start time must be before end time");
        
        // Assign a unique campaign ID using the current counter.
        uint campaignId = campaignCounter;
        
        // Create and store the new campaign.
        campaigns[campaignId] = Campaign({
            title: _title,
            description: _description,
            goalAmount: _goalAmount,
            currentAmount: 0,       // Starts at 0, to be updated with donations.
            startTime: _startTime,
            endTime: _endTime,
            creator: msg.sender,    // Automatically record the wallet address calling this function.
            exists: true
        });
        
        // Emit an event to log the campaign creation.
        emit CampaignCreated(campaignId, _title, _description, _goalAmount, _startTime, _endTime, msg.sender);
        
        // Increment the counter so the next campaign gets a new ID.
        campaignCounter++;
    }
    
    // You may later add functions to handle donations, update campaigns, etc.
}
