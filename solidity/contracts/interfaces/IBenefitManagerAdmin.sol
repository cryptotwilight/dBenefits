// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import "./IBenefitManager.sol";

enum BenefitEntitlementRequestStatus {GRANTED, PENDING, DECLINED}

struct BenefitEntitlementRequest { 
    uint256 id;
    BenefitEntitlementRequestStatus status;
    address user;
    string username; 
    uint256 requestDate;
    string benefitType; 
}

enum GasFreeTransactionAllowanceRequestStatus {PERMITTED, OUTSTANDING, REFUSED}

struct GasFreeTransactionAllowanceRequest { 
    string id;
    GasFreeTransactionAllowanceRequestStatus status;
    address user;
    string username; 
    uint256 requestDate;
    uint256 remainingGasFreeTransactions; 
}

interface IBenefitManagerAdmin is IBenefitManager {
   
    function getGasFreeTransactionAllowance(address _beneficiary) view external returns (uint256 _remainingAllowedTransactions);

    function getGasFreeTransactionAllowanceRequests() view external returns (GasFreeTransactionAllowanceRequest [] memory _gasFreeTransactionAllowanceRequests);

    function actionGasFreeTransactionAllowance(uint256 allowanceRequestId, bool _permitted) external returns (bool _actioned);


    function getEntitlementRequests() view external returns (BenefitEntitlementRequest [] memory _entitlementRequests);

    function declineEntitlementRequest(uint256 entitlementRequestId, string memory reason) external returns (bool _declined);

    function issueEntitlement(BenefitEntitlement memory _benefitEntitlement) external returns (bool issued);
}