// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

interface IBenefitEntitlementNFT {

    function hasEntitlementNFT(address _address) view external returns (bool _hasEntitlementNFT);

    function issueEntitlementNFT(address _beneficiary, string memory _entitlementURI) external returns (uint256 _beneficiaryId);

    function recindEntitlementNFT(uint256 _beneficiaryId) external returns (address _impactedBeneficiary);

}