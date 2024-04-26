<template>    
    <div id="app">
      <h1>Staking App</h1>
      <div v-if="account" class="account-info">
        <p>Connected Account: {{ account }}</p>
        <p>Account Balance: {{ accountBalance }} ETH</p>
      </div>
      <button v-else @click="connectWallet" class="button">Connect Wallet</button>
      <p>Total Staked ETH: {{ totalStakedETH }}</p>
  
      <div class="section">
        <h2>Stake</h2>
        <input type="number" placeholder="Stake Amount" v-model="stakeAmount" class="input-field" />
        <button @click="handleStake" class="action-button">Stake</button>
      </div>
  
      <div class="section">
        <h2>Calculate Reward</h2>
        <button @click="calculateReward" class="action-button">Calculate Reward</button>
        <p v-if="pendingReward !== ''" class="reward-info">Pending Reward: {{ pendingReward }}</p>
      </div>
  
      <div class="section">
        <h2>Claim Reward</h2>
        <button @click="claimReward" class="action-button">Claim Reward</button>
      </div>
  
      <div class="section">
        <h2>Unstake</h2>
        <input type="number" placeholder="Unstake Amount" v-model="unstakeAmount" class="input-field" />
        <button @click="handleUnstake" class="action-button">Unstake</button>
      </div>

      <div class="section">
        <h2>Get Stake Amount</h2>
        <button @click="getStakeAmount" class="action-button">Get Stake Amount</button>
        <p v-if="stakeAmount !== ''" class="reward-info">Stake Amount: {{ stakeAmount }}</p>
      </div>

    </div>
  </template>
  
  <script>
  import Web3 from 'web3';
  import StakingContractABI from './contracts/StakingContract.json';
  import deploymentInfo from './contracts/WethStakeDeployment.json';
  
  export default {
    data() {
      return {
        web3: null,
        contract: null,
        account: '',
        stakeAmount: '',
        unstakeAmount: '',
        totalStakedETH: '',
        accountBalance: '',
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
            this.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
            this.loadContract();
            this.loadAccount();
            this.loadTotalStakedETH();
            this.loadAccountBalance();
          } catch (error) {
            console.error(error);
          }
        } else {
          console.error('Please install MetaMask');
        }
      },
      async loadContract() {
        try {
          const networkId = await this.web3.eth.net.getId();
          const contractAddress = deploymentInfo[networkId].address;
          this.contract = new this.web3.eth.Contract(StakingContractABI.abi, contractAddress);
        } catch (error) {
          console.error(error);
        }
      },
      async loadAccount() {
        const accounts = await this.web3.eth.getAccounts();
        this.account = accounts[0];
      },
      async loadTotalStakedETH() {
        const totalStaked = await this.contract.methods.totalStaked().call();
        this.totalStakedETH = this.web3.utils.fromWei(totalStaked, 'ether');
      },
      async loadAccountBalance() {
        const balance = await this.web3.eth.getBalance(this.account);
        this.accountBalance = this.web3.utils.fromWei(balance, 'ether');
      },
      async connectWallet() {
        try {
          if (window.ethereum) {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.loadAccount();
            this.loadAccountBalance();
          }
        } catch (error) {
          console.error('Failed to connect wallet:', error);
        }
      },
      async handleStake() {
        try {
          const amountToStake = parseFloat(this.stakeAmount);
          const weiAmountToStake = this.web3.utils.toWei(amountToStake.toString(), 'ether');
          const transaction = this.contract.methods.stake().send({
            from: this.account,
            value: weiAmountToStake
          });
          const receipt = await transaction;
          console.log('Stake transaction receipt:', receipt);
          this.loadTotalStakedETH();
          this.loadAccountBalance();
        } catch (error) {
          console.error('Failed to stake:', error);
        }
      },
      async handleUnstake() {
        try {
          const amountToUnstake = parseFloat(this.unstakeAmount);
          const weiAmountToUnstake = this.web3.utils.toWei(amountToUnstake.toString(), 'ether');
          const transaction = this.contract.methods.unstake(weiAmountToUnstake).send({
            from: this.account
          });
          const receipt = await transaction;
          console.log('Unstake transaction receipt:', receipt);
          this.loadTotalStakedETH();
          this.loadAccountBalance();
        } catch (error) {
          console.error('Failed to unstake:', error);
        }
      },
      async getStakeAmount() {
        try {
          const stakeAmount = await this.contract.methods.getStakeAmount(this.account).call();
          this.stakeAmount = stakeAmount;
        } catch (error) {
          console.error('Failed to get stake amount:', error);
        }
      },

      async calculateReward() {
        try {
          const reward = await this.contract.methods.calculateReward(this.account).call();
          this.pendingReward = reward;
        } catch (error) {
          console.error('Failed to calculate reward:', error);
        }
      },
      async claimReward() {
        try {
          const transaction = this.contract.methods.claimReward().send({ from: this.account });
          const receipt = await transaction;
          console.log('Claim reward transaction receipt:', receipt);
          this.pendingReward = '';
          this.loadAccountBalance();
        } catch (error) {
          console.error('Failed to claim reward:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  #app {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  h1 {
    color: #333;
    text-align: center;
  }
  
  .account-info {
    background-color: #f0f0f0;
    padding: 10px;
    margin-bottom: 20px;
  }
  
  .button {
    background-color: #007bff;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .button:hover {
    background-color: #0056b3;
  }
  
  .section {
    margin-bottom: 20px;
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
  </style>
  