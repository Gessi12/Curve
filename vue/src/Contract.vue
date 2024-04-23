<template>
  
  <div class="container">
    <h1>USDT Staking App</h1>
    <div v-if="account" class="account-info">
      <p>Connected Account: {{ account }}</p>
      <p>USDT Balance: {{ usdtBalance }}</p>
      <p>Staked Amount: {{ stakedAmount }}</p> <!-- 显示质押金额 -->
    </div>
    <button v-else @click="connectWallet" class="connect-button">Connect Wallet</button>

    <div class="stake-section">
      <h2>Stake</h2>
      <input type="number" placeholder="Stake Amount" v-model="stakeAmount" class="input-field" />
      <button @click="stake" class="action-button">Stake</button>
    </div>

    <div class="unstake-section">
      <h2>Unstake</h2>
      <input type="number" placeholder="Unstake Amount" v-model="unstakeAmount" class="input-field" />
      <button @click="unstake" class="action-button">Unstake</button>
    </div>

    <div class="calculate-reward-section">
      <h2>Calculate Reward</h2>
      <button @click="calculateReward" class="action-button">Calculate Reward</button>
      <p class="reward-info">Pending Reward: {{ pendingReward }}</p>
    </div>

    <div class="claim-reward-section">
      <h2>Claim Reward</h2>
      <button @click="claimReward" class="action-button">Claim Reward</button>
    </div>

    <router-link to="/contract" class="router-link">Go to Contract</router-link>
  </div>
</template>

<script>
import Web3 from 'web3';
import USDTStakingContract from './contracts/USDTStakingContract.json';
import TetherToken from './contracts/TetherToken.json';
import StakeInfo from './contracts/deployment.json';
import USDTInfo from "./contracts/USDT.json"

export default {
  data() {
    return {
      web3: null,
      stakeContract: null,
      usdtContract: null,
      account: '',
      usdtBalance: '',
      stakedAmount: '', // 新增质押金额属性
      stakeAmount: '',
      unstakeAmount: '',
      pendingReward: ''
    };
  },
  created() {
    this.initializeWeb3();
  },
  methods: {
    async initializeWeb3() {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          this.web3 = web3Instance;
          await this.loadUSDTContract();
          await this.loadStakeContract();
          await this.loadAccount();
          await this.loadUsdtBalance();
          await this.loadStakedAmount(); // 加载质押金额
        } catch (error) {
          console.error(error);
        }
      } else {
        console.error('Please install MetaMask');
      }
    },
    async loadAccount() {
      const accounts = await this.web3.eth.getAccounts();
      this.account = accounts[0];
    },
    async loadStakeContract() {
      try {
        const networkId = await this.web3.eth.net.getId();
        const contractAddress = StakeInfo[networkId].address;
        this.stakeContract = new this.web3.eth.Contract(
          USDTStakingContract.abi,
          contractAddress,
        );
      } catch (error) {
        console.error(error);
      }
    },
    async loadUSDTContract() {
      try {
        const networkId = await this.web3.eth.net.getId();
        const contractAddress = USDTInfo[networkId].address;
        this.usdtContract = new this.web3.eth.Contract(
          TetherToken.abi,
          contractAddress,
        );
      } catch (error) {
        console.error(error);
      }
    },
    async loadUsdtBalance() {
      if (this.usdtContract) {
        try {
          const balance = await this.usdtContract.methods.balanceOf(this.account).call();
          this.usdtBalance = balance;
        } catch (error) {
          console.error('Failed to load USDT balance:', error);
        }
      } else {
        console.warn('usdtContract is null or undefined. Skipping loading USDT balance.');
      }
    },
    async loadStakedAmount() {
      try {
        const stakedAmount = await this.stakeContract.methods.getStakedAmount(this.account).call();
        this.stakedAmount = stakedAmount;
      } catch (error) {
        console.error('Failed to load staked amount:', error);
      }
    },
    async connectWallet() {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        await this.loadAccount();
        await this.loadStakedAmount(); // 连接钱包后重新加载质押金额
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    },
    async stake() {
      try {
        const amountToStake = parseFloat(this.stakeAmount);
        await this.stakeContract.methods.stake(amountToStake.toString()).send({ from: this.account });
        console.log('Stake successful');
        await this.loadUsdtBalance();
        await this.loadStakedAmount(); // 在质押后重新加载质押金额
      } catch (error) {
        console.error('Stake failed:', error);
      }
    },
    async unstake() {
      try {
        const amountToUnstake = parseFloat(this.unstakeAmount);
        await this.stakeContract.methods.unstake(amountToUnstake.toString()).send({ from: this.account });
        await this.loadUsdtBalance();
        await this.loadStakedAmount(); // 在解质押后重新加载质押金额
      } catch (error) {
        console.error('Failed to unstake:', error);
      }
    },
    async calculateReward() {
      try {
        const reward = await this.stakeContract.methods.calculateReward(this.account).call();
        this.pendingReward = this.web3.utils.fromWei(reward, 'ether');
      } catch (error) {
        console.error('Failed to calculate reward:', error);
      }
    },
    async claimReward() {
      try {
        await this.stakeContract.methods.claimReward().send({ from: this.account });
        this.pendingReward = '';
        await this.loadUsdtBalance();
        await this.loadStakedAmount(); // 在领取奖励后重新加载质押金额
      } catch (error) {
        console.error('Failed to claim reward:', error);
      }
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.account-info {
  background-color: #f0f0f0;
  padding: 10px;
  margin-bottom: 20px;
}

.connect-button {
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.connect-button:hover {
  background-color: #0056b3;
}

.stake-section,
.unstake-section,
.calculate-reward-section,
.claim-reward-section {
  margin-bottom: 20px;
}

h2 {
  margin-bottom: 10px;
}

.input-field {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
}

.action-button {
  background-color: #28a745;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.action-button:hover {
  background-color: #218838;
}

.reward-info {
  margin-top: 10px;
}

.router-link {
  display: block;
  color: #007bff;
  margin-top: 20px;
  text-decoration: none;
}
</style>