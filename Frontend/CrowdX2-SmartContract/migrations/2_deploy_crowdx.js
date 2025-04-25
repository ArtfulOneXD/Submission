const CrowdXCampaign = artifacts.require("CrowdXCampaign");

module.exports = function (deployer) {
  deployer.deploy(CrowdXCampaign);
};
