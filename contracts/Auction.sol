// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

contract Auction {

  struct Water {
    uint id;
    address owner;
    bool active;
    string waterSource;
    string waterLocation;
    uint amount;
    uint price;
    bool forSale;
  }

  uint public rightsCount = 0;

   //uint == ID
   mapping (uint => Water) public water;
   mapping (address => Water[]) public ownership;
   mapping (address => uint) public owners;

   Water public newWater;


  event LogBid(address indexed _highestBidder, uint256 _highestBid);
  event LogWithdrawal(address indexed _withdrawer, uint256 amount);

// Assign values to some properties during deployment
 constructor () {

   water[0] = Water(0, 0xc2ab56188cdFC64f19fb9DE3612ff50f11B45D22, true, "Colorado", "Northern Water", 150, 0, false);
   rightsCount++;

   water[1] = Water(1, msg.sender, true, "Big Thompson", "Northern Water", 275, 500, true);
   rightsCount++;

   water[2] = Water(2, 0xc2ab56188cdFC64f19fb9DE3612ff50f11B45D22, true, "South Platte", "Northern Water", 25, 50, true);
   rightsCount++;

   water[3] = Water(3, 0xc2ab56188cdFC64f19fb9DE3612ff50f11B45D22, true, "Green", "Northern Water", 350, 1500, true);
   rightsCount++;

   water[4] = Water(4, msg.sender, true, "Yampa", "Northern Water", 300, 0, false);
   rightsCount++;

   owners[msg.sender] = 2;
   owners[0xc2ab56188cdFC64f19fb9DE3612ff50f11B45D22] = 3;

   ownership[0xc2ab56188cdFC64f19fb9DE3612ff50f11B45D22].push(Water(0, 0xc2ab56188cdFC64f19fb9DE3612ff50f11B45D22, true, "Colorado", "Northern Water", 150, 0, false));
   ownership[msg.sender].push(Water(1, msg.sender, true, "Big Thompson", "Northern Water", 275, 500, true));
   ownership[0xc2ab56188cdFC64f19fb9DE3612ff50f11B45D22].push(Water(2, 0xc2ab56188cdFC64f19fb9DE3612ff50f11B45D22, true, "South Platte", "Northern Water", 25, 50, true));
   ownership[0xc2ab56188cdFC64f19fb9DE3612ff50f11B45D22].push(Water(3, 0xc2ab56188cdFC64f19fb9DE3612ff50f11B45D22, true, "Green", "Northern Water", 350, 1500, true));
   ownership[msg.sender].push(Water(4, msg.sender, true, "Yampa", "Northern Water", 300, 0, false));


 }



 function getOwnerAssets(uint id) view public returns (Water memory) {
   return ownership[msg.sender][id];
 }

 function getOwnerNumber () view public returns (uint) {
   return owners[msg.sender];
 }

function addNewAsset (string memory source, string memory loc, uint amount, uint price) public {

  water[rightsCount] = Water(rightsCount, msg.sender, true, source, loc, amount, price, true);
  rightsCount++;

  owners[msg.sender] = owners[msg.sender] + 1;

  ownership[msg.sender].push(Water(rightsCount, msg.sender, true, source, loc, amount, price, true));

}

 function bid() public payable returns (bool) {

 }

 function getRight(uint index) view public returns (Water memory) {
   return water[index];
 }

 function getSaleCount() view public returns (uint) {
    return rightsCount;
  }

 /*function makeBid() public payable notOwner() returns (bool) {
   uint256 bidAmount = bids[msg.sender] + msg.value;
   require(bidAmount > highestBid.bidAmount, 'Bid error: Make a higher Bid.');

   highestBid.bidder = msg.sender;
   highestBid.bidAmount = bidAmount;
   bids[msg.sender] = bidAmount;
   emit LogBid(msg.sender, bidAmount);
   return true;
 }*/

 /*function withdraw() public notOngoing() isOwner() returns (bool) {
   uint256 amount = highestBid.bidAmount;
   bids[highestBid.bidder] = 0;
   highestBid.bidder = address(0);
   highestBid.bidAmount = 0;

   (bool success, ) = payable(owner).call{ value: amount }("");
   require(success, 'Withdrawal failed.');
   emit LogWithdrawal(msg.sender, amount);
   return true;
 }*/


function listForSale(uint id, uint price) public {
    water[id].price = price;
    water[id].forSale = true;

    address oldOwner = water[id].owner;

    uint oldOwnerLength = owners[oldOwner];

    for (uint i=0; i<oldOwnerLength; i++) {
       if (ownership[oldOwner][i].id == id) {
         ownership[oldOwner][i].active=false;
         ownership[oldOwner][i].forSale=true;
         break;
       }
     }
}


 function transferOwnership(uint id) public {

   address oldOwner = water[id].owner;

   water[id].owner = msg.sender;
   water[id].price = 0;
   water[id].forSale = false;

   uint oldOwnerLength = owners[oldOwner];

   for (uint i=0; i<oldOwnerLength; i++) {
      if (ownership[oldOwner][i].id == id) {
        ownership[oldOwner][i].active=false;
        ownership[oldOwner][i].forSale=false;
        break;
      }
    }

    uint newOwnerLength = owners[msg.sender];
    bool isFound = false;
    uint foundIndex = 0;

    for (uint i=0; i<newOwnerLength; i++) {
       if (ownership[msg.sender][i].id == id) {
         isFound=true;
         foundIndex = i;
         break;
       }
     }

    if (isFound == false){
   ownership[msg.sender].push(Water(id, msg.sender, true, water[id].waterSource, water[id].waterLocation, water[id].amount, 0, false));
  }

  else {
    ownership[msg.sender][foundIndex].active = true;
    ownership[msg.sender][foundIndex].forSale = false;
  }

   owners[msg.sender]++;
 }

 function fetchHighestBid() public view returns (uint id) {
   uint _highestBid = 7;
   return _highestBid;
 }

 function getOwner(uint index) public view returns (address) {
   return water[index].owner;
 }
}
