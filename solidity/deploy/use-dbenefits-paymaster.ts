import { Provider, utils, Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// Put the address of the deployed paymaster here
const PAYMASTER_ADDRESS = "0xBaD8C4615E74bF8dcDb3bef8588aDd7870aAe5d1";

// Put the address of the ERC20 token here:
const TOKEN_ADDRESS = "0x216C98ec3A95811aA6588d5A47fC0a466ceC8735";

// Wallet private key
const EMPTY_WALLET_PRIVATE_KEY = "6af0ce1beff6e13c42f459d41ab9b7cdaaf8d6166db2d52757c2fabb9dc2cf00";

function getToken(hre: HardhatRuntimeEnvironment, wallet: Wallet) {
  const artifact = hre.artifacts.readArtifactSync("DBenefitsToken");
  return new ethers.Contract(TOKEN_ADDRESS, artifact.abi, wallet);
}

export default async function (hre: HardhatRuntimeEnvironment) {
  const provider = new Provider("https://testnet.era.zksync.dev");
  const emptyWallet = new Wallet(EMPTY_WALLET_PRIVATE_KEY, provider);

  // const paymasterWallet = new Wallet(PAYMASTER_ADDRESS, provider);
  // Obviously this step is not required, but it is here purely to demonstrate that indeed the wallet has no ether.
  const ethBalance = await emptyWallet.getBalance();
  if (!ethBalance.eq(0)) {
    throw new Error("The wallet is not empty!");
  }

  console.log(
    `ERC20 token balance of the empty wallet before mint: ${await emptyWallet.getBalance(
      TOKEN_ADDRESS
    )}`
  );

  let paymasterBalance = await provider.getBalance(PAYMASTER_ADDRESS);
  console.log(`Paymaster ETH balance is ${paymasterBalance.toString()}`);

  const erc20 = getToken(hre, emptyWallet);

  const gasPrice = await provider.getGasPrice();

  // Encoding the "ApprovalBased" paymaster flow's input
  const paymasterParams = utils.getPaymasterParams(PAYMASTER_ADDRESS, {
    type: "ApprovalBased",
    token: TOKEN_ADDRESS,
    // set minimalAllowance as we defined in the paymaster contract
    minimalAllowance: ethers.BigNumber.from(1),
    // empty bytes as testnet paymaster does not use innerInput
    innerInput: new Uint8Array(),
  });

  // Estimate gas fee for mint transaction
  const gasLimit = await erc20.estimateGas.mint(emptyWallet.address, 5, {
    customData: {
      gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
      paymasterParams: paymasterParams,
    },
  });

  const fee = gasPrice.mul(gasLimit.toString());
  console.log("Transaction fee estimation is :>> ", fee.toString());

  console.log(`Minting 5 tokens for empty wallet via paymaster...`);
  await (
    await erc20.mint(emptyWallet.address, 5, {
      // paymaster info
      customData: {
        paymasterParams: paymasterParams,
        gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
      },
    })
  ).wait();

  console.log(
    `Paymaster ERC20 token balance is now ${await erc20.balanceOf(
      PAYMASTER_ADDRESS
    )}`
  );

  paymasterBalance = await provider.getBalance(PAYMASTER_ADDRESS);
  console.log(`Paymaster ETH balance is now ${paymasterBalance.toString()}`);

  console.log(
    `ERC20 token balance of the empty wallet after mint: ${await emptyWallet.getBalance(
      TOKEN_ADDRESS
    )}`
  );
}
