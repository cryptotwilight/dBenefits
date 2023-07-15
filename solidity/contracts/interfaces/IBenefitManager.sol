// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

struct BenefitEntitlement { 
    uint56 id; 
    string entitlementType; 
    string name; 
    string purpose; 
    uint256 expires;
    uint256 payout; 
    bool isGasFree; 
    uint256 beneficiaryId;
    address beneficiary;  
}

interface IBenefitManager {

    function getGasAllowance() view external returns (uint256 _remainingAllowedTransactions); 

    function getEntitlements() view external returns (BenefitEntitlement [] memory _benefitEntitlements);

    function claimEntitlement(uint256 _entitlementId, bool _isGasFree) external returns (uint256 _payout);

    function requestGasAllowance() external returns (bool _approved);

}