// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {IPaymaster, ExecutionResult, PAYMASTER_VALIDATION_SUCCESS_MAGIC} from "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymaster.sol";
import {IPaymasterFlow} from "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymasterFlow.sol";
import {TransactionHelper, Transaction} from "@matterlabs/zksync-contracts/l2/system-contracts/libraries/TransactionHelper.sol";


import "../interfaces/IVersioned.sol";
import "../interfaces/IRegister.sol";
import "../interfaces/IBenefitEntitlementNFT.sol";
import "../interfaces/IBenefitManager.sol";
import "../interfaces/INotifiable.sol";

contract BenefitPaymaster is IPaymaster, IVersioned, INotifiable {

    uint160 constant SYSTEM_CONTRACTS_OFFSET = 0x8000; // 2^15
    address payable constant BOOTLOADER_FORMAL_ADDRESS = payable(address(SYSTEM_CONTRACTS_OFFSET + 0x01));
   

    uint256 constant PRICE_FOR_PAYING_FEES = 1;

    string constant name = "BENEFIT_PAYMASTER";
    uint256 constant version = 4; 

    address payable self; 

    address public allowedToken;

    string constant BENEFIT_ENTITLEMENT_NFT = "BENEFIT_ENTITLEMENT_NFT"; 
    string constant BENEFIT_MANAGER         = "BENEFIT_MANAGER";
    string constant REGISTER                = "REGISTER";

    IRegister register; 
    IBenefitEntitlementNFT benefitEntitlementNFT; 
    IBenefitManager benefitManager; 


    modifier onlyBootloader() {
        require( msg.sender == BOOTLOADER_FORMAL_ADDRESS, "bootloader only");
        // Continue execution if called from the bootloader.
        _;
    }

    constructor(address _register) {
        register = IRegister(_register);
        benefitEntitlementNFT = IBenefitEntitlementNFT(register.getAddress(BENEFIT_ENTITLEMENT_NFT));
        benefitManager = IBenefitManager(register.getAddress(BENEFIT_MANAGER));
        self = payable(address(this));
    }

    function getName() pure external returns (string memory _name) {
        return name; 
    }

    function getVersion() pure external returns (uint256 _version) {
        return version; 
    }

    function validateAndPayForPaymasterTransaction(bytes32, bytes32, Transaction calldata _transaction)  external payable onlyBootloader returns (bytes4 magic, bytes memory context)
    {
        // By default we consider the transaction as accepted.
        magic = PAYMASTER_VALIDATION_SUCCESS_MAGIC;
        require(_transaction.paymasterInput.length >= 4, "The standard paymaster input must be at least 4 bytes long");

        bytes4 paymasterInputSelector = bytes4(_transaction.paymasterInput[0:4]);

        if (paymasterInputSelector == IPaymasterFlow.approvalBased.selector) {
            // While the transaction data consists of address, uint256 and bytes data,
            // the data is not needed for this paymaster
            (address token, uint256 amount, bytes memory data) = abi.decode(_transaction.paymasterInput[4:], (address, uint256, bytes));

            // Verify if token is the correct one
            //require(token == allowedToken, "Invalid token");

            // We verify that the user has provided enough allowance
            address userAddress = address(uint160(_transaction.from));

            require(benefitEntitlementNFT.hasEntitlementNFT(userAddress), " no entitlement"); // ensure that the user has an entitlement 
            require(benefitManager.hasRemainingGasfreeTransactionAllowance(userAddress), "no gas allowance");

           // address thisAddress = address(this);

          //  uint256 providedAllowance = IERC20(token).allowance(userAddress, thisAddress);

           // require(providedAllowance >= PRICE_FOR_PAYING_FEES, "Min allowance too low" );

           

            // Note, that while the minimal amount of ETH needed is tx.gasPrice * tx.gasLimit,
            // neither paymaster nor account are allowed to access this context variable.
            uint256 requiredETH = _transaction.gasLimit * _transaction.maxFeePerGas;

            require(benefitManager.requestGasRefund(requiredETH), " no gas refund available ");

            require(self.balance >= requiredETH, " insufficient paymaster ETH ");
/*
            try
                IERC20(token).transferFrom(userAddress, thisAddress, amount)
            {} catch (bytes memory revertReason) {
                // If the revert reason is empty or represented by just a function selector,
                // we replace the error with a more user-friendly message
                if (revertReason.length <= 4) {
                    revert("Failed to transferFrom from users' account");
                } else {
                    assembly {
                        revert(add(0x20, revertReason), mload(revertReason))
                    }
                }
            }
*/
            // The bootloader never returns any data, so it can safely be ignored here.
            (bool success, ) = payable(BOOTLOADER_FORMAL_ADDRESS).call{ value: requiredETH }("");
            require( success, "Failed to transfer tx fee to the bootloader. Paymaster balance might not be enough.");
        } 
        else {
            revert("Unsupported paymaster flow");
        }
    }

    function postTransaction( bytes calldata _context, Transaction calldata _transaction, bytes32, bytes32, ExecutionResult _txResult, uint256 _maxRefundedGas) external payable override onlyBootloader {
    }

    receive() external payable {}

    function notifyChangeOfAddress() external returns (bool _notified) {
        register = IRegister(register.getAddress(REGISTER));
        benefitEntitlementNFT = IBenefitEntitlementNFT(register.getAddress(BENEFIT_ENTITLEMENT_NFT));
        benefitManager = IBenefitManager(register.getAddress(BENEFIT_MANAGER));
        return true; 
    }
}