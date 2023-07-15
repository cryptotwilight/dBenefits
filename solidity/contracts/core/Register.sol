// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import "../interfaces/IRegister.sol";
import "../interfaces/IVersioned.sol";


contract Register is IRegister, IVersioned {

    address administrator; 
    string constant name = "REGISTER"; 
    uint256 constant version = 1; 

    mapping(string=>address) addressByName; 
    mapping(address=>string) nameByAddress; 

    constructor(address _admin) {
        administrator = _admin; 
    }

    function getName() view external returns (string memory _name){
        return name; 
    }

    function getVersion() view external returns (uint256 _version){
        return version; 
    }

    function getAddress(string memory _name) view external returns (address _address){
        return addressByName[_name];
    }

    function getName(address _address) view external returns (string memory _name){
        return nameByAddress[_address];
    }

    function add(string memory _name, address _address) external returns (bool _added) {
        doSecurity(); 
        nameByAddress[_address] = _name; 
        addressByName[_name] = _address; 
        return true; 
    }

    function remove(string memory _name) external returns (bool _removed) {
        doSecurity(); 
        address address_ = addressByName[_name];
        delete addressByName[_name];
        delete nameByAddress[address_];
        return true; 
    }
    
    // ================================ INTERNAL ============================================

    function doSecurity() view internal returns (bool) {
        require(msg.sender == administrator, "admin only");
    }


}