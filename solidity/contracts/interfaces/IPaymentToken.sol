// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

interface IPaymentToken {

    function issue(address _benefitsManager, uint256 _budget) external returns (bool _issued);

}