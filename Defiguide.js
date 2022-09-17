;/Setting up the project/
//RUN COMM: yarn add --dev hardhat > yarn hardhat > yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers @nomiclabs/hardhat-etherscan @nomiclabs/hardhat-waffle chai ethereum-waffle
//hardhat hardhat-contract-sizer hardhat-deploy hardhat-gas-reporter prettier prettier-plugin-solidity solhint solidity-coverage dotenv
;/Building the Defi Script/
//// DEFI protocol treats everything as an ERC20 Token as it is much easier to send and transfer like that
;/Wrapper Ether/ // when you deposit ethereum, the defi sends it to a gateway and swaps your ETH for wrapped ETH which is a ERC20 token contract for ETH
;/we will skip using that gateway and get that WETH ourselves and use that as collateral/
// creating a file named "getWeth.js"
// Build a script that will deposite our token for WETH token
;/ FORKING THE MAINNET/ // First of all it is done for testing purposes only and it behave like a simulated BC but very similar to a mainnet
// The way it runs is that you provide "hardhat" an Etherscan mainnet RPC ENDPOINT to connect to and specify the address, so the BC is not download but the whole BC is forked
// and the rest starts to run on your local computer, you have the control over it like localhost, but it resembles the mainnet, it also comes with fake accounts
;/we use alchemy because alchemsy is very good with these forked BC and all its testing/
;/Aave contract v2/ //https://docs.aave.com/developers/v/2.0/
// The way Aave works is that they have a contract that points us to the correct contract //Lending Pool is the SC that we are gonna use to do all the lending
// Lending Pool > . abi   2. contract address > LendingPoolAddressProvider      <==== This contract will tell us the contract address of the lending pool
// ILendingPool is the SC that we are gonna be interacting with in order to borrow from Aave protocol, for that we need 1. ABI, 2. Contract Addresses,
// So for that specific purpose we have used another contract ILendingPoolAddressesProvided.sol which provides us the address of the iLendingPool contract
//then we copied the iLendingPool code from Aave docs website
// RUN COMM: yarn add --dev @aave/protocol-v2
// update "imports" path in iLendingPool.sol
// Now we delete the ILendingPoolAddressesProvider.sol from the "contracts" folder so that we can avoid the double file error
;/totalCollateralETH/
;/availableBorrowsETH/
;/ltv/ //So if you have 1 ETH collateral you cant borrow eqaul to 1ETH, for specific assets we have specific availableBorrowsETH limits, and loan to value or
//"ltv" is the percentage set to each asset that tells you how much you can borrow to reduce not have enough collateral as prices fluctuates
//"Liquidation Threshold" is the percentage set to each asset that tells you if that percentage reaches, people can liquidate you, which means they can pay your borrowed loan,
//also they get to buy your collateral at a cheaper price; This keeps the Aave platform solvent and not get to the point where there are more borrows than the collateral
;/healthFactor/ //if the healthFactor is below 1, you get liquidated
;/AggregatorV3Interface.sol/ //copied this interface from course github repo
;/aToken/ //when we borrow from Aave protocl, then we get back some "aToken" > "interest bearing token" these tokens keep track of how much collateral or WTH token we deposited
//Aave protocol; upon withdrawal of WETH, these aTokens get burnt ; in Aave these atokens are aWETH tokens
;/SpeedRun Ethereum/ //https://speedrunethereum.com/    //Revolves aroun Scaffold-ETH and uses Scaffold-ETH as a base
// With Scaffold-ETH you have front end and SC, and it comes with Hardhatl you will use a combination of hardhat and React to build a "Dapp" to deploy both the SC and front end
