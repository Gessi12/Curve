<template>
    <div>
      <h1>账户交易信息查询</h1>
      <p>当前账户：{{ currentAccount }}</p>
      <p>当前网络：{{ currentNetwork }}</p>
      <button @click="fetchAccountTransactions">查询</button>
      <input v-model="accountAddress" placeholder="账户地址">
      <ul v-if="accountTransactions.length > 0">
        <li v-for="(transaction, index) in accountTransactions" :key="index">
          <div>交易哈希：{{ transaction.hash }}</div>
          <div>发送地址：{{ transaction.from }}</div>
          <div>接收地址：{{ transaction.to }}</div>
          <div>价值：{{ transaction.value }}</div>
        </li>
      </ul>
      <p v-else>没有找到账户交易信息</p>
    </div>
  </template>
  
  <script>
  import Web3 from 'web3';
  
  export default {
    data() {
      return {
        accountAddress: '',
        accountTransactions: [],
        currentAccount: '',
        currentNetwork: ''
      };
    },
    async mounted() {
      await this.getCurrentAccount();
      await this.getCurrentNetwork();
    },
    methods: {
      async fetchAccountTransactions() {
        try {
          // 连接到以太坊网络
          const web3 = new Web3(window.ethereum);
  
          // 获取账户的交易记录
          const transactions = await web3.eth.getTransactionsByAddress(this.accountAddress);
          
          // 将交易信息存储在组件的数据中
          this.accountTransactions = transactions;
        } catch (error) {
          console.error('获取账户交易信息时出错：', error);
        }
      },
      async getCurrentAccount() {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          this.currentAccount = accounts[0];
        } catch (error) {
          console.error('获取当前账户时出错：', error);
        }
      },
      async getCurrentNetwork() {
        try {
          const networkId = await window.ethereum.request({ method: 'net_version' });
          switch (networkId) {
            case '1':
              this.currentNetwork = '主网';
              break;
            case '3':
              this.currentNetwork = 'Ropsten 测试网络';
              break;
            case '4':
              this.currentNetwork = 'Rinkeby 测试网络';
              break;
            case '5':
              this.currentNetwork = 'Goerli 测试网络';
              break;
            case '42':
              this.currentNetwork = 'Kovan 测试网络';
              break;
            case '11155111':
              this.currentNetwork = 'Sepolia 测试网络';
              break;
            default:
              this.currentNetwork = '未知网络';
          }
        } catch (error) {
          console.error('获取当前网络时出错：', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* 可以添加一些样式来美化页面 */
  </style>
  