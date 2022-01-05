const Migrations = artifacts.require("Migrations");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};

const Auction = artifacts.require("Auction");

module.exports = function (deployer) {
 deployer.deploy(Auction);
};
