import React, { Component, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { parseEther, formatEther } from '@ethersproject/units';
import { AUCTION_ABI, AUCTION_ADDRESS } from "../../config.js";
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Trans } from 'react-i18next';
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function Navbar () {

  async function initializeProvider() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(AUCTION_ADDRESS, AUCTION_ABI, signer);
  }

  const initialSourceData = Object.freeze({
  source: ""
});

const initialLocData = Object.freeze({
  loc: ""
});

const initialAmountData = Object.freeze({
  amount: ""
});

const initialPriceData = Object.freeze({
  price: ""
});

const initialLeaseLengthData = Object.freeze({
  leaseLength: "0"
});

  const [show, setShow] = useState(false);
  const [leaseShow, setLeaseShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleLeaseShow = () => setLeaseShow(true);
  const [sourceData, updateSourceData] = useState(initialSourceData);
  const [locData, updateLocData] = useState(initialLocData);
  const [amountData, updateAmountData] = useState(initialAmountData);
  const [priceData, updatePriceData] = useState(initialPriceData);
  const [leaseOwn, setLeaseOwn] = useState(true);
  const [leaseLData, updateLeaseLData] = useState(initialLeaseLengthData);

  async function listAssetForSale() {
   if (typeof window.ethereum !== 'undefined') {
     const contract = await initializeProvider();
     try {

       var wSource = sourceData.source
       var wLoc = locData.loc
       var wAmount = parseInt(amountData.amount, 10)
       var wPrice = parseInt(priceData.price, 10)
       var wBool = leaseOwn
       var wLength = parseInt(leaseLData.leaseLength, 10)


       const makePurchase = await contract.addNewAsset(wSource, wLoc, wAmount, wPrice, wBool, wLength);

       handleClose()

     } catch (e) {
       console.log('error listing asset: ', e);
     }
   }
  }

  const handleSourceChange = (e) => {
      updateSourceData({
        ...sourceData,

        // Trimming any whitespace
        [e.target.name]: e.target.value.trim()
      });
    };

  const handleLocChange = (e) => {
      updateLocData({
        ...locData,

        // Trimming any whitespace
        [e.target.name]: e.target.value.trim()
      });
    };

  const handleAmountChange = (e) => {
      updateAmountData({
        ...amountData,

        // Trimming any whitespace
        [e.target.name]: e.target.value.trim()
      });
    };

  const handlePriceChange = (e) => {
      updatePriceData({
        ...priceData,

        // Trimming any whitespace
        [e.target.name]: e.target.value.trim()
      });
    };

  const handleLeaseLengthChange = (e) => {
      updateLeaseLData({
        ...leaseLData,

        // Trimming any whitespace
        [e.target.name]: e.target.value.trim()
      });
    };


  const handleLeaseChange = (e) => {

    updateLeaseLData({
      ...leaseLData,
      leaseLength: "0"
    });


    if (leaseShow) {
      setLeaseShow(false);
      setLeaseOwn(true);
    }

    else{
    setLeaseShow(true);
    setLeaseOwn(false);
    }
  };



  function toggleOffcanvas() {
    document.querySelector('.sidebar-offcanvas').classList.toggle('active');
  }
  function toggleRightSidebar() {
    document.querySelector('.right-sidebar').classList.toggle('open');
  }

    return (
      <nav className="navbar p-0 fixed-top d-flex flex-row">
        <div className="navbar-brand-wrapper d-flex d-lg-none align-items-center justify-content-center">
          <h2>Atreides</h2>
          {/*<Link className="navbar-brand brand-logo-mini" to="/"><img src={require('../../assets/images/logo-mini.svg')} alt="logo" /></Link>*/}
        </div>
        <div className="navbar-menu-wrapper flex-grow d-flex align-items-stretch">
          <button className="navbar-toggler align-self-center" type="button" onClick={ () => document.body.classList.toggle('sidebar-icon-only') }>
            <span className="mdi mdi-menu"></span>
          </button>
          <ul className="navbar-nav w-100">
            <li className="nav-item w-100">
              <form className="nav-link mt-2 mt-md-0 d-none d-lg-flex search">
                <input type="text" className="form-control" placeholder="Search products" />
              </form>
            </li>
          </ul>
          <ul className="navbar-nav navbar-nav-right">
            <Dropdown alignRight as="li" className="nav-item d-none d-lg-block">
                <Dropdown.Toggle className="nav-link btn btn-success create-new-button no-caret" onClick={handleShow}>
                + <Trans>List New Asset</Trans>
                </Dropdown.Toggle>

                <Dropdown.Menu className="navbar-dropdown preview-list create-new-dropdown-menu">
                  <h6 className="p-3 mb-0"><Trans>Asset Type</Trans></h6>
                  <Dropdown.Divider />
                  <Dropdown.Item href="!#" onClick={evt =>evt.preventDefault()} className="preview-item">
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-dark rounded-circle">
                        <i className="mdi mdi-file-outline text-primary"></i>
                      </div>
                    </div>
                    <div className="preview-item-content">
                      <p className="preview-subject mb-1"><Trans>Asset Type #1</Trans></p>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item href="!#" onClick={evt =>evt.preventDefault()} className="preview-item">
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-dark rounded-circle">
                        <i className="mdi mdi-web text-info"></i>
                      </div>
                    </div>
                    <div className="preview-item-content">
                      <p className="preview-subject mb-1"><Trans>Asset Type #2</Trans></p>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item href="!#" onClick={evt =>evt.preventDefault()} className="preview-item">
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-dark rounded-circle">
                        <i className="mdi mdi-layers text-danger"></i>
                      </div>
                    </div>
                    <div className="preview-item-content">
                      <p className="preview-subject mb-1"><Trans>Asset Type #3</Trans></p>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <p className="p-3 mb-0 text-center"><Trans>Other Asset Type</Trans></p>
                </Dropdown.Menu>
              </Dropdown>
            <li className="nav-item d-none d-lg-block">
              <a className="nav-link" href="!#" onClick={event => event.preventDefault()}>
                <i className="mdi mdi-view-grid"></i>
              </a>
            </li>
            <Dropdown alignRight as="li" className="nav-item border-left" >
              <Dropdown.Toggle as="a" className="nav-link count-indicator cursor-pointer">
                <i className="mdi mdi-email"></i>
                <span className="count bg-success"></span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="navbar-dropdown preview-list">
                  <h6 className="p-3 mb-0"><Trans>Messages</Trans></h6>
                  <Dropdown.Divider />
                  <Dropdown.Item href="!#" onClick={evt =>evt.preventDefault()} className="preview-item">
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-dark rounded-circle">
                        <img src={require('../../assets/images/faces/face4.jpg')} alt="profile" className="rounded-circle profile-pic" />
                      </div>
                    </div>
                    <div className="preview-item-content">
                      <p className="preview-subject ellipsis mb-1"><Trans>Mark send you a message</Trans></p>
                      <p className="text-muted mb-0"> 1 <Trans>Minutes ago</Trans> </p>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item href="!#" onClick={evt =>evt.preventDefault()} className="preview-item">
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-dark rounded-circle">
                        <img src={require('../../assets/images/faces/face2.jpg')} alt="profile" className="rounded-circle profile-pic" />
                      </div>
                    </div>
                    <div className="preview-item-content">
                      <p className="preview-subject ellipsis mb-1"><Trans>Cregh send you a message</Trans></p>
                      <p className="text-muted mb-0"> 15 <Trans>Minutes ago</Trans> </p>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item href="!#" onClick={evt =>evt.preventDefault()} className="preview-item">
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-dark rounded-circle">
                        <img src={require('../../assets/images/faces/face3.jpg')} alt="profile" className="rounded-circle profile-pic" />
                      </div>
                    </div>
                    <div className="preview-item-content">
                      <p className="preview-subject ellipsis mb-1"><Trans>Profile picture updated</Trans></p>
                      <p className="text-muted mb-0"> 18 <Trans>Minutes ago</Trans> </p>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <p className="p-3 mb-0 text-center">4 <Trans>new messages</Trans></p>
                </Dropdown.Menu>
            </Dropdown>
            <Dropdown alignRight as="li" className="nav-item border-left">
              <Dropdown.Toggle as="a" className="nav-link count-indicator cursor-pointer">
                <i className="mdi mdi-bell"></i>
                <span className="count bg-danger"></span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu navbar-dropdown preview-list">
                <h6 className="p-3 mb-0"><Trans>Notifications</Trans></h6>
                <Dropdown.Divider />
                <Dropdown.Item className="dropdown-item preview-item" onClick={evt =>evt.preventDefault()}>
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-dark rounded-circle">
                      <i className="mdi mdi-calendar text-success"></i>
                    </div>
                  </div>
                  <div className="preview-item-content">
                    <p className="preview-subject mb-1"><Trans>Event today</Trans></p>
                    <p className="text-muted ellipsis mb-0">
                    <Trans>Just a reminder that you have an event today</Trans>
                    </p>
                  </div>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="dropdown-item preview-item" onClick={evt =>evt.preventDefault()}>
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-dark rounded-circle">
                      <i className="mdi mdi-settings text-danger"></i>
                    </div>
                  </div>
                  <div className="preview-item-content">
                    <h6 className="preview-subject mb-1"><Trans>Settings</Trans></h6>
                    <p className="text-muted ellipsis mb-0">
                    <Trans>Update dashboard</Trans>
                    </p>
                  </div>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="dropdown-item preview-item" onClick={evt =>evt.preventDefault()}>
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-dark rounded-circle">
                      <i className="mdi mdi-link-variant text-warning"></i>
                    </div>
                  </div>
                  <div className="preview-item-content">
                    <h6 className="preview-subject mb-1"><Trans>Launch Admin</Trans></h6>
                    <p className="text-muted ellipsis mb-0">
                    <Trans>New admin wow</Trans>!
                    </p>
                  </div>
                </Dropdown.Item>
                <Dropdown.Divider />
                <p className="p-3 mb-0 text-center"><Trans>See all notifications</Trans></p>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown alignRight as="li" className="nav-item">
              <Dropdown.Toggle as="a" className="nav-link cursor-pointer no-caret">
                <div className="navbar-profile">
                  <img className="img-xs rounded-circle" src={require('../../assets/images/faces/face15.jpg')} alt="profile" />
                  <p className="mb-0 d-none d-sm-block navbar-profile-name"><Trans>Bear Vasquez</Trans></p>
                  <i className="mdi mdi-menu-down d-none d-sm-block"></i>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className="navbar-dropdown preview-list navbar-profile-dropdown-menu">
                <h6 className="p-3 mb-0"><Trans>Profile</Trans></h6>
                <Dropdown.Divider />
                <Dropdown.Item href="!#" onClick={evt =>evt.preventDefault()} className="preview-item">
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-dark rounded-circle">
                      <i className="mdi mdi-settings text-success"></i>
                    </div>
                  </div>
                  <div className="preview-item-content">
                    <p className="preview-subject mb-1"><Trans>Settings</Trans></p>
                  </div>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href="!#" onClick={evt =>evt.preventDefault()}  className="preview-item">
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-dark rounded-circle">
                      <i className="mdi mdi-logout text-danger"></i>
                    </div>
                  </div>
                  <div className="preview-item-content">
                    <p className="preview-subject mb-1"><Trans>Log Out</Trans></p>
                  </div>
                </Dropdown.Item>
                <Dropdown.Divider />
                <p className="p-3 mb-0 text-center"><Trans>Advanced settings</Trans></p>
              </Dropdown.Menu>
            </Dropdown>
          </ul>
          <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" onClick={toggleOffcanvas}>
            <span className="mdi mdi-format-line-spacing"></span>
          </button>
        </div>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>List New Asset</Modal.Title>
        </Modal.Header>
        <Modal.Body>

        Asset Details

        <br />
        <br />

        <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Water Source</Form.Label>
          <Form.Control type="text" name="source" placeholder="Waterway" onChange={handleSourceChange}/>
          <Form.Text className="text-muted">
            What is the water source?
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Location</Form.Label>
          <Form.Control type="text" name="loc" placeholder="Water Location" onChange={handleLocChange}/>
          <Form.Text className="text-muted">
            Where is your water located?
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Amount (Acre/Ft)</Form.Label>
          <Form.Control type="text" name="amount" placeholder="Amount" onChange={handleAmountChange}/>
          <Form.Text className="text-muted">
            How much water are you offering?
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Price ($USD)</Form.Label>
          <Form.Control type="text" name="price" placeholder="Price ($USD)" onChange={handlePriceChange}/>
          <Form.Text className="text-muted">
            Please enter your price
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCheckbox" onChange={handleLeaseChange}>
          <Form.Check
            type="switch"
            id="custom-switch"
            label="This right is a lease"
          />
        </Form.Group>

        {leaseShow ?
        <Form.Group className="mb-3" controlId="formBasicLease">
          <Form.Label>Lease Length)</Form.Label>
          <Form.Control type="text" name="leaseLength" placeholder="Months" onChange={handleLeaseLengthChange}/>
          <Form.Text className="text-muted">
            Length of Lease in Months
          </Form.Text>
        </Form.Group>

        : null}

        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="I understand that all listings are final" />
        </Form.Group>
        </Form>

        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" onClick={() => {listAssetForSale()}}>
            List Asset
          </Button>
        </Modal.Footer>
      </Modal>
      </nav>
    );
  }


export default Navbar;
