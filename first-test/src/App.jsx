import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './App.css'; // 导入 CSS 文件
import stakingContractABI from "./ABI/StakingContract.json"

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

const StakingContract = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState('');
  const [stakeInfo, setStakeInfo] = useState(null);

  // 初始化 Web3 和合约
  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.enable();
        setWeb3(web3Instance);
      }
    };

    const initContract = async () => {
      if (web3) {
        const contractAddress = '0xee8fb2e91bc02b28673d147eae5d9db04ccf3295';


        const contractInstance = new web3.eth.Contract(stakingContractABI, contractAddress);
        setContract(contractInstance);
      }
    };

    initWeb3();
    initContract();
  }, []);

  // 获取当前账户
  useEffect(() => {
    const getAccount = async () => {
      if (web3) {
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      }
    };

    getAccount();
  }, [web3]);

  // 获取合约余额
  useEffect(() => {
    const getBalance = async () => {
      if (contract && account) {
        const balance = await contract.methods.balanceOf(account).call();
        setBalance(fromWei(balance));
      }
    };

    getBalance();
  }, [contract, account]);

  // 获取质押信息
  const getStakeInfo = async () => {
    if (contract && account) {
      const stake = await contract.methods.stakes(account).call();
      setStakeInfo(stake);
    }
  };

  // 质押函数
  const stake = async () => {
    if (contract && account && amount) {
      const weiAmount = web3.utils.toWei(amount);
      await contract.methods.stake().send({ from: account, value: weiAmount });
      setAmount('');
      getStakeInfo();
    }
  };

  // 取回质押函数
  const unstake = async () => {
    if (contract && account) {
      await contract.methods.unstake().send({ from: account });
      getStakeInfo();
    }
  };

  return (
    <div>
      <h2>Staking Contract</h2>
      <p>Account: {account}</p>
      <p>Balance: {balance} ETH</p>
      <p>Staked Amount: {stakeInfo?.amount || 0}</p>
      <p>Staked Timestamp: {stakeInfo?.timestamp || 0}</p>
      <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button onClick={stake}>Stake</button>
      <button onClick={unstake}>Unstake</button>
    </div>
  );
};

const App = () => {
  return (
    <div className="App">
      <ConnectWalletButton />
      <StakingContract />
    </div>
  );
};

export default App;