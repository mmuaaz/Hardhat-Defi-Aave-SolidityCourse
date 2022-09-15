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
