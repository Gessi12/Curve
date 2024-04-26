<template>
  <div>
    <div class="container">
      <!-- 主要内容 -->
      <h1>Token交换</h1>
      <label for="crvAmount">输入CRV数量:</label>
      <input type="number" id="crvAmount" v-model="crvAmount" />
      <label for="crvToAddress">输入接收地址:</label>
      <input type="text" id="crvToAddress" v-model="crvToAddress" />
      <button @click="swapTokens()">交换为VE</button>
      <p></p>

      
      <label for="veAmount">输入VE数量:</label>
      <input type="number" id="veAmount" v-model="veAmount" />
      <label for="veToAddress">输入接收地址:</label>
      <input type="text" id="veToAddress" v-model="veToAddress" />
      <button @click="swapBack()">兑换回CRV</button>
    </div>
  </div>
</template>

<script>
import Web3 from 'web3';
import SwapABI from './contracts/CrvVePair.json'; // 导入合约 ABI

export default {
  data() {
    return {
      crvAmount: 0,
      veAmount: 0,
      crvToAddress: '', // 修改为 crvToAddress
      veToAddress: '' // 修改为 veToAddress
    };
  },
  methods: {
    async swapTokens() {
  const crvAmount = this.crvAmount;
  const toAddress = this.crvToAddress; // 修改为 crvToAddress

  // 使用 Web3.js 连接到以太坊网络
  if (typeof window.ethereum !== 'undefined') {
    const web3 = new Web3(window.ethereum);
    try {
      // 请求用户授权
      await window.ethereum.enable();
      // 获取用户账户
      const accounts = await web3.eth.getAccounts();
      const fromAddress = accounts[0]; // 获取当前 MetaMask 账户的地址

      // 创建合约实例
      const contractAddress = '0xdE394be675EfF774727E281810e76832A936C77F'; // Sepolia 合约地址
      const contractABI = SwapABI.abi;
      const SwapContract = new web3.eth.Contract(contractABI, contractAddress);

      // 调用交换函数
      const result = await SwapContract.methods.swapVEToken(crvAmount, toAddress).send({ from: fromAddress });

      // 处理交换结果
      console.log('交换成功:', result);
      alert('交换成功！');
    } catch (error) {
      // 处理错误
      console.error('交换失败:', error);
      alert('交换失败，请检查授权和输入的数量！');
    }
  } else {
    // 提示用户安装 MetaMask 或其他 Web3 提供商
    alert('请安装 MetaMask 或其他 Web3 提供商');
  }
},
async swapBack() {
  const veAmount = this.veAmount;
  const toAddress = this.veToAddress; // 修改为 veToAddress

  // 使用 Web3.js 连接到以太坊网络
  if (typeof window.ethereum !== 'undefined') {
    const web3 = new Web3(window.ethereum);
    try {
      // 请求用户授权
      await window.ethereum.enable();
      // 获取用户账户
      const accounts = await web3.eth.getAccounts();
      const fromAddress = accounts[0]; // 获取当前 MetaMask 账户的地址

      // 创建合约实例
      const contractAddress = '0xdE394be675EfF774727E281810e76832A936C77F'; // Sepolia 合约地址
      const contractABI = SwapABI.abi;
      const SwapContract = new web3.eth.Contract(contractABI, contractAddress);

      // 调用兑换回CRV的函数
      const result = await SwapContract.methods.swapCRVToken(veAmount, toAddress).send({ from: fromAddress });

      // 处理交换结果
      console.log('兑换回CRV成功:', result);
      alert('兑换回CRV成功！');
    } catch (error) {
      // 处理错误
      console.error('兑换回CRV失败:', error);
      alert('兑换回CRV失败，请检查授权和输入的数量！');
    }
  } else {
    // 提示用户安装 MetaMask 或其他 Web3 提供商
    alert('请安装 MetaMask 或其他 Web3 提供商');
  }
}

  }
};
</script>

<style scoped>
.container {
  background-color: rgba(255, 255, 255, 0.5); /* 中间透明 */
  border: 2px solid rgba(0, 0, 0, 1); /* 边框不透明 */
  padding: 20px;
  border-radius: 10px; /* 可选的圆角 */
}
</style>
