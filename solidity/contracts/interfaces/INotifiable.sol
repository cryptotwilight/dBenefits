// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

interface INotifiable {

    function notifyChangeOfAddress() external returns (bool _notified);

}