require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    networks: {
        hardhat: {
            forking: {
                url: "https://rpc-mainnet.maticvigil.com/",
                chainId: 137,
                gasPrice: 1000000000,
                gas: 2000000,
                timeout: 10000000,
                accounts: [],
            },
        },
        mainnet: {
            url: "http://119.28.106.68:10331",
            chainId: 1,
            gasPrice: 60000000000,
            gas: 2000000,
            timeout: 10000000,
            accounts: [],
        },
    },
    solidity: "0.8.4",
    settings: {
        optimizer: {
            enabled: true,
            runs: 999999
        }
    }
};
