import React, { Component, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { parseEther, formatEther } from '@ethersproject/units';
import { Doughnut, Chart } from 'react-chartjs-2';
import Slider from "react-slick";
import { TodoListComponent } from '../apps/TodoList'
import { VectorMap } from "react-jvectormap"
import { AUCTION_ABI, AUCTION_ADDRESS } from "../../config.js";
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


function Dashboard () {


  const initialPriceData = Object.freeze({
  price: ""
});

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showSell, setShowSell] = useState(false);
  const handleCloseSell = () => setShowSell(false);
  const handleShowSell = () => setShowSell(true);
  const [beingBought, setBuying] = useState('');
  const [beingSold, setSelling] = useState('');
  const [priceData, updatePriceData] = useState(initialPriceData);
  const [availAcre, setavailAcre] = useState('');
  const [totalPurchases, setTotalPurchases] = useState('');
  const [totalSales, setTotalSales] = useState('');
  const [userHist, setUserHist] = useState('');
  const [chartData, setChartData] = useState('');
  const [checkTxnOne, setTxnOneBox] = useState(false);
  const [checkTxnTwo, setTxnTwoBox] = useState(false);

  const mapData = {
    "BZ": 75.00,
    "US": 56.25,
    "AU": 15.45,
    "GB": 25.00,
    "RO": 10.25,
    "GE": 33.25
  }

  const emptyAddress = '0x0000000000000000000000000000000000000000';
  const provider = new ethers.providers.Web3Provider(window.ethereum)

  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [currentSale, setCurrentSale] = useState([]);
  const [currentlyOwned, setCurrentlyOwned] = useState([]);
  const [amount, setAmount] = useState(0);
  const [myBid, setMyBid] = useState(0);
  const [isOwner, setIsOwner] = useState(false);
  const [highestBid, setHighestBid] = useState(0);
  const [highestBidder, setHighestBidder] = useState('');
  const [totalAllocation, setTotalAllocation] = useState('');

  async function getBal(address) {

    provider.getBalance(address).then((balance) => {
     // convert a currency unit from wei to ether
     const balanceInEth = ethers.utils.formatEther(balance)
     console.log(`balance: ${balanceInEth} ETH`)
     let newBalance = Math.round(balanceInEth*100)/100;
     setBalance(newBalance)
    })
  }


  // Sets up a new Ethereum provider and returns an interface for interacting with the smart contract
   async function initializeProvider() {
     const provider = new ethers.providers.Web3Provider(window.ethereum);
     const signer = provider.getSigner();

     return new ethers.Contract(AUCTION_ADDRESS, AUCTION_ABI, signer);
   }


  async function requestAccount() {
   const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
   setAccount(accounts[0]);
   getBal(accounts[0])
   getTxnHistory(accounts[0])
  }

  async function fetchHighestBid() {
   if (typeof window.ethereum !== 'undefined') {
     const contract = await initializeProvider();
     try {
       const highestBid = await contract.fetchHighestBid();
       const { bidAmount, bidder } = highestBid;

     // Convert bidAmount from Wei to Ether and round value to 4 decimal places
        setHighestBid(parseFloat(formatEther(bidAmount.toString())).toPrecision(4));
        setHighestBidder(bidder.toLowerCase());
     } catch (e) {
       console.log('error fetching highest bid: ', e);
     }
   }
 }


 async function grabAvailAcres() {
  if (typeof window.ethereum !== 'undefined') {
    const contract = await initializeProvider();

    try {

      const grabTotalAcre = await contract.totalAcres();
      var newTotalAcres = parseInt(grabTotalAcre, 10)
      setavailAcre(newTotalAcres)

    } catch (e) {
      console.log('error fetching acre/ft data: ', e);
    }
  }
 }

 async function grabTotalPurch() {
  if (typeof window.ethereum !== 'undefined') {
    const contract = await initializeProvider();

    try {

      const grabTotalPurch = await contract.getOwnerPurchases();
      var newTotalPurch = parseInt(grabTotalPurch, 10)
      setTotalPurchases(newTotalPurch)

    } catch (e) {
      console.log('error fetching purchase data: ', e);
    }
  }
 }

 async function grabTotalSale() {
  if (typeof window.ethereum !== 'undefined') {
    const contract = await initializeProvider();

    try {

      const grabTotalSale = await contract.getOwnerSale();
      var newTotalSale = parseInt(grabTotalSale, 10)
      setTotalSales(newTotalSale)

    } catch (e) {
      console.log('error fetching sale data: ', e);
    }
  }
 }


 async function getTxnHistory (addre) {
   const provider = new ethers.providers.Web3Provider(window.ethereum);

   const chainId = await provider.getNetwork()

   console.log(chainId)

   var chaiNetwork = chainId.name
   var addr = addre

   //chaiNetwork = 'ropsten'

   if (chaiNetwork != 'unknown') {

     let etherscanProvider = new ethers.providers.EtherscanProvider(chaiNetwork)

     etherscanProvider.getHistory(addr).then((history) => {

       var userTxnHistory = []

      history.forEach((tx) => {

        if ((parseInt(tx.value["_hex"]) != 0)) {

          let currentTimestamp = tx.timestamp*1000
          let date = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(currentTimestamp)

          tx.timestamp = date

          userTxnHistory.push(tx)
        }

      })

      var totalTxnCount = userTxnHistory.length

      if (userTxnHistory[totalTxnCount-2]) {
        setTxnOneBox(true)
      }

      if (userTxnHistory[totalTxnCount-1]) {
        setTxnTwoBox(true)
      }

      var userAbrTxnHistory = [userTxnHistory[totalTxnCount-2], userTxnHistory[totalTxnCount-1]]

      setUserHist(userAbrTxnHistory)

      console.log(userAbrTxnHistory)

   });
  }
 }


 async function send_token(
  sender, receiver, strEther
) {
  console.log(`payWithMetamask(receiver=${receiver}, sender=${sender}, strEther=${strEther})`)

    let ethereum = window.ethereum;


    // Request account access if needed
    await ethereum.enable();


    let provider = new ethers.providers.Web3Provider(ethereum);

    // Acccounts now exposed
    const params = [{
        from: sender,
        to: receiver,
        value: ethers.utils.parseUnits(strEther, 'ether').toHexString()
    }];

    const transactionHash = await provider.send('eth_sendTransaction', params)
    console.log('transactionHash is ' + transactionHash);
  }

 async function completePurchase(beingBought) {
  if (typeof window.ethereum !== 'undefined') {
    const contract = await initializeProvider();
    try {

      send_token(account, beingBought[1], ".0001")

      const makePurchase = await contract.transferOwnership(beingBought[0]);

      handleClose()

    } catch (e) {
      console.log('error completing purchase: ', e);
    }
  }
}

async function reListAssetForSale(beingSold) {
 if (typeof window.ethereum !== 'undefined') {
   const contract = await initializeProvider();
   try {

     const makePurchase = await contract.listForSale(beingSold[0], parseInt(priceData.price, 10));

     handleCloseSell()

   } catch (e) {
     console.log('error listing asset: ', e);
   }
 }
}


async function testFetch() {
  const contract = await initializeProvider();
  var saleCount = await contract.getSaleCount();
  try {
    var currentRightsForSale = []
    for (var i = 0; i < saleCount; i++) {
      const oneRight = await contract.getRight(i)
      if (oneRight.forSale == true){
        currentRightsForSale.push(oneRight)
      }
      else {
        console.log("not for sale!")
      }
    }
    setCurrentSale(currentRightsForSale);
  } catch (e) {
    console.log('error fetching marketplace assets: ', e);
  }
}

async function fetchOwnedAssets() {
  const contract = await initializeProvider();
  var assetCount = await contract.getOwnerNumber();
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const curAccount = accounts[0]
  var myAllocation = 0;
  var ownedAllocation = 0;
  var leasedAllocation = 0;
  var currentlySale = 0;

  try {
    var currentlyOwnedAssets = []
    for (var i = 0; i < assetCount; i++) {
      const oneRight = await contract.getOwnerAssets(i)
      if ((oneRight.owner.toUpperCase() == curAccount.toUpperCase()) && (oneRight.active == true)){
        currentlyOwnedAssets.push(oneRight)
        myAllocation = myAllocation + parseInt(oneRight.amount, 10);

        if (oneRight.forSale) {
          currentlySale = currentlySale + parseInt(oneRight.amount, 10)
        }

        else if (oneRight.rightType) {
          ownedAllocation = ownedAllocation + parseInt(oneRight.amount, 10)
        }
        else {
          leasedAllocation = leasedAllocation + parseInt(oneRight.amount, 10)
        }
      }
      else {
        console.log("right previously sold!")
      }
    }

    var newChartData = [currentlySale, ownedAllocation, leasedAllocation]
    setChartData(newChartData)
    setCurrentlyOwned(currentlyOwnedAssets);
    setTotalAllocation(myAllocation);

  } catch (e) {
    console.log('error fetching owned assets: ', e);
  }
}



var transactionHistoryData =  {
  labels: ["For Sale", "Own", "Lease"],
  legend: {display: true, position: "right"},
  datasets: [{
      data: chartData,
      backgroundColor: [
        "#111111","#00d25b","#ffab00"
      ]
    }
  ]
};



 async function fetchForSale() {
  if (typeof window.ethereum !== 'undefined') {
    const contract = await initializeProvider();
    var saleCount = await contract.getSaleCount().call()
    try {
      alert (saleCount)
      const highestBid = await contract.fetchHighestBid();
      const { bidAmount, bidder } = highestBid;

    // Convert bidAmount from Wei to Ether and round value to 4 decimal places
       setHighestBid(parseFloat(formatEther(bidAmount.toString())).toPrecision(4));
       setHighestBidder(bidder.toLowerCase());
    } catch (e) {
      console.log('error fetching highest bid: ', e);
    }
  }
}

 async function fetchMyBid() {
   if (typeof window.ethereum !== 'undefined') {
     const contract = await initializeProvider();
     try {
       const myBid = await contract.bids(account);
       setMyBid(parseFloat(formatEther(myBid.toString())).toPrecision(4));
     } catch (e) {
       console.log('error fetching my bid: ', e);
     }
   }
 }

 async function addRight() {
   if (typeof window.ethereum !== 'undefined') {
     const contract = await initializeProvider();
     try {
       const owner = await contract.getOwner();
       setIsOwner(owner.toLowerCase() === account);
     } catch (e) {
       console.log('error adding right: ', e);
     }
   }
 }

 async function fetchOwner() {
   if (typeof window.ethereum !== 'undefined') {
     const contract = await initializeProvider();
     try {
       const owner = await contract.getOwner();
       setIsOwner(owner.toLowerCase() === account);
     } catch (e) {
       console.log('error fetching owner: ', e);
     }
   }
 }

 async function submitBid(event) {
   event.preventDefault();
   if (typeof window.ethereum !== 'undefined') {
     const contract = await initializeProvider();
     try {
       // User inputs amount in terms of Ether, convert to Wei before sending to the contract.
       const wei = parseEther(amount);
       await contract.makeBid({ value: wei });
       // Wait for the smart contract to emit the LogBid event then update component state
       contract.on('LogBid', (_, __) => {
         fetchMyBid();
         fetchHighestBid();
       });
     } catch (e) {
       console.log('error making bid: ', e);
     }
   }
 }


 async function withdraw() {
   if (typeof window.ethereum !== 'undefined') {
     const contract = await initializeProvider();
     // Wait for the smart contract to emit the LogWithdrawal event and update component state
     contract.on('LogWithdrawal', (_) => {
       fetchMyBid();
       fetchHighestBid();
     });
     try {
       await contract.withdraw();
     } catch (e) {
       console.log('error withdrawing fund: ', e);
     }
   }
 }

  async function buyWaterRight(id, owner, waterSource, waterLocation, amount, price, rightType, rightLength) {
  handleShow()
  setBuying([id, owner, waterSource, waterLocation, amount, price, rightType, rightLength])
  }

  async function sellWaterRight(id, waterSource, waterLocation, amount, rightType, rightLength) {
  handleShowSell()
  setSelling([id, waterSource, waterLocation, amount, rightType, rightLength])
  }


  const handleChange = (e) => {
      updatePriceData({
        ...priceData,

        // Trimming any whitespace
        [e.target.name]: e.target.value.trim()
      });
    };


  function renderMarketData() {
        return currentSale.map((eachSale, index) => {
           const { id, owner, active, waterSource, waterLocation, amount, price, rightType, leaseLength } = eachSale //destructuring

           return (
             <tr>
                 <td key={id}>

                   <div className="preview-thumbnail">
                     <div className="preview-icon bg-primary text-center">
                       <i className="mdi mdi-ethereum buy-preview" style={{color:"white"}} onClick={() => {buyWaterRight(id, owner, waterSource, waterLocation, amount, price, rightType, leaseLength)}}></i>
                     </div>
                   </div>
                 </td>
                 <td>{id.toString()}</td>
                 <td>{waterSource}</td>
                 <td> {waterLocation} </td>
                 <td> {owner.toString().length > 10 ? owner.toString().substring(0, 7) + "..." : owner.toString()} </td>
                 <td> {amount.toString()} </td>
                 <td> {parseInt(price["_hex"])} </td>
                 <td>
                   <div className="badge badge-outline-success">Active</div>
                 </td>
                </tr>
           )
        })
     }



function renderTableData() {
      return currentlyOwned.map((eachSale, index) => {
         const { id, owner, active, waterSource, waterLocation, amount, price, forSale, rightType, leaseLength } = eachSale //destructuring

         return (
           <div className="preview-item border-bottom" key={id}>
             <div className="preview-thumbnail">
               <div className="preview-icon bg-primary">
                 <i className="mdi mdi-ethereum" onClick={() => {sellWaterRight(id, waterSource, waterLocation, amount, rightType, leaseLength)}}></i>
               </div>
             </div>
             <div className="preview-item-content d-sm-flex flex-grow">
               <div className="flex-grow">
                 <h6 className="preview-subject">{waterSource} ({waterLocation})</h6>
                 <p className="text-muted mb-0">{rightType ? "Owned" : ("Lease: " + leaseLength + " months remaining" )}</p>
               </div>
               <div className="mr-auto text-sm-right pt-2 pt-sm-0">
                 <p className="text-muted">Total: {amount.toString()} Acre/Ft</p>
                 <p className="text-muted mb-0">Used: 0 Acre/Ft</p>
               </div>
             </div>
           </div>
         )
      })
   }


  const transactionHistoryOptions = {
    responsive: true,
    maintainAspectRatio: true,
    segmentShowStroke: false,
    cutoutPercentage: 70,
    elements: {
      arc: {
          borderWidth: 0
      }
    },
    legend: {
      display: true,
      padding: 45,
      position: "bottom"
    },
    tooltips: {
      enabled: true
    }
  }

  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  }

  useEffect(() => {
   requestAccount();
   testFetch();
   fetchOwnedAssets();
   grabAvailAcres()
   grabTotalPurch()
   grabTotalSale()
 }, []);

 useEffect(() => {
   if (account) {
      console.log(account)
   }
 }, [account]);

    return (
      <div>
        {/*<div className="row">
          <div className="col-12 grid-margin stretch-card">
            <div className="card corona-gradient-card">
              <div className="card-body py-0 px-0 px-sm-3">
                <div className="row align-items-center">
                  <div className="col-4 col-sm-3 col-xl-2">
                    <img src={require('../../assets/images/dashboard/Group126@2x.png')} className="gradient-corona-img img-fluid" alt="banner" />
                  </div>
                  <div className="col-5 col-sm-7 col-xl-8 p-0">
                    <h4 className="mb-1 mb-sm-0">Atreides Water Account</h4>
                    <p className="mb-0 font-weight-normal d-none d-sm-block">Atreides is your path to buying, selling, and trading water rights in the USA!</p>
                  </div>
                  <div className="col-3 col-sm-2 col-xl-2 pl-0 text-center">
                    <button className="btn btn-outline-light btn-rounded get-started-btn">Get Started</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>*/}
        <div className="row">
          <div className="col-xl-3 col-sm-6 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-9">
                    <div className="d-flex align-items-center align-self-start">
                      <h3 className="mb-0">{totalAllocation}</h3>
                      <p className="text-success ml-2 mb-0 font-weight-medium">Acre/Ft</p>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="icon icon-box-success ">
                      <span className="mdi mdi-arrow-top-right icon-item"></span>
                    </div>
                  </div>
                </div>
                <h6 className="text-muted font-weight-normal">Total Allocation</h6>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-9">
                    <div className="d-flex align-items-center align-self-start">
                      <h3 className="mb-0">0</h3>
                      <p className="text-success ml-2 mb-0 font-weight-medium">Acre/Ft</p>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="icon icon-box-success">
                      <span className="mdi mdi-arrow-top-right icon-item"></span>
                    </div>
                  </div>
                </div>
                <h6 className="text-muted font-weight-normal">Total Used</h6>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-9">
                    <div className="d-flex align-items-center align-self-start">
                      <h3 className="mb-0">{totalAllocation}</h3>
                      <p className="text-danger ml-2 mb-0 font-weight-medium">Acre/Ft</p>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="icon icon-box-danger">
                      <span className="mdi mdi-arrow-bottom-left icon-item"></span>
                    </div>
                  </div>
                </div>
                <h6 className="text-muted font-weight-normal">Remaining</h6>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-9">
                    <div className="d-flex align-items-center align-self-start">
                      <h3 className="mb-0">{availAcre}</h3>
                      <p className="text-success ml-2 mb-0 font-weight-medium">Acre/Ft</p>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="icon icon-box-success ">
                      <span className="mdi mdi-arrow-top-right icon-item"></span>
                    </div>
                  </div>
                </div>
                <h6 className="text-muted font-weight-normal">Market Supply</h6>
              </div>
            </div>
          </div>
        </div>


        <div className="row">
          {/*<div className="col-md-4 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Recent Activity</h4>
                {checkTxnOne ?
                <div className="bg-gray-dark d-flex d-md-block d-xl-flex flex-row py-3 px-4 px-md-3 px-xl-4 rounded mt-3">
                  <div className="text-md-center text-xl-left">
                    <h6 className="mb-1">Transfer to {userHist[1] ? userHist[1].to.toString().substring(0, 5) + "..." : null}</h6>
                    <p className="text-muted mb-0">{userHist[1] ? userHist[1].timestamp : "NULL"}</p>
                  </div>
                  <div className="align-self-center flex-grow text-right text-md-center text-xl-right py-md-2 py-xl-0">
                    <h6 className="font-weight-bold mb-0">{userHist[1] ? ethers.utils.formatEther((parseInt(userHist[1].value["_hex"]*10000000000))) : "NULL"}</h6>
                  </div>
                </div>
                : null }

                {checkTxnTwo ?
                <div className="bg-gray-dark d-flex d-md-block d-xl-flex flex-row py-3 px-4 px-md-3 px-xl-4 rounded mt-3">
                  <div className="text-md-center text-xl-left">
                    <h6 className="mb-1">Tranfer to {userHist[0] ? userHist[0].to.toString().substring(0, 5) + "..." : "NULL"}</h6>
                    <p className="text-muted mb-0">{userHist[0] ? userHist[0].timestamp : "NULL"}</p>
                  </div>
                  <div className="align-self-center flex-grow text-right text-md-center text-xl-right py-md-2 py-xl-0">
                    <h6 className="font-weight-bold mb-0">{userHist[0] ? ethers.utils.formatEther(parseInt(userHist[0].value["_hex"]*10000000000)) : "NULL"}</h6>
                  </div>
                </div>
                :
                <div className="bg-gray-dark d-flex d-md-block d-xl-flex flex-row py-3 px-4 px-md-3 px-xl-4 rounded mt-3">
                  <div className="text-md-center text-xl-left">
                    <h6 className="mb-1">No Recent Transactions!</h6>
                  </div>
                </div>
              }
              </div>
            </div>
          </div>
          */}



          <div className="col-md-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">

              <h4 className="card-title">My Water Rights</h4>
                <div className="row">
                  <div className="col-6">
                    <div className="aligner-wrapper">
                      <Doughnut data={transactionHistoryData} options={transactionHistoryOptions} />
                      <div className="absolute center-content">
                        <h5 className="font-weight-normal text-whiite text-center mb-2 text-white">{totalAllocation} Acre/Ft</h5>
                        <p className="text-small text-muted text-center mb-0">Current Rights</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-6 align-items-center">
                    <div className="row">
                      <div className="col-12">
                        <div className="preview-list">

                          {renderTableData()}

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="row">
          <div className="col-sm-4 grid-margin">
            <div className="card h-100">
              <div className="card-body">
                <h5>Assets</h5>
                <div className="row">
                  <div className="col-8 col-sm-12 col-xl-8 my-auto">
                    <div className="d-flex d-sm-block d-md-flex align-items-center">
                      <h2 className="mb-0">{balance}</h2>
                      <p className="text-success ml-2 mb-0 font-weight-medium">ETH</p>
                    </div>
                    <h6 className="text-muted font-weight-normal">{(balance*.66).toFixed(6)} available to trade</h6>
                  </div>
                  <div className="col-4 col-sm-12 col-xl-4 text-center text-xl-right">
                    <i className="icon-lg mdi mdi-codepen text-primary ml-auto"></i>
                  </div>
                </div>

                <div className="row">
                  <div className="col-8 col-sm-12 col-xl-8 my-auto">
                    <div className="d-flex d-sm-block d-md-flex align-items-center">
                      <h2 className="mb-0">${(balance * 3162).toFixed(2)}</h2>
                      <p className="text-success ml-2 mb-0 font-weight-medium">USD</p>
                    </div>
                    <h6 className="text-muted font-weight-normal">${(balance*.66 * 3162).toFixed(2)} available to trade</h6>
                  </div>
                  <div className="col-4 col-sm-12 col-xl-4 text-center text-xl-right">
                    <i className="icon-lg mdi mdi-currency-usd text-primary ml-auto"></i>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div className="col-sm-4 grid-margin">
            <div className="card h-100">
              <div className="card-body">
                <h4 className="card-title">Recent Activity</h4>
                {checkTxnOne ?
                <div className="bg-gray-dark d-flex d-md-block d-xl-flex flex-row py-3 px-4 px-md-3 px-xl-4 rounded mt-3">
                  <div className="text-md-center text-xl-left">
                    <h6 className="mb-1">Transfer to {userHist[1] ? userHist[1].to.toString().substring(0, 5) + "..." : null}</h6>
                    <p className="text-muted mb-0">{userHist[1] ? userHist[1].timestamp : "NULL"}</p>
                  </div>
                  <div className="align-self-center flex-grow text-right text-md-center text-xl-right py-md-2 py-xl-0">
                    <h6 className="font-weight-bold mb-0">{userHist[1] ? ethers.utils.formatEther((parseInt(userHist[1].value["_hex"]))) : "NULL"}</h6>
                  </div>
                </div>
                : null }

                {checkTxnTwo ?
                <div className="bg-gray-dark d-flex d-md-block d-xl-flex flex-row py-3 px-4 px-md-3 px-xl-4 rounded mt-3">
                  <div className="text-md-center text-xl-left">
                    <h6 className="mb-1">Tranfer to {userHist[0] ? userHist[0].to.toString().substring(0, 5) + "..." : "NULL"}</h6>
                    <p className="text-muted mb-0">{userHist[0] ? userHist[0].timestamp : "NULL"}</p>
                  </div>
                  <div className="align-self-center flex-grow text-right text-md-center text-xl-right py-md-2 py-xl-0">
                    <h6 className="font-weight-bold mb-0">{userHist[0] ? ethers.utils.formatEther(parseInt(userHist[0].value["_hex"])) : "NULL"}</h6>
                  </div>
                </div>
                :
                <div className="bg-gray-dark d-flex d-md-block d-xl-flex flex-row py-3 px-4 px-md-3 px-xl-4 rounded mt-3">
                  <div className="text-md-center text-xl-left">
                    <h6 className="mb-1">No Recent Transactions!</h6>
                  </div>
                </div>
              }
              </div>
            </div>
          </div>
          <div className="col-sm-4 grid-margin">
            <div className="card h-100">
              <div className="card-body">
                <h5>Purchases</h5>
                <div className="row">
                  <div className="col-8 col-sm-12 col-xl-8 my-auto">
                    <div className="d-flex d-sm-block d-md-flex align-items-center">
                      <h2 className="mb-0">${totalPurchases}</h2>
                      <p className="text-danger ml-2 mb-0 font-weight-medium">-2.1% </p>
                    </div>
                    <h6 className="text-muted font-weight-normal">2.27% Since last month</h6>
                  </div>
                  <div className="col-4 col-sm-12 col-xl-4 text-center text-xl-right">
                    <i className="icon-lg mdi mdi-chart-line text-success ml-auto"></i>
                  </div>
                </div>
                <br />
                <br />

                <h5>Sales</h5>
                <div className="row">
                  <div className="col-8 col-sm-12 col-xl-8 my-auto">
                    <div className="d-flex d-sm-block d-md-flex align-items-center">
                      <h2 className="mb-0">${totalSales}</h2>
                      <p className="text-danger ml-2 mb-0 font-weight-medium">-3.9% </p>
                    </div>
                    <h6 className="text-muted font-weight-normal">1.02% Since last month</h6>
                  </div>
                  <div className="col-4 col-sm-12 col-xl-4 text-center text-xl-right">
                    <i className="icon-lg mdi mdi-chart-bar text-success ml-auto"></i>
                  </div>
                </div>


              </div>
            </div>
          </div>
        </div>
        <div className="row ">
          <div className="col-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Purchase Water Rights (Atreides Markeplace)</h4>
                <p> Permit Rights by District </p>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>
                          Buy
                        </th>
                        <th> ID </th>
                        <th> Location </th>
                        <th> Source </th>
                        <th> Owner </th>
                        <th> Amount </th>
                        <th> Price </th>
                        <th> Status </th>
                      </tr>
                    </thead>
                    <tbody>
                      {renderMarketData()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*
        <div className="row">
          <div className="col-md-6 col-xl-4 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <div className="d-flex flex-row justify-content-between">
                  <h4 className="card-title">Messages</h4>
                  <p className="text-muted mb-1 small">View all</p>
                </div>
                <div className="preview-list">
                  <div className="preview-item border-bottom">
                    <div className="preview-thumbnail">
                      <img src={require('../../assets/images/faces/face6.jpg')} alt="face" className="rounded-circle" />
                    </div>
                    <div className="preview-item-content d-flex flex-grow">
                      <div className="flex-grow">
                        <div className="d-flex d-md-block d-xl-flex justify-content-between">
                          <h6 className="preview-subject">Leonard</h6>
                          <p className="text-muted text-small">5 minutes ago</p>
                        </div>
                        <p className="text-muted">Well, it seems to be working now.</p>
                      </div>
                    </div>
                  </div>
                  <div className="preview-item border-bottom">
                    <div className="preview-thumbnail">
                      <img src={require('../../assets/images/faces/face8.jpg')} alt="face" className="rounded-circle" />
                    </div>
                    <div className="preview-item-content d-flex flex-grow">
                      <div className="flex-grow">
                        <div className="d-flex d-md-block d-xl-flex justify-content-between">
                          <h6 className="preview-subject">Luella Mills</h6>
                          <p className="text-muted text-small">10 Minutes Ago</p>
                        </div>
                        <p className="text-muted">Well, it seems to be working now.</p>
                      </div>
                    </div>
                  </div>
                  <div className="preview-item border-bottom">
                    <div className="preview-thumbnail">
                      <img src={require('../../assets/images/faces/face9.jpg')} alt="face" className="rounded-circle" />
                    </div>
                    <div className="preview-item-content d-flex flex-grow">
                      <div className="flex-grow">
                        <div className="d-flex d-md-block d-xl-flex justify-content-between">
                          <h6 className="preview-subject">Ethel Kelly</h6>
                          <p className="text-muted text-small">2 Hours Ago</p>
                        </div>
                        <p className="text-muted">Please review the tickets</p>
                      </div>
                    </div>
                  </div>
                  <div className="preview-item border-bottom">
                    <div className="preview-thumbnail">
                      <img src={require('../../assets/images/faces/face11.jpg')} alt="face" className="rounded-circle" />
                    </div>
                    <div className="preview-item-content d-flex flex-grow">
                      <div className="flex-grow">
                        <div className="d-flex d-md-block d-xl-flex justify-content-between">
                          <h6 className="preview-subject">Herman May</h6>
                          <p className="text-muted text-small">4 Hours Ago</p>
                        </div>
                        <p className="text-muted">Thanks a lot. It was easy to fix it .</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-xl-4 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Portfolio Slide</h4>
                <Slider className="portfolio-slider" {...sliderSettings}>
                  <div className="item">
                    <img src={require('../../assets/images/dashboard/Rectangle.jpg')} alt="carousel-item" />
                  </div>
                  <div className="item">
                    <img src={require('../../assets/images/dashboard/Img_5.jpg')} alt="carousel-item" />
                  </div>
                  <div className="item">
                    <img src={require('../../assets/images/dashboard/img_6.jpg')} alt="carousel-item" />
                  </div>
                </Slider>
                <div className="d-flex py-4">
                  <div className="preview-list w-100">
                    <div className="preview-item p-0">
                      <div className="preview-thumbnail">
                        <img src={require('../../assets/images/faces/face12.jpg')} className="rounded-circle" alt="face" />
                      </div>
                      <div className="preview-item-content d-flex flex-grow">
                        <div className="flex-grow">
                          <div className="d-flex d-md-block d-xl-flex justify-content-between">
                            <h6 className="preview-subject">CeeCee Bass</h6>
                            <p className="text-muted text-small">4 Hours Ago</p>
                          </div>
                          <p className="text-muted">Well, it seems to be working now.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-muted">Well, it seems to be working now. </p>
                <div className="progress progress-md portfolio-progress">
                  <div className="progress-bar bg-success" role="progressbar" style={{width: '50%'}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 col-xl-4 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">To do list</h4>
                <TodoListComponent />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Visitors by Countries</h4>
                <div className="row">
                  <div className="col-md-5">
                    <div className="table-responsive">
                      <table className="table">
                        <tbody>
                          <tr>
                            <td>
                              <i className="flag-icon flag-icon-us"></i>
                            </td>
                            <td>USA</td>
                            <td className="text-right"> 1500 </td>
                            <td className="text-right font-weight-medium"> 56.35% </td>
                          </tr>
                          <tr>
                            <td>
                              <i className="flag-icon flag-icon-de"></i>
                            </td>
                            <td>Germany</td>
                            <td className="text-right"> 800 </td>
                            <td className="text-right font-weight-medium"> 33.25% </td>
                          </tr>
                          <tr>
                            <td>
                              <i className="flag-icon flag-icon-au"></i>
                            </td>
                            <td>Australia</td>
                            <td className="text-right"> 760 </td>
                            <td className="text-right font-weight-medium"> 15.45% </td>
                          </tr>
                          <tr>
                            <td>
                              <i className="flag-icon flag-icon-gb"></i>
                            </td>
                            <td>United Kingdom</td>
                            <td className="text-right"> 450 </td>
                            <td className="text-right font-weight-medium"> 25.00% </td>
                          </tr>
                          <tr>
                            <td>
                              <i className="flag-icon flag-icon-ro"></i>
                            </td>
                            <td>Romania</td>
                            <td className="text-right"> 620 </td>
                            <td className="text-right font-weight-medium"> 10.25% </td>
                          </tr>
                          <tr>
                            <td>
                              <i className="flag-icon flag-icon-br"></i>
                            </td>
                            <td>Brasil</td>
                            <td className="text-right"> 230 </td>
                            <td className="text-right font-weight-medium"> 75.00% </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="col-md-7">
                    <div id="audience-map" className="vector-map"></div>
                    <VectorMap
                    map={"world_mill"}
                    backgroundColor="transparent" //change it to ocean blue: #0077be
                    panOnDrag={true}
                    containerClassName="dashboard-vector-map"
                    focusOn= { {
                      x: 0.5,
                      y: 0.5,
                      scale: 1,
                      animate: true
                    }}
                    series={{
                      regions: [{
                        scale: ['#3d3c3c', '#f2f2f2'],
                        normalizeFunction: 'polynomial',
                        values: mapData
                      }]
                    }}
                  />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        */}


        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Purchase Water Right</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3>Asset Details</h3>
          <p> You are purchasing the following right: </p>
          <p> Price: ${beingBought ? beingBought[5].toString() : ""}</p>
          <p> ID: {beingBought ? beingBought[0].toString() : ""}</p>
          <p> Owner: {beingBought ? beingBought[1].toString() : ""}</p>
          <p> Source: {beingBought ? beingBought[2].toString() : ""}</p>
          <p> Location: {beingBought ? beingBought[3].toString() : ""}</p>
          <p> Amount (Acre/Ft): {beingBought ? beingBought[4].toString() : ""}</p>
          <p> Type: {beingBought[6] ? "Purchase" : "Lease"}</p>
          {beingBought[6] ? null : <p> Length: {beingBought[7] ? parseInt(beingBought[7]["_hex"]) : null} months</p>}
          <Form>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="I understand that all sales are final" />
          </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" onClick={() => {completePurchase(beingBought)}}>
            Buy Now!
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showSell} onHide={handleCloseSell}>
      <Modal.Header closeButton>
        <Modal.Title>List Right for Sale</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h3>Asset Details</h3>
        <p> You are listing the following right: </p>
        <p> ID: {beingSold ? beingSold[0].toString() : ""}</p>
        <p> Source: {beingSold ? beingSold[1].toString() : ""}</p>
        <p> Location: {beingSold ? beingSold[2].toString() : ""}</p>
        <p> Amount (Acre/Ft): {beingSold ? beingSold[3].toString() : ""}</p>
        <p> Type: {beingSold[4] ? "Purchase" : "Lease"}</p>
        {beingSold[4] ? null : <p> Length: {beingSold[5] ? parseInt(beingSold[5]["_hex"]) : null} months</p>}
        <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Price (in $USD)</Form.Label>
          <Form.Control type="text" name="price" placeholder="Enter Sale Price" onChange={handleChange}/>
          <Form.Text className="text-muted">
            Please type your listing price in whole dollars
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="I understand that all sales are final" />
        </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseSell}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" onClick={() => {reListAssetForSale(beingSold)}}>
          Sell Now!
        </Button>
      </Modal.Footer>
    </Modal>


      </div>
    );
  }


export default Dashboard;
