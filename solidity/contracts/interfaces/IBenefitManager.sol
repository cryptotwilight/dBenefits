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
    string beneficiaryURI;
}

interface IBenefitManager {

    function hasRemainingGasfreeTransactionAllowance(address _beneficiary) view external returns (bool _hasRemainingGasAllowance);

    function requestGasRefund(uint256 _requiredETH) external returns (bool _refunded);


    function getGasFreeTransactionAllowance() view external returns (uint256 _remainingAllowedTransactions); 

    function requestGasFreeTransactionAllowance() external returns (bool _approved);


    function requestEntitlement(string memory _username, string memory _benefitType) external returns (uint256 _requestId);

    function getEntitlements() view external returns (BenefitEntitlement [] memory _benefitEntitlements);

    function claimEntitlement(uint256 _entitlementId, bool _isGasFree) external returns (uint256 _payout);

}