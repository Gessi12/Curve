// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../Token/ICrvToken.sol";
import "../Token/IVeToken.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract StakingContract {
    ICrvToken public crvToken;
    IVeToken public veToken;

    mapping(address => uint256) private stakedAmounts;

    constructor(address _crvToken, address _veToken) {
        crvToken = ICrvToken(_crvToken);
        veToken = IVeToken(_veToken);
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        require(crvToken.balanceOf(msg.sender) >= amount, "Insufficient CRV balance");
        require(crvToken.allowance(msg.sender, address(this)) >= amount, "Insufficient CRV allowance");

        crvToken.transferFrom(msg.sender, address(this), amount);
        
        stakedAmounts[msg.sender] += amount;
        veToken.transfer(msg.sender, amount);
    }

    function unstake(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        require(stakedAmounts[msg.sender] >= amount, "Insufficient staked amount");

        stakedAmounts[msg.sender] -= amount;
        veToken.transferFrom(msg.sender, address(this), amount);
        crvToken.transfer(msg.sender, amount);
    }

    function getStakedAmount(address account) external view returns (uint256) {
        return stakedAmounts[account];
    }
}
