const { ethers, getNamedAccounts, network } = require("hardhat")

// Build a script that will deposite our token for WETH token

const AMOUNT = "100000000000000000" //(0.1)   /* ethers.utils.parseEther("0.02")*/

async function getWeth() {
    // const { deployer } = await getNamedAccounts
    const { deployer } = await getNamedAccounts()
    // We need to call the deposit function on the WETH SC
    // therefore, we need 1. abi    2. contract address
    //1. We got around the ABI with IWETH file, we copied the code from course git repo, it gives us an interface that has functions
    //looking very similar to an ERC20 contract
    //2. for addresses, we are gonna work on mainnet not on testnet
    const iWeth = await ethers.getContractAt(
        // getContractAt is another function on ethers that will allows us to get SC at a specific address
        "IWeth",
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH ContractAddress on mainnet
        deployer
    )
    const txResponse = await iWeth.deposit({
        value: AMOUNT,
    })
    await txResponse.wait(1)
    const wethBalance = await iWeth.balanceOf(deployer) // calling the balanceOf function on the  iWeth
    console.log(`Got ${wethBalance.toString()} WETH`)
}

module.exports = { getWeth, AMOUNT }
