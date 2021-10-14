const {expect} = require("chai");

describe("OOE", function () {
    it("ooe", async function () {
        let [signer, signer2] = await ethers.getSigners();
        const OOE = await ethers.getContractFactory("OOE");
        let name = "OOE";
        let symbol = "OOE";
        // matic mainnet
        let _childChainManagerProxy = "0xe7804c37c13166fF0b37F5aE0BB07A3aEbb6e245";
        const ooe = await OOE.deploy(name, symbol, _childChainManagerProxy);
        await ooe.deployed();
        expect(await ooe.totalSupply()).to.equal(ethers.BigNumber.from('0'));
        expect(await ooe.owner()).to.equal(signer.address);

        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [_childChainManagerProxy],
        });
        let decimal = ethers.BigNumber.from('1000000000000000000');
        let child = await ethers.getSigner(_childChainManagerProxy);

        let mintAmt = ethers.BigNumber.from('100000');
        let args = ethers.utils.defaultAbiCoder.encode(["uint256"], [mintAmt]);
        await ooe.connect(child).deposit(signer.address, args);

        expect(await ooe.totalSupply()).to.equal(mintAmt);
        expect(await ooe.balanceOf(signer.address)).to.equal(mintAmt);

        await ooe.connect(signer).withdraw(mintAmt.div(2));
        expect(await ooe.totalSupply()).to.equal(mintAmt.div(2));
        expect(await ooe.balanceOf(signer.address)).to.equal(mintAmt.div(2));

        await ooe.connect(signer).transfer(_childChainManagerProxy, mintAmt.div(4));
        expect(await ooe.balanceOf(signer.address)).to.equal(mintAmt.div(4));
        expect(await ooe.balanceOf(_childChainManagerProxy)).to.equal(mintAmt.div(4));

        await ooe.connect(signer).approve(signer2.address, mintAmt.div(5));
        expect(await ooe.allowance(signer.address, signer2.address)).to.equal(mintAmt.div(5));

        await ooe.connect(signer2).transferFrom(signer.address, signer2.address, mintAmt.div(5));
        expect(await ooe.allowance(signer.address, signer2.address)).to.equal(0);
        expect(await ooe.balanceOf(signer2.address)).to.equal(mintAmt.div(5));


        let mintAmt2 = ethers.BigNumber.from('1000000000').mul(ethers.BigNumber.from('1000000000000000000')).sub(mintAmt);
        args = ethers.utils.defaultAbiCoder.encode(["uint256"], [mintAmt2]);
        await ooe.connect(child).deposit(signer.address, args);

        await ooe.transferOwnership(signer2.address);
        expect(await ooe.owner()).to.equal(signer2.address);
    });
});
