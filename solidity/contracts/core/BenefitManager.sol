// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;


import "../interfaces/IRegister.sol";
import "../interfaces/IBenefitManager.sol";
import "../interfaces/IBenefitEntitlementNFT.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BenefitManager is IBenefitManager {

    string constant PAYMENT_TOKEN   = "PAYMENT_TOKEN";
    string constant ENTITLEMENT_NFT = "ENTITLEMENT_NFT";
    string constant ADMINISTRATOR   = "ADMINISTRATOR";
    string constant PAYMASTER       = "PAYMASTER";

    address self; 

    IRegister register; 
    IERC20 paymentToken; 
    IBenefitEntitlementNFT entitlementNFT; 
    uint256 defaultGasFreeTransactionAllowance = 3; 

    uint256 STANDARD_GAS_REFUND = 10000000000000000;

    mapping(address=>bool) knownBeneficiary; 
    mapping(address=>uint256) remainingGasFreeTransactionsByBeneficiary; 
    mapping(uint256=>BenefitEntitlement) benefitEntitlementById; 
    mapping(address=>uint256[]) benefitEntitlementsByBeneficiaryAddress; 
    mapping(address=>mapping(uint256=>bool)) isEntitlementByBeneficiaryAddress; 

    constructor(address _register)  { 
        register = IRegister(_register);
        paymentToken = IERC20(register.getAddress(PAYMENT_TOKEN));
        entitlementNFT = IBenefitEntitlementNFT(register.getAddress(ENTITLEMENT_NFT));
        self = address(this);
    }

    function hasRemainingGasAllowance(address _beneficiary) view external returns (bool _hasRemainingGasAllowance) {
        return remainingGasFreeTransactionsByBeneficiary[_beneficiary] > 0; 
    }

    function getGasAllowance() view external returns (uint256 _remainingAllowedTransactions) {
        return remainingGasFreeTransactionsByBeneficiary[msg.sender];
    }

    function getEntitlements() view external returns (BenefitEntitlement [] memory _benefitEntitlements){
        uint256 [] memory _entitlementIds = benefitEntitlementsByBeneficiaryAddress[msg.sender];
        _benefitEntitlements = new BenefitEntitlement[](_entitlementIds.length);
        for(uint256 x = 0; x < _benefitEntitlements.length; x++) { 
            _benefitEntitlements[x] = benefitEntitlementById[_entitlementIds[x]];
        }
        return _benefitEntitlements; 
    }

    function claimEntitlement(uint256 _entitlementId, bool _isGasFree) external returns (uint256 _payout){
        if(_isGasFree) {
            remainingGasFreeTransactionsByBeneficiary[msg.sender]--;
            refundGas(); // send refund to the Paymaster automatically 
        }
        require(knownBeneficiary[msg.sender], "unknown beneficiary");
        require(entitlementNFT.hasEntitlementNFT(msg.sender), " no entitlement access ");
        BenefitEntitlement memory benefitEntitlement_ = benefitEntitlementById[_entitlementId];
        require(isEntitlementByBeneficiaryAddress[msg.sender][benefitEntitlement_.beneficiaryId], "claiment not entitlement owner");
        _payout = benefitEntitlement_.payout; 
        paymentToken.transfer(msg.sender, _payout);
        return _payout;
    }

    function requestGasAllowance() external returns (bool _approved){
        require(remainingGasFreeTransactionsByBeneficiary[msg.sender] == 0, "allowance already available");
        remainingGasFreeTransactionsByBeneficiary[msg.sender] = defaultGasFreeTransactionAllowance;
        _approved = true; 
        return _approved; 
    }

    function issueEntitlement(BenefitEntitlement memory _benefitEntitlement) external returns (bool issued) {
        doSecurity(); 
        knownBeneficiary[_benefitEntitlement.beneficiary]; 
        benefitEntitlementById[_benefitEntitlement.id] = _benefitEntitlement; 
        benefitEntitlementsByBeneficiaryAddress[_benefitEntitlement.beneficiary].push(_benefitEntitlement.id); 
        isEntitlementByBeneficiaryAddress[_benefitEntitlement.beneficiary][_benefitEntitlement.id] = true;
        return true; 
    }


    // ================================ internal =========================================

    function refundGas() external returns (bool _refunded) {
        transfer(register.getAddress(PAYMASTER), STANDARD_GAS_REFUND);
        return true; 
    }

    function doSecurity() view internal returns (bool) {
        require(msg.sender == register.getAddress(ADMINISTRATOR), "admin only");
    }
}