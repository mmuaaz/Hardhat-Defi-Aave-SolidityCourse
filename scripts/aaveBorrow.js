// imports
const { getWeth, AMOUNT } = require("../scripts/getWeth")
const { getNamedAccounts, ethers } = require("hardhat")
//Main Function
async function main() {
    await getWeth()
    const { deployer } = await getNamedAccounts()
    //interacting with the Aave Protocol
    //1. abi   2. contract address
    // LendingPoolAddressProvider: 0x5E52dEc931FFb32f609681B8438A51c675cc232d
    const lendingPool = await getLendingPool(deployer)
    console.log(`LendingPool address ${lendingPool.address}`)

    //Deposite
    const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    //Approve
    await approveErc20(wethTokenAddress, lendingPool.address, AMOUNT, deployer)
    console.log(" Depositing ...... ")
    await lendingPool.deposit(wethTokenAddress, AMOUNT, deployer, 0) //deposit function on LendingPool takes, asset, uint256 amount, address onBehalfOf,
    //uint16 referralCode       //referralCode is always gonna be zero as it has been discontinued
    console.log(" Deposited!!!!")
    // First we need to know how much we can actually borrow, how much we have in collateral, and how much we have borrowed
    // getUserAccountData() on LendingPool SC is a function that Returns user account data accross all the reserves
    let { availableBorrowsETH, totalDebtETH } = await getBorrowUserData(lendingPool, deployer)
    // availableBorrowsETH needs to be converted to DAI, we need to know how much DAI we can borrow
    ;/Conversion/
    const daiPrice = await getDaiPrice()
    const amountDaiToBorrow = availableBorrowsETH.toString() * 0.95 * (1 / daiPrice.toNumber()) // 0.95 is for saying that we dont want to hit that cap
    //cap of maximum that we can borrow, thats why we are asking for 95% borrowing not full
    console.log(` You can Borrow ${amountDaiToBorrow} DAI`)
    const amountDaiToBorrowWei = ethers.utils.parseEther(amountDaiToBorrow.toString())
    ;/Borrow/
    const daiTokenAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
    await bororwDai(daiTokenAddress, lendingPool, amountDaiToBorrowWei, deployer)
    await getBorrowUserData(lendingPool, deployer) // we need to run this again to know where we are at the moment right after we have borrowed
    await repay(amountDaiToBorrowWei, daiTokenAddress, lendingPool, deployer)
    await getBorrowUserData(lendingPool, deployer)
}
;/Repay/
async function repay(amount, daiAddress, lendingPool, account) {
    await approveErc20(daiAddress, lendingPool.address, amount, account)
    const repayTx = await lendingPool.repay(daiAddress, amount, 1, account)
    await repayTx.wait(1)
    console.log("Repaid!")
}
;/Borrow/
async function bororwDai(daiAddress, lendingPool, amountDaiToBorrow, account) {
    const borrowTx = await lendingPool.borrow(daiAddress, amountDaiToBorrow, 1, 0, account)
    await borrowTx.wait(1)
    console.log("You have borrowed Successfully ")
}
async function getDaiPrice() {
    const DaiEthPriceFeed = await ethers.getContractAt(
        "AggregatorV3Interface",
        "0x773616E4d11A78F511299002da57A0a94577F1f4"
    ) // for this priceFeed we dont need to connect this with a "deployer" account as we are not sending any Tx
    const price = (await DaiEthPriceFeed.latestRoundData())[1] // here we are calling "latestRoundData" on the priceFeed which returns 4 variables
    //but we need only "answer" so as its on 2nd position so we asked for index 1
    console.log(`The Dai/ETH price is ${price.toString()}`)
    return price
}
async function getBorrowUserData(lendingPool, account) {
    const {
        totalCollateralETH,
        totalDebtETH,
        availableBorrowsETH
    } = await lendingPool.getUserAccountData(account)
    console.log(`You have ${totalCollateralETH} worth of ETH deposited.`)
    console.log(`You have ${totalDebtETH} worth of ETH borrowed.`)
    console.log(`You can borrow ${availableBorrowsETH} worth of ETH.`)
    return { availableBorrowsETH, totalDebtETH }
}
async function getLendingPool(account) {
    const lendingPoolAddressesProvider = await ethers.getContractAt(
        "ILendingPoolAddressesProvider",
        "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
        account
    ) // copied this SC code from Aave docs
    const LendingPoolAddress = await lendingPoolAddressesProvider.getLendingPool()
    //We will have this SC give us the lending pool SC by:
    const lendingPool = await ethers.getContractAt("ILendingPool", LendingPoolAddress, account) //copied this contract code from Aave docs
    //There are some imports in the iLendingPool.sol which can be done by 2 ways either by "npm" package installer
    //or by using interfaces from this package
    return lendingPool
}
async function approveErc20( // if you dont have this function and then you wanna deposit you will get an error saying you need to approve
    erc20Address,
    spenderAddress,
    ammountToSpend,
    account
) /*"spenderAddress" is gonna be the SC that is gonna spend our
 WETH token*/ {
    const erc20Token = await ethers.getContractAt("IERC20", erc20Address, account)
    const tx = await erc20Token.approve(spenderAddress, ammountToSpend)
    await tx.wait(1)
    console.log(" Approved! ")
}
// DEFI protocol treats everything as an ERC20 Token
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
