<template>
  <div>
    <div class="container">
      <!-- 添加地址到白名单 -->
      <h2>添加地址到白名单</h2>
      <label for="whitelistAddress">输入要添加到白名单的地址:</label>
      <input type="text" id="whitelistAddress" v-model="whitelistAddress" />
      <button @click="addToWhitelist()">添加到白名单</button>
      <p></p>

      <!-- 从白名单中移除地址 -->
      <h2>从白名单中移除地址</h2>
      <label for="removeAddress">输入要从白名单中移除的地址:</label>
      <input type="text" id="removeAddress" v-model="removeAddress" />
      <button @click="removeFromWhitelist()">从白名单中移除</button>
      <p></p>

      <!-- 手动触发 Sync -->
      <h2>手动触发 Sync</h2>
      <button @click="sync()">手动触发 Sync</button>
    </div>
  </div>
</template>
  
  <script>
  import Web3 from 'web3';
  import CrvVePairABI from './contracts/CrvVePair.json'; // 导入合约 ABI
  
  export default {
    data() {
      return {
        whitelistAddress: '',
        removeAddress: ''
      };
    },
    methods: {
      async addToWhitelist() {
        const address = this.whitelistAddress;
  
        if (typeof window.ethereum !== 'undefined') {
          const web3 = new Web3(window.ethereum);
          try {
            await window.ethereum.enable();
            const accounts = await web3.eth.getAccounts();
            const fromAddress = accounts[0];
  
            const contractAddress = '0xdE394be675EfF774727E281810e76832A936C77F'; // CrvVePair 合约地址
            const contractABI = CrvVePairABI.abi;
            const contract = new web3.eth.Contract(contractABI, contractAddress);
  
            await contract.methods.addToWhitelist(address).send({ from: fromAddress });
  
            alert('地址已成功添加到白名单！');
          } catch (error) {
            console.error('添加到白名单失败:', error);
            alert('添加到白名单失败，请检查授权和输入的地址！');
          }
        } else {
          alert('请安装 MetaMask 或其他 Web3 提供商');
        }
      },
      async removeFromWhitelist() {
        const address = this.removeAddress;
  
        if (typeof window.ethereum !== 'undefined') {
          const web3 = new Web3(window.ethereum);
          try {
            await window.ethereum.enable();
            const accounts = await web3.eth.getAccounts();
            const fromAddress = accounts[0];
  
            const contractAddress = '0xdE394be675EfF774727E281810e76832A936C77F'; // CrvVePair 合约地址
            const contractABI = CrvVePairABI.abi;
            const contract = new web3.eth.Contract(contractABI, contractAddress);
  
            await contract.methods.removeToWhitelist(address).send({ from: fromAddress });
  
            alert('地址已成功从白名单中移除！');
          } catch (error) {
            console.error('从白名单中移除失败:', error);
            alert('从白名单中移除失败，请检查授权和输入的地址！');
          }
        } else {
          alert('请安装 MetaMask 或其他 Web3 提供商');
        }
      },

      async sync() {
        if (typeof window.ethereum !== 'undefined') {
          const web3 = new Web3(window.ethereum);
          try {
            await window.ethereum.enable();
            const accounts = await web3.eth.getAccounts();
            const fromAddress = accounts[0];

            const contractAddress = '0xdE394be675EfF774727E281810e76832A936C77F'; // CrvVePair 合约地址
            const contractABI = CrvVePairABI.abi;
            const contract = new web3.eth.Contract(contractABI, contractAddress);

            await contract.methods.sync().send({ from: fromAddress });

            alert('Sync 触发成功！');
          } catch (error) {
            console.error('Sync 触发失败:', error);
            alert('Sync 触发失败，请检查授权！');
          }
        } else {
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
  