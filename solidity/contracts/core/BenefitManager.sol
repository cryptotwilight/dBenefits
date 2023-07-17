// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import "../interfaces/IRegister.sol";
import "../interfaces/IVersioned.sol";
import "../interfaces/IBenefitManagerAdmin.sol";
import "../interfaces/IBenefitEntitlementNFT.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/INotifiable.sol";

contract BenefitManager is IBenefitManagerAdmin, IVersioned, INotifiable {

    string constant name = "BENEFIT_MANAGER";
    uint256 constant version = 5; 

    string constant REGISTER        = "REGISTER";

    string constant PAYMENT_TOKEN   = "PAYMENT_TOKEN";
    string constant ENTITLEMENT_NFT = "BENEFIT_ENTITLEMENT_NFT";
    string constant ADMINISTRATOR   = "ADMINISTRATOR";
    string constant PAYMASTER       = "BENEFIT_PAYMASTER";

    address payable self; 

    uint256 index; 

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

    uint256 benefitEntitlementRequestIds; 
    mapping(uint256=>BenefitEntitlementRequest) benefitEntitlementRequestById;
    mapping(uint256=>bool) isApprovedEntitlementRequestById; 


    constructor(address _register)  { 
        register = IRegister(_register);
        paymentToken = IERC20(register.getAddress(PAYMENT_TOKEN));
        entitlementNFT = IBenefitEntitlementNFT(register.getAddress(ENTITLEMENT_NFT));
        self = payable(address(this));
    }

    function getName() pure external returns (string memory _name) {
        return name; 
    }

    function getVersion() pure external returns (uint256 _version) {
        return version; 
    }

    function notifyChangeOfAddress() external returns (bool _notified) {
        register = IRegister(register.getAddress(REGISTER));
        paymentToken = IERC20(register.getAddress(PAYMENT_TOKEN));
        entitlementNFT = IBenefitEntitlementNFT(register.getAddress(ENTITLEMENT_NFT));
        return true; 
    }

    function hasRemainingGasfreeTransactionAllowance(address _beneficiary) view external returns (bool _hasRemainingGasAllowance) {
        return remainingGasFreeTransactionsByBeneficiary[_beneficiary] > 0; 
    }

    function getGasFreeTransactionAllowance() view external returns (uint256 _remainingAllowedTransactions) {
        return remainingGasFreeTransactionsByBeneficiary[msg.sender];
    }

    function requestGasRefund(uint256 _requiredETH) external returns (bool _refunded) {
        require(msg.sender == register.getAddress(PAYMASTER), "Paymaster only"); 
        return refundGas(_requiredETH);
    }

    function requestEntitlement(string memory _username, string memory _benefitType) external returns (uint256 _requestId) {
        BenefitEntitlementRequest memory request_ = BenefitEntitlementRequest ({ 
                                                                                    id : getIndex(),
                                                                                    status : BenefitEntitlementRequestStatus.PENDING,
                                                                                    user : msg.sender, 
                                                                                    username  : _username, 
                                                                                    requestDate : block.timestamp,
                                                                                    benefitType : benefitType
                                                                               });
        _requestId = request_.id; 
        benefitEntitlementRequestById[_requestId] = request_;    
        benefitEntitlementRequestIds.push(_requestId);    
        return _requestId; 
    }
    function getGasFreeTransactionAllowance(address _beneficiary) view external returns (uint256 _remainingAllowedTransactions){

    }

    function getGasFreeTransactionAllowanceRequests() view external returns (GasFreeTransactionAllowanceRequest [] memory _gasFreeTransactionAllowanceRequests){

    }

    function actionGasFreeTransactionAllowance(uint256 allowanceRequestId, bool _permitted) external returns (bool _actioned){

    }


    function getEntitlementRequests() view external returns (BenefitEntitlementRequest [] memory _entitlementRequests){

    }
    

    function declineEntitlementRequest(uint256 entitlementRequestId, string memory reason) external returns (bool _declined){

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
        require(knownBeneficiary[msg.sender], "unknown beneficiary");
        require(entitlementNFT.hasEntitlementNFT(msg.sender), " no entitlement access ");
        if(_isGasFree) {
            require(remainingGasFreeTransactionsByBeneficiary[msg.sender] > 0, "no gas allowance remaining");
            remainingGasFreeTransactionsByBeneficiary[msg.sender]--;
        }
        
        BenefitEntitlement memory benefitEntitlement_ = benefitEntitlementById[_entitlementId];
        require(isEntitlementByBeneficiaryAddress[msg.sender][benefitEntitlement_.beneficiaryId], "claiment not entitlement owner");
        
        _payout = benefitEntitlement_.payout; 
        paymentToken.transfer(msg.sender, _payout);
        return _payout;
    }

    function requestGasFreeTransactionAllowance() external returns (bool _approved){
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

        if(!entitlementNFT.hasEntitlementNFT(_benefitEntitlement.beneficiary)) {
            entitlementNFT.issueEntitlementNFT(_benefitEntitlement.beneficiary, _benefitEntitlement.beneficiaryURI );
        }
        return true; 
    }


    // ================================ internal =========================================

    function refundGas(uint256 _requiredETH) internal returns (bool _refunded) {
        (_refunded,) = register.getAddress(PAYMASTER).call{value : _requiredETH}("");
        require(_refunded, "unable to refund gas");
        return _refunded; 
    }

    function doSecurity() view internal returns (bool) {
        require(msg.sender == register.getAddress(ADMINISTRATOR), "admin only");
    }
}