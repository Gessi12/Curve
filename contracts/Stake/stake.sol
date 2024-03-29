// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract StakingContract {

    IERC20 public crvToken;
    uint256 public exchangeRate;  // ETH-to-CRV exchange rate
    uint256 public rewardRate;    // Reward rate as a percentage (e.g., 5 for 5%)
    uint256 public totalStakedETH;
    uint256 public constant ONE_WEEK = 1 weeks;
    address public owner = msg.sender;

    

    struct Stake {
        uint256 amount;
        uint256 timestamp;
    }


    mapping(address => Stake) public stakes;

    event Staked(address indexed account, uint256 amount);
    event Unstaked(address indexed account, uint256 amount);
    event RewardClaimed(address indexed account, uint256 amount);

    constructor(address _crvToken, uint256 _rewardRate) {
        crvToken = IERC20(_crvToken);
        exchangeRate = 10;  // 1 ETH = 10 CRV (for example)
        rewardRate = _rewardRate;
        
    }
    
    modifier onlyOwner(){
        require(owner == msg.sender);
        _;
    }

    function stake() external payable {
        require(msg.value > 0, "Amount must be greater than zero.");

        uint256 amount = msg.value;
        crvToken.transfer(msg.sender, amount * exchangeRate);


        totalStakedETH += amount;
        stakes[msg.sender] = Stake(amount, block.timestamp);

        emit Staked(msg.sender, amount);
    }

    function unstake() external {
        Stake storage stakeInfo = stakes[msg.sender];
        require(stakeInfo.amount > 0, "No staked ETH.");

        uint256 amount = stakeInfo.amount;
        uint256 reward = calculateReward(msg.sender);

        delete stakes[msg.sender];
        crvToken.transferFrom(owner, msg.sender, amount * exchangeRate);
        payable(msg.sender).transfer(amount);

        totalStakedETH -= amount;

        emit Unstaked(msg.sender, amount);
        emit RewardClaimed(msg.sender, reward);
    }

    function calculateReward(address account) public view returns (uint256) {
        Stake storage stakeInfo = stakes[account];
        require(stakeInfo.amount > 0, "No staked ETH.");

        uint256 stakingTime = block.timestamp - stakeInfo.timestamp;
        uint256 rewardPercentage = rewardRate * stakingTime / (ONE_WEEK);
        uint256 rewardAmount = stakeInfo.amount * rewardPercentage / (100);

        return rewardAmount;
    }

    function claimReward() external {
        uint256 reward = calculateReward(msg.sender);
        require(reward > 0, "No reward available.");

        stakes[msg.sender].timestamp = block.timestamp;
        crvToken.transfer(msg.sender, reward);

        emit RewardClaimed(msg.sender, reward);
    }

    function updateExchangeRate(uint256 rate) external onlyOwner {
        exchangeRate = rate;
    }

    function updateRewardRate(uint256 rate) external onlyOwner {
        rewardRate = rate;
    }
}