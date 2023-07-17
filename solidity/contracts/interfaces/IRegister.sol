// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

interface IRegister {

    function getAddress(string memory _name) view external returns (address _address);

    function getName(address _address) view external returns (string memory _name);

    function getVersion(address _address) view external returns (uint256 _version);

}