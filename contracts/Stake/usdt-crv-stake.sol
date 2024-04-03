// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract USDTStakingContract {
    IERC20 public usdtToken;
    IERC20 public crvToken;
    uint256 public exchangeRate;
    uint256 public rewardRate;    // Reward rate as a percentage (e.g., 5 for 5%)
    uint256 public totalStakedUSDT;
    uint256 public constant ONE_WEEK = 1 weeks;
    address public owner;

    struct Stake {
        uint256 usdtAmount;
        uint256 timestamp;
    }

    mapping(address => Stake) public stakes;

    event Staked(address indexed account, uint256 usdtAmount);
    event Unstaked(address indexed account, uint256 usdtAmount);
    event RewardClaimed(address indexed account, uint256 crvAmount);

    constructor(address _usdtToken, address _crvToken, uint256 _rewardRate) {
        usdtToken = IERC20(_usdtToken);
        crvToken = IERC20(_crvToken);
        exchangeRate = 1;  // 1 USDT = 1 CRV (for example)
        rewardRate = _rewardRate;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "Only the contract owner can call this function.");
        _;
    }

    function stake(uint256 usdtAmount) external {
        require(usdtAmount > 0, "Amount must be greater than zero.");

        usdtToken.transferFrom(msg.sender, address(this), usdtAmount);

        totalStakedUSDT += usdtAmount;
        crvToken.transfer(msg.sender, usdtAmount * exchangeRate);
        stakes[msg.sender] = Stake(usdtAmount, block.timestamp);

        emit Staked(msg.sender, usdtAmount);
    }

    function unstake() external {
        Stake storage stakeInfo = stakes[msg.sender];
        require(stakeInfo.usdtAmount > 0, "No staked USDT.");

        uint256 usdtAmount = stakeInfo.usdtAmount;
        uint256 reward = calculateReward(msg.sender);

        delete stakes[msg.sender];
        crvToken.transferFrom(msg.sender, address(this), usdtAmount * exchangeRate);
        usdtToken.transfer(msg.sender, usdtAmount);

        totalStakedUSDT -= usdtAmount;

        emit Unstaked(msg.sender, usdtAmount);
        emit RewardClaimed(msg.sender, reward);
    }

    function calculateReward(address account) public view returns (uint256) {
        Stake storage stakeInfo = stakes[account];
        require(stakeInfo.usdtAmount > 0, "No staked USDT.");

        uint256 stakingTime = block.timestamp - stakeInfo.timestamp;
        uint256 rewardPercentage = rewardRate * stakingTime / ONE_WEEK;
        uint256 rewardAmount = stakeInfo.usdtAmount * rewardPercentage / 100;

        return rewardAmount;
    }

    function claimReward() external {
        uint256 reward = calculateReward(msg.sender);
        require(reward > 0, "No reward available.");

        stakes[msg.sender].timestamp = block.timestamp;
        crvToken.transfer(msg.sender, reward);

        emit RewardClaimed(msg.sender, reward);
    }

    function updateRewardRate(uint256 rate) external onlyOwner {
        rewardRate = rate;
    }

    function setOwner(address _owner) external onlyOwner {
        owner = _owner;
    }
}