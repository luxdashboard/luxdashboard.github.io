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
    bool rightType;
    uint leaseLength;
  }

  uint public rightsCount = 0;
  uint public totalAcres = 0;

   //uint == ID
   mapping (uint => Water) public water;
   mapping (address => Water[]) public ownership;
   mapping (address => uint) public owners;
   mapping (address => uint) public purchaseTotal;
   mapping (address => uint) public salesTotal;

   Water public newWater;


  event LogBid(address indexed _highestBidder, uint256 _highestBid);
  event LogWithdrawal(address indexed _withdrawer, uint256 amount);

// Assign values to some properties during deployment
 constructor () {

   water[0] = Water(0, 0xc2ab56188cdFC64f19fb9DE3612ff50f11B45D22, true, "Colorado", "Winter Park", 150, 160, false, true, 0);
   rightsCount++;

   water[1] = Water(1, msg.sender, true, "Big Thompson", "Northern Water", 275, 500, true, true, 0);
   rightsCount++;

   water[2] = Water(2, 0xc2ab56188cdFC64f19fb9DE3612ff50f11B45D22, true, "South Platte", "Mount Werner", 25, 50, true, false, 12);
   rightsCount++;

   water[3] = Water(3, 0x8356797B7c6CaAfE80d4cd3A308E6C00dBB7bD00, true, "Green", "Donala", 350, 1500, true, false, 36);
   rightsCount++;

   water[4] = Water(4, msg.sender, true, "Yampa", "Donala", 300, 270, false, true, 0);
   rightsCount++;

   water[5] = Water(5, 0x8356797B7c6CaAfE80d4cd3A308E6C00dBB7bD00, true, "Dolores", "Centennial", 650, 2400, false, false, 12);
   rightsCount++;

   water[6] = Water(6, 0x8356797B7c6CaAfE80d4cd3A308E6C00dBB7bD00, true, "Big Thompson", "St. Charles Mesa", 85, 400, false, true, 0);
   rightsCount++;

   water[7] = Water(7, msg.sender, true, "Gunnison", "Widefield", 115, 90, false, false, 36);
   rightsCount++;

   //water[8] = Water(8, 0x8356797B7c6CaAfE80d4cd3A308E6C00dBB7bD00, true, "Blue", "Donala", 45, 110, false, false, 18);
   //rightsCount++;

   //water[9] = Water(9, 0x6BCa5F02dCF3eABca074DDE57d3d1BB5173A94F5, true, "Arkansas", "East Cherry Creek Valley", 650, 2400, true, true, 0);
   //rightsCount++;

   //water[10] = Water(10, 0x8356797B7c6CaAfE80d4cd3A308E6C00dBB7bD00, true, "Taylor", "Eagle River", 45, 110, false, true, 0);
   //rightsCount++;

   //water[11] = Water(11, 0x8356797B7c6CaAfE80d4cd3A308E6C00dBB7bD00, true, "Clear Creek", "Grand", 45, 110, false, false, 48);
   //rightsCount++;

   //water[12] = Water(12, msg.sender, true, "Mancos", "Parker", 300, 270, false, false, 13);
   //rightsCount++;

   owners[msg.sender] = 3;
   owners[0xc2ab56188cdFC64f19fb9DE3612ff50f11B45D22] = 2;
   //owners[0x6BCa5F02dCF3eABca074DDE57d3d1BB5173A94F5] = 4;
   owners[0x8356797B7c6CaAfE80d4cd3A308E6C00dBB7bD00] = 3;

   ownership[0xc2ab56188cdFC64f19fb9DE3612ff50f11B45D22].push(Water(0, 0xc2ab56188cdFC64f19fb9DE3612ff50f11B45D22, true, "Colorado", "Winter Park", 150, 0, false, true, 0));
   ownership[msg.sender].push(Water(1, msg.sender, true, "Big Thompson", "Northern Water", 275, 500, true, true, 0));
   ownership[0xc2ab56188cdFC64f19fb9DE3612ff50f11B45D22].push(Water(2, 0xc2ab56188cdFC64f19fb9DE3612ff50f11B45D22, true, "South Platte", "Mount Werner", 25, 50, true, false, 12));
   ownership[0x8356797B7c6CaAfE80d4cd3A308E6C00dBB7bD00].push(Water(3, 0x8356797B7c6CaAfE80d4cd3A308E6C00dBB7bD00, true, "Green", "Donala", 350, 1500, true, false, 36));
   ownership[msg.sender].push(Water(4, msg.sender, true, "Yampa", "Donala", 300, 0, false, true, 0));
   ownership[0x8356797B7c6CaAfE80d4cd3A308E6C00dBB7bD00].push(Water(5, 0x8356797B7c6CaAfE80d4cd3A308E6C00dBB7bD00, true, "Dolores", "Centennial", 650, 2400, true, false, 12));
   ownership[0x8356797B7c6CaAfE80d4cd3A308E6C00dBB7bD00].push(Water(6, 0x8356797B7c6CaAfE80d4cd3A308E6C00dBB7bD00, true, "Big Thompson", "St. Charles Mesa", 85, 400, true, true, 0));
   ownership[msg.sender].push(Water(7, msg.sender, true, "Gunnison", "Widefield", 115, 90, false, false, 36));
   //ownership[0x8356797B7c6CaAfE80d4cd3A308E6C00dBB7bD00].push(Water(8, 0x8356797B7c6CaAfE80d4cd3A308E6C00dBB7bD00, true, "Blue", "Donala", 45, 110, false, false, 18));
   //ownership[0x6BCa5F02dCF3eABca074DDE57d3d1BB5173A94F5].push(Water(9, 0x6BCa5F02dCF3eABca074DDE57d3d1BB5173A94F5, true, "Arkansas", "East Cherry Creek Valley", 650, 2400, true, true, 0));
   //ownership[0x8356797B7c6CaAfE80d4cd3A308E6C00dBB7bD00].push(Water(10, 0x8356797B7c6CaAfE80d4cd3A308E6C00dBB7bD00, true, "Taylor", "Eagle River", 45, 110, false, true, 0));
   //ownership[0x8356797B7c6CaAfE80d4cd3A308E6C00dBB7bD00].push(Water(11, 0x8356797B7c6CaAfE80d4cd3A308E6C00dBB7bD00, true, "Clear Creek", "Grand", 45, 110, false, false, 48));
   //ownership[msg.sender].push(Water(12, msg.sender, true, "Mancos", "Parker", 300, 270, false, false, 13));

   totalAcres = 1950;

 }



 function getOwnerAssets(uint id) view public returns (Water memory) {
   return ownership[msg.sender][id];
 }

 function getOwnerNumber () view public returns (uint) {
   return owners[msg.sender];
 }

 function getOwnerPurchases () view public returns (uint) {
   return purchaseTotal[msg.sender];
 }

 function getOwnerSale () view public returns (uint) {
   return salesTotal[msg.sender];
 }


