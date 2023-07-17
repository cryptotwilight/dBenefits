# Welcome to Decentralized Benefits
The decentralized benefits or dBenefits dApp has been created to explore how the distribution of Social Welfare benefits might change with the introduction of Paymasters on Zksync. As Web3 and blockchain charge towards becoming mainstream a major stumbling block in adoption is the handling of **real** social issues such as Social Welfare and associated Benefits payments. Quite simply for Web3 to become a mainstream norm it has to be accepted as part of the government institutional lexicon for technology which doesn't happen unless we look at social issues and present safe models and pathways for adoption. 

Against that backdrop dBenefits has been created to model how Social Welfare payments might be distributed "gas free" using the Zksync paymaster model. The rationale is that your typical beneficiary is in the main going to be very cash strapped hence "gas free" pay-outs are a necessity. 

The model is described in the diagram below: 
 ![dBenefits Business Flow](https://github.com/cryptotwilight/dBenefits/blob/f16d2f7544935e56112101c79d863f67be18c87a/media/dbenefits%20diagrams-businessflow.drawio.png?raw=true)

In this model the Beneficiary is enabled to request an allowance of transactions that are gas free to help them claim their benefit entitlements when they are available avoiding the rigmarole of acquiring gas. 
This is supported by the on chain transaction model described below:


The deployed contracts model the scenario described in the demo scenario below: 


# Deployment Addresses 
The deployment addresses for dBenefits on the Zksync testnet are described below: 
|Contract Name | Address  | Contract Version| Description |
|--|--|--|--|
|REGISTER  | 0xe6E8DaDE80aD3b30ce63504D746D4Cfd38c30DA7 |2| Central register of all contracts that make up the dBenefits dApp. It's function is to help contracts autonomously configure and reconfigure their contract dependencies on chain.|
|PAYMASTER  | 0xf0dEdc4Eec535c5bce09eC59e5ac20FAF1711a03 |3| This is responsible for funding "gas free" transactions for the dBenefits platform and is optimised to request only a sufficient gas refund from the Benefits Manager. |
|BENEFITS MANAGER  |0xC0fA4E7ef5Fd9C0A6e9C75e37a2d93AEd6EA3E4b  |4| This is the main contract of the dBenefits platform as is responsible for driving all the user scenarios for the dApp such as entitlement requests and entitlement claims. |
|ENTITLEMENT NFT  | 0x14ea3E6D34D8Da126e0302DE8BAAeCfE5A8e5bb8 |2| This is the NFT that ensures that only a 'known' claimant can request a given entitlement.|
|PAYMENT TOKEN  | 0xBaA3A0F67C8c5eAD6662585F63cA1b1E1d67CFa0 |2| This is the token that is used for payouts on the dBenefits platform .|

The dBenefits contracts are designed to auto configure on deployment using the Register Contract. This helps to ensure that version management is consistent and transparent. It also allows for modular development.
