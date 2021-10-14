// 部署合约
async function main() {
    let [user] = await ethers.getSigners();
    console.log("user:", user.address);
    const OOE = await ethers.getContractFactory('OOE');
    let name = "OpenOcean";
    let symbol = "OOE";
    // matic mainnet
    let _childChainManagerProxy = "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa";
    let ooe = await OOE.deploy(name, symbol, _childChainManagerProxy);
    console.log("ooe address:", ooe.address);

    await ooe.transferOwnership();
    let owner = await ooe.owner();
    console.log("owner:", owner.toString());
}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
