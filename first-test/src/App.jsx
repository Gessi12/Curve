import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import USDTStakingContract from './contracts/USDTStakingContract.json';
import deploymentInfo from "./contracts/deployment.json";

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [usdtBalance, setUsdtBalance] = useState(0);
  const [totalStakedUSDT, setTotalStakedUSDT] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  // const [stakingInProgress, setStakingInProgress] = useState(false);
  // const [unstakingInProgress, setUnstakingInProgress] = useState(false);
  const [pendingReward, setPendingReward] = useState('');
  const [reward, setReward] = useState(0);
  // const [error, setError] = useState('');

  useEffect(() => {
    initializeWeb3();
  }, []);

  const initializeWeb3 = async () => {
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        loadContract(web3Instance);
        loadAccount();
        loadTotalStakedUSDT();
        loadUsdtBalance();
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('Please install MetaMask');
    }
  };

  const loadAccount = async () => {
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
  };

  const loadContract = async (web3Instance) => {
    try {
      const networkId = await web3Instance.eth.net.getId();
      const contractAddress = deploymentInfo.networks[networkId].address;
      const contractInstance = new web3Instance.eth.Contract(
        USDTStakingContract.abi,
        contractAddress
      );
      setContract(contractInstance);
    } catch (error) {
      console.error(error);
    }
  };

  const loadUsdtBalance = async () => {
    try {
      const usdtBalance = await contract.methods.balanceOf(account).call({ from: account });
      setUsdtBalance(usdtBalance);
    } catch (error) {
      throw new Error('Failed to update USDT balance.');
    }
  };

  const loadTotalStakedUSDT = async () => {
    const totalStaked = await contract.methods.totalStaked().call();
    setTotalStakedUSDT(totalStaked);
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        loadAccount();
        loadUsdtBalance();
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };


  const stake = async () => {
    try {
      // setStakingInProgress(true);
      const amountToStake = parseFloat(stakeAmount);
      // const amount = web3.utils.toWei(amountToStake.toString);
      // const weiAmountToStake = web3.utils.toWei(amountToStake.toString(), 'ether');
      const transaction = contract.methods.stake().send({
        from: account,
        value: amountToStake
      });
      // await contract.methods.stake(amount).send({ from: account, value: 0 });

      const receipt = await transaction;
      console.log('Stake transaction receipt:', receipt);
      loadTotalStakedUSDT();
      loadUsdtBalance();
    } catch (error) {
      console.error(error);
    // } finally {
    //   setStakingInProgress(false);
    }
  };

  const unstake = async () => {
    try {
      // setUnstakingInProgress(true);
      const amountToUnstake = parseFloat(unstakeAmount);
      // await contract.methods.unstake().send({ from: account, value: 0 });
      const transaction = contract.methods.unstake(amountToUnstake).send({
        from: account
      });
      const receipt = await transaction;
      console.log('Unstake transaction receipt:', receipt);
      loadTotalStakedUSDT();
      loadUsdtBalance();
    } catch (error) {
      console.error(error);
      // setError('Failed to unstake.');
    // } finally {
    //   setUnstakingInProgress(false);
    }
  };

  const calculateReward = async () => {
    try {
      const reward = await contract.methods.calculateReward().call({ from: account });
      setPendingReward(reward);
    } catch (error) {
      console.error('Failed to calculate reward:', error);
    }
  };

  const claimReward = async () => {
    try {
      const transaction = contract.methods.claimReward().send({ from: account });
      const receipt = await transaction;
      console.log('Claim reward transaction receipt:', receipt);
      setPendingReward('');
      loadUsdtBalance();
    } catch (error) {
      console.error(error);
      // setError('Failed to claim reward.');
    }
  };

  return (
    <div>
      <h1>Staking App</h1>
      {account ? (
        <div>
          <p>Connected Account: {account}</p>
          <p>Account Balance: {usdtBalance}</p>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
      <p>Total Staked ETH: {totalStakedUSDT}</p>
      <div>
        <h2>Stake</h2>
        <input
          type="number"
          placeholder="Stake Amount"
          value={stakeAmount}
          onChange={(e) => setStakeAmount(e.target.value)}
        />
        <button onClick={stake}>Stake</button>
      </div>

      <div>
        <h2>Calculate Reward</h2>
        <button onClick={calculateReward}>Calculate Reward</button>
        {pendingReward !== '' && <p>Pending Reward: {pendingReward}</p>}
      </div>

      <div>
        <h2>Claim Reward</h2>
        <button onClick={claimReward}>Claim Reward</button>
      </div>
      <div>
        <h2>Unstake</h2>
        <input
          type="number"
          placeholder="Unstake Amount"
          value={unstakeAmount}
          onChange={(e) => setUnstakeAmount(e.target.value)}
        />
        <button onClick={unstake}>Unstake</button>
      </div>
    </div>
  );
};

export default App;