// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

interface IVersioned {

    function getName() view external returns (string memory _name);

    function getVersion() view external returns (uint256 _version);
}