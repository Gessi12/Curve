import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import USDTStakingContract from './contracts/USDTStakingContract.json';

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [usdtBalance, setUsdtBalance] = useState(0);
  const [stakeAmount, setStakeAmount] = useState('');
  const [stakingInProgress, setStakingInProgress] = useState(false);
  const [unstakingInProgress, setUnstakingInProgress] = useState(false);
  const [reward, setReward] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      await initializeWeb3();
      await initializeContract();
      await updateUsdtBalance();
    } catch (error) {
      console.error(error);
    }
  };

  const initializeWeb3 = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);
      } catch (error) {
        console.error(error);
        throw new Error('Failed to connect to Ethereum wallet. Please make sure you have MetaMask installed and logged in.');
      }
    } else if (window.web3) {
      const web3Instance = new Web3(window.web3.currentProvider);
      setWeb3(web3Instance);
      const accounts = await web3Instance.eth.getAccounts();
      setAccount(accounts[0]);
    } else {
      throw new Error('No Ethereum wallet detected. Please install MetaMask.');
    }
  };

  const initializeContract = async () => {
    try {
      const networkId = await web3.eth.net.getId();
      const contractData = USDTStakingContract.networks[networkId];
      if (!contractData) {
        throw new Error('Contract not deployed on the current network.');
      }
      const contractInstance = new web3.eth.Contract(
        USDTStakingContract.abi,
        contractData.address
      );
      setContract(contractInstance);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to initialize contract.');
    }
  };

  const updateUsdtBalance = async () => {
    try {
      const usdtBalance = await contract.methods.balanceOf(account).call({ from: account });
      setUsdtBalance(web3.utils.fromWei(usdtBalance));
    } catch (error) {
      throw new Error('Failed to update USDT balance.');
    }
  };

  const stake = async () => {
    try {
      setStakingInProgress(true);
      const amount = web3.utils.toWei(stakeAmount);
      await contract.methods.stake(amount).send({ from: account, value: 0 });
      setStakeAmount('');
      await updateUsdtBalance();
    } catch (error) {
      console.error(error);
      setError('Failed to stake.');
    } finally {
      setStakingInProgress(false);
    }
  };

  const unstake = async () => {
    try {
      setUnstakingInProgress(true);
      await contract.methods.unstake().send({ from: account, value: 0 });
      await updateUsdtBalance();
    } catch (error) {
      console.error(error);
      setError('Failed to unstake.');
    } finally {
      setUnstakingInProgress(false);
    }
  };

  const claimReward = async () => {
    try {
      const reward = await contract.methods.calculateReward(account).call({ from: account });
      setReward(web3.utils.fromWei(reward));
      await contract.methods.claimReward().send({ from: account, value: 0 });
      await updateUsdtBalance();
    } catch (error) {
      console.error(error);
      setError('Failed to claim reward.');
    }
  };

  return (
    <div>
      <h1>USDT Staking App</h1>
      {account ? (
        <p>Connected Account: {account}</p>
      ) : (
        <button onClick={initializeWeb3}>Connect Wallet</button>
      )}
      {error && <p>Error: {error}</p>}
      <p>USDT Balance: {usdtBalance}</p>
      <div>
        <label>Stake Amount:</label>
        <input
          type="number"
          value={stakeAmount}
          onChange={(e) => setStakeAmount(e.target.value)}
        />
        <button onClick={stake} disabled={stakingInProgress}>
          {stakingInProgress ? 'Staking...' : 'Stake'}
        </button>
        <button onClick={unstake} disabled={unstakingInProgress}>
          {unstakingInProgress ? 'Unstaking...' : 'Unstake'}
        </button>
        <button onClick={claimReward}>Claim Reward</button>
      </div>
      <p>Reward: {reward}</p>
    </div>
  );
};

export default App;