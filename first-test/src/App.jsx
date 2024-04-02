import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './App.css'; // 导入 CSS 文件

const ConnectWalletButton = () => {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setConnected(true);
      } catch (error) {
        console.error('用户拒绝授权');
      }
    } else {
      console.error('请安装 MetaMask 插件');
    }
  };

  useEffect(() => {
    if (connected) {
      fetchWalletData();
    }
  }, [connected]);

  const fetchWalletData = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        const address = accounts[0];
        setWalletAddress(address);

        const balance = await web3.eth.getBalance(address);
        const etherBalance = web3.utils.fromWei(balance, 'ether');
        setBalance(etherBalance);
      }
    }
  };

  const buttonStyle = {
    backgroundColor: '#4CAF50',
    border: 'none',
    color: 'white',
    padding: '10px 20px',
    textDecoration: 'none',
    cursor: 'pointer'
  };

  const infoStyle = {
    marginTop: '10px'
  };

  return (
    <div>
      <button className="connect-wallet-button" onClick={connectWallet}>
        连接钱包
      </button>
      {connected && (
        <div className="wallet-info">
          <p>已连接钱包</p>
          <p>钱包地址: {walletAddress}</p>
          <p>余额: {balance} ETH</p>
        </div>
      )}
    </div>
  );
};



export default ConnectWalletButton;