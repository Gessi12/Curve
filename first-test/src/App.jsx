import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import USDTStakingContract from './contracts/USDTStakingContract.json';
import TetherToken from './contracts/TetherToken.json';
import StakeInfo from './contracts/deployment.json';
import USDTInfo from "./contracts/USDT.json"

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [stakeContract, setStakeContract] = useState(null);
  const [usdtContract, setUsdtContract] = useState(null);
  const [account, setAccount] = useState('');
  const [usdtBalance, setUsdtBalance] = useState('');
  const [totalStakedUSDT, setTotalStakedUSDT] = useState(0);
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [pendingReward, setPendingReward] = useState('');

  useEffect(() => {
    initializeWeb3();
  }, []);

  const initializeWeb3 = async () => {
  if (window.ethereum) {
    try {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      await loadUSDTContract(web3Instance); // 确保先加载 USDT 合约
      await loadStakeContract(web3Instance);
      await loadAccount(web3Instance);
      await loadUsdtBalance();
    } catch (error) {
      console.error(error);
    }
  } else {
    console.error('Please install MetaMask');
  }
};


  const loadAccount = async (web3Instance) => {
    const accounts = await web3Instance.eth.getAccounts();
    setAccount(accounts[0]);
  };

  const loadStakeContract = async (web3Instance) => {
    try {
      const networkId = await web3Instance.eth.net.getId();
      const contractAddress = StakeInfo[networkId].address;
      const contractInstance = new web3Instance.eth.Contract(
        USDTStakingContract.abi,
        contractAddress,
      );
      setStakeContract(contractInstance);
    } catch (error){
      console.error(error);
    }
  };

  const loadUSDTContract = async (web3Instance) => {
    try {
      const networkId = await web3Instance.eth.net.getId();
      const contractAddress = USDTInfo[networkId].address;
      const contractInstance = new web3Instance.eth.Contract(
        TetherToken.abi,
        contractAddress,
      );
      
      setUsdtContract(contractInstance);
    } catch (error) {
      console.error(error);
    }
  };
    
  const loadUsdtBalance = async () => {
    if (usdtContract) { // 检查 usdtContract 是否已经初始化
      try {
        const balance = await usdtContract.methods.balanceOf(account).call();
        setUsdtBalance(balance);
      } catch (error) {
        console.error('Failed to load USDT balance:', error);
      }
    } else {
      console.warn('usdtContract is null or undefined. Skipping loading USDT balance.');
    }
  };
  
  


  // const loadTotalStakedUSDT = async () => {
  //   if (stakeContract) { // 检查 stakeContract 是否已经初始化
  //     try {
  //       const totalStaked = await stakeContract.methods.totalStakedUSDT().call();
  //       setTotalStakedUSDT(totalStaked);
  //     } catch (error) {
  //       console.error('Failed to load total staked USDT:', error);
  //     }
  //   } else {
  //     console.warn('stakeContract is null or undefined. Skipping loading total staked USDT.');
  //   }
  // };
  

  const connectWallet = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await loadAccount(web3);
      
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const stake = async () => {
    try {
      const amountToStake = parseFloat(stakeAmount);
      const AmountToStake = amountToStake.toString();
      await stakeContract.methods.stake(AmountToStake).send({ from: account });
      console.log('Stake successful');
      await loadUsdtBalance();
    } catch (error) {
      console.error('Stake failed:', error);
    }
  };

  const unstake = async () => {
    try {
      const amountToUnstake = parseFloat(unstakeAmount);
      const amount = amountToUnstake.toString();
      await stakeContract.methods.unstake(amount).send({ from: account });
      await loadUsdtBalance();
    } catch (error) {
      console.error('Failed to unstake:', error);
    }
  };

  const calculateReward = async () => {
    try {
      const reward = await stakeContract.methods.calculateReward(account).call();
      setPendingReward(web3.utils.fromWei(reward, 'ether'));
    } catch (error) {
      console.error('Failed to calculate reward:', error);
    }
  };

  const claimReward = async () => {
    try {
      await stakeContract.methods.claimReward().send({ from: account });
      setPendingReward('');
      await loadUsdtBalance();
    } catch (error) {
      console.error('Failed to claim reward:', error);
    }
  };

  return (
    <div>
      <h1>USDT Staking App</h1>
      {account ? (
        <div>
          <p>Connected Account: {account}</p>
          <p>USDT Balance: {usdtBalance}</p>
        
        </div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
        
      )}
      
      
      {/* <p>Total Staked USDT: {totalStakedUSDT}</p> */}
      <div>
        <h2>Stake</h2>
        <input type="number" 
        placeholder="Stake Amount" 
        value={stakeAmount} 
        onChange={(e) => setStakeAmount(e.target.value)} 
        />
        <button onClick={stake}>Stake</button>
      </div>
      <div>
        <h2>Unstake</h2>
        <input type="number"
        placeholder="Unstake Amount" 
        value={unstakeAmount} 
        onChange={(e) => setUnstakeAmount(e.target.value)} 
        />
        <button onClick={unstake}>Unstake</button>
      </div>
      <div>
        <h2>Calculate Reward</h2>
        <button onClick={calculateReward}>Calculate Reward</button>
        <p>Pending Reward: {pendingReward}</p>
      </div>
      <div>
        <h2>Claim Reward</h2>
        <button onClick={claimReward}>Claim Reward</button>
      </div>
    </div>
  );
};

export default App;