function addNewAsset (string memory source, string memory loc, uint amount, uint price, bool rightType, uint leaseLength) public {

  water[rightsCount] = Water(rightsCount, msg.sender, true, source, loc, amount, price, true, rightType, leaseLength);
  rightsCount++;

  owners[msg.sender] = owners[msg.sender] + 1;

  ownership[msg.sender].push(Water(rightsCount, msg.sender, true, source, loc, amount, price, true, rightType, leaseLength));

  totalAcres = totalAcres + amount;

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
       ownership[oldOwner][i].forSale=true;
       break;
     }
   }
}



//TO-DO:  Require ForSale == TRUE
 function transferOwnership(uint id) public {


   address oldOwner = water[id].owner;
   uint payPrice = water[id].price;

   salesTotal[oldOwner] = salesTotal[oldOwner] + payPrice;

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
   ownership[msg.sender].push(Water(id, msg.sender, true, water[id].waterSource, water[id].waterLocation, water[id].amount, 0, false, water[id].rightType, water[id].leaseLength));
   owners[msg.sender] = owners[msg.sender] + 1;
   purchaseTotal[msg.sender] = purchaseTotal[msg.sender] + payPrice;
  }

  else {
    ownership[msg.sender][foundIndex].active = true;
    ownership[msg.sender][foundIndex].forSale = false;
    purchaseTotal[msg.sender] = purchaseTotal[msg.sender] + payPrice;
  }

 }

 function fetchHighestBid() public view returns (uint id) {
   uint _highestBid = 7;
   return _highestBid;
 }

 function getOwner(uint index) public view returns (address) {
   return water[index].owner;
 }
}
