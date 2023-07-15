// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "../interfaces/IBenefitEntitlementNFT.sol";
import "../interfaces/IRegister.sol";
import "../interfaces/IVersioned.sol";

contract BenefitEntitlementNFT is ERC721, IBenefitEntitlementNFT, IVersioned {

    using Counters for Counters.Counter;
    using Strings for uint256;
    Counters.Counter private _tokenIdCounter;

    string constant nme = "BENEFIT_ENTITLEMENT_NFT";
    uint256 constant version = 2; 


    string constant ADMINISTRATOR = "ADMINISTRATOR";


    IRegister register; 
    mapping(uint256=>string) uriByBeneficiaryId; 


    constructor(address _register) ERC721("Decentralized Benefits Entitlement NFT", "DBEN"){
        register = IRegister(_register);
    }

    function getName() view external returns (string memory _name) {
        return name; 
    }

    function getVersion() view external returns (uint256 _version) {
        return version; 
    }

    function tokenURI(uint256 _beneficiaryId) public view override(ERC721) returns(string memory) {
        _requireMinted(_beneficiaryId);
        return uriByBeneficiaryId[_beneficiaryId];
    }

    function nextTokenId() public view returns(uint256) {
        return _tokenIdCounter.current();
    }

    function hasEntitlementNFT(address _beneficiary) view external returns (bool _hasEntitlementNFT){
        return balanceOf(_beneficiary) > 0; 
    }

    function issueEntitlementNFT(address _beneficiary, string memory _entitlementURI) external returns (uint256 _beneficiaryId){
        doSecurity();   
        require(balanceOf(_beneficiary) == 0, "already entitlement holder");
        _beneficiaryId = _tokenIdCounter.current();
        _safeMint(_beneficiary, _beneficiaryId);
        uriByBeneficiaryId[_beneficiaryId] = _entitlementURI; 
        _tokenIdCounter.increment();
        return _beneficiaryId; 
    }

    function recindEntitlementNFT(uint256 _beneficiaryId) external returns (address _impactedBeneficiary){
        doSecurity(); 
        require(_exists(_beneficiaryId), "beneficiary id does not exist ");

        _impactedBeneficiary = ownerOf(_beneficiaryId);
        _burn(_beneficiaryId);
        return _impactedBeneficiary; 
    }


    // ================================ internal =========================================

    function doSecurity() view internal returns (bool) {
        require(msg.sender == register.getAddress(ADMINISTRATOR), "admin only");
    }
}