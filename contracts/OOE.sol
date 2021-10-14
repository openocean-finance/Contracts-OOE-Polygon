// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract OOE is ERC20, Ownable {

    using SafeMath for uint256;
    // keeping it for checking, whether deposit being called by valid address or not
    address public childChainManagerProxy;
    uint constant maxSupply = (10 ** 9) * (10 ** 18);

    constructor(string memory name, string memory symbol, address _childChainManagerProxy) ERC20(name, symbol) {
        childChainManagerProxy = _childChainManagerProxy;
    }

    // being proxified smart contract, most probably childChainManagerProxy contract's address
    // is not going to change ever, but still, lets keep it
    function updateChildChainManager(address newChildChainManagerProxy) external onlyOwner {
        require(newChildChainManagerProxy != address(0), "Bad ChildChainManagerProxy address");
        childChainManagerProxy = newChildChainManagerProxy;
    }

    function deposit(address user, bytes calldata depositData) external {
        require(msg.sender == childChainManagerProxy, "not allowed to deposit");

        uint256 amount = abi.decode(depositData, (uint256));
        require(totalSupply() + amount <= maxSupply, "maxSupply exceeded");

        // `amount` token getting minted here & equal amount got locked in RootChainManager
        _mint(user, amount);
    }

    function withdraw(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
