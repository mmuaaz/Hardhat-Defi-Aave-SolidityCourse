// imports
const { getWeth } = require("../scripts/getWeth")
const { getNamedAccounts } = require("hardhat")
//Main Function
async function main() {
    await getWeth()
    const { deployer } = await getNamedAccounts()
    //interacting with the Aave Protocol
    //1. abi   2. contract address
}
// DEFI protocol treats everything as an ERC20 Token
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
