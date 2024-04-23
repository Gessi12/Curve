<template>
    <div class="container">
      <h1>VE Token</h1>
      <div class="form-group">
        <label for="spender">Spender Address:</label>
        <input class="form-control" type="text" v-model="spender">
      </div>
      <div class="form-group">
        <label for="amount">Amount:</label>
        <input class="form-control" type="number" v-model.number="amount">
      </div>
      <div class="form-group">
        <button class="btn btn-primary" @click="approveTokens">Approve Tokens</button>
      </div>
      <hr>
      <div class="form-group">
        <label for="recipient">Recipient Address:</label>
        <input class="form-control" type="text" v-model="recipient">
      </div>
      <div class="form-group">
        <label for="amountToTransfer">Amount to Transfer:</label>
        <input class="form-control" type="number" v-model.number="amountToTransfer">
      </div>
      <div class="form-group">
        <button class="btn btn-primary" @click="transferTokens">Transfer Tokens</button>
      </div>
      <div class="message" v-if="transactionStatus">
        <p>{{ transactionStatus }}</p>
      </div>
      <div class="error" v-if="error">
        <p>Error: {{ error }}</p>
      </div>
      <div class="balance-check">
        <h2>Check Balance</h2>
        <div class="form-group">
          <label for="address">Address:</label>
          <input class="form-control" type="text" v-model="addressToCheck">
        </div>
        <div class="form-group">
          <button class="btn btn-primary" @click="checkBalance">Check Balance</button>
        </div>
        <div class="balance" v-if="balance !== null">
          <p>Balance of {{ addressToCheck }}: {{ balance }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Web3 from 'web3';
  import VeAbi from './contracts/VeToken.json';
  
  export default {
    data() {
      return {
        spender: '',
        recipient: '',
        amount: 0,
        amountToTransfer: 0,
        transactionStatus: '',
        error: '',
        addressToCheck: '',
        balance: null,
        contractAddress: '0xf96B197dde68408A3B10AF8Cc296b7ffbc0E1809',
        contractABI: VeAbi.abi
      };
    },
    methods: {
      async approveTokens() {
        try {
          // Clear previous errors
          this.error = '';
          const web3 = new Web3(window.ethereum);
          await window.ethereum.enable();
          const accounts = await web3.eth.getAccounts();
          const contract = new web3.eth.Contract(this.contractABI, this.contractAddress);
          await contract.methods.approve(this.spender, this.amount).send({from: accounts[0]});
          this.transactionStatus = 'Tokens approved successfully!';
        } catch (error) {
          console.error('Error approving tokens:', error);
          this.error = error.message || error.toString();
        }
      },
      async transferTokens() {
        try {
          // Clear previous errors
          this.error = '';
          const web3 = new Web3(window.ethereum);
          await window.ethereum.enable();
          const accounts = await web3.eth.getAccounts();
          const contract = new web3.eth.Contract(this.contractABI, this.contractAddress);
          await contract.methods.transfer(this.recipient, this.amountToTransfer).send({from: accounts[0]});
          this.transactionStatus = 'Tokens transferred successfully!';
        } catch (error) {
          console.error('Error transferring tokens:', error);
          this.error = error.message || error.toString();
        }
      },
      async checkBalance() {
        try {
          // Clear previous errors
          this.error = '';
          const web3 = new Web3(window.ethereum);
          await window.ethereum.enable();
          const contract = new web3.eth.Contract(this.contractABI, this.contractAddress);
          const balance = await contract.methods.balanceOf(this.addressToCheck).call();
          this.balance = balance;
        } catch (error) {
          console.error('Error checking balance:', error);
          this.error = error.message || error.toString();
        }
      }
    }
  };
  </script>
  
  <style>
.container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-group {
  margin-bottom: 20px;
}

.btn {
  cursor: pointer;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
}

.btn-primary {
  background-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.error {
  color: red;
}

.balance-check {
  margin-top: 40px;
}

.balance {
  margin-top: 20px;
  font-weight: bold;
}
</style>