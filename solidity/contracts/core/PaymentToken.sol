// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "../interfaces/IPaymentToken.sol";
import "../interfaces/IRegister.sol";
import "../interfaces/IVersioned.sol";
import "../interfaces/INotifiable.sol";


contract PaymentToken is ERC20, IPaymentToken, IVersioned, INotifiable {


    string constant nme = "PAYMENT_TOKEN";
    uint256 constant version = 4; 

    string constant ADMINISTRATOR = "ADMINISTRATOR";
    string constant REGISTER = "REGSITER";
    IRegister register; 

    constructor(address _register) ERC20("Benefits Payment Token", "BPT"){
        register = IRegister(_register);
    }


    function notifyChangeOfAddress() external returns (bool _notified) {
        register = IRegister(register.getAddress(REGISTER));
        return true; 
    }
    function getName() pure external returns (string memory _name) {
        return nme; 
    }

    function getVersion() pure external returns (uint256 _version) {
        return version; 
    }

    function issue(address _benefitsManager, uint256 _budget) external returns (bool _issued){
        doSecurity(); 
        _mint(_benefitsManager, _budget);
        return true; 
    }

    // ===== internal ===========================================================
    function doSecurity() view internal returns (bool) {
        require(msg.sender == register.getAddress(ADMINISTRATOR), "admin only");
    }
}