import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import StakingContractABI from './ABI/StakingContract.json';
import deploymentInfo from './deployment.json';

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [totalStakedETH, setTotalStakedETH] = useState('');
  const [accountBalance, setAccountBalance] = useState('');
  const [pendingReward, setPendingReward] = useState('');

  useEffect(() => {
    initializeWeb3();
  }, []);

  const initializeWeb3 = async () => {
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.enable();
        setWeb3(web3Instance);
        loadContract(web3Instance);
        loadAccount();
        loadTotalStakedETH();
        loadAccountBalance();
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('Please install MetaMask');
    }
  };

  const loadContract = async (web3Instance) => {
    try {
      const networkId = await web3Instance.eth.net.getId();
      const contractAddress = deploymentInfo[networkId].address;
      const contractInstance = new web3Instance.eth.Contract(
        StakingContractABI.abi,
        contractAddress
      );
      setContract(contractInstance);
    } catch (error) {
      console.error(error);
    }
  };

  const loadAccount = async () => {
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
  };

  const loadTotalStakedETH = async () => {
    const totalStaked = await contract.methods.totalStaked().call();
    setTotalStakedETH(web3.utils.fromWei(totalStaked, 'ether'));
  };

  const loadAccountBalance = async () => {
    const balance = await web3.eth.getBalance(account);
    setAccountBalance(web3.utils.fromWei(balance, 'ether'));
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        loadAccount();
        loadAccountBalance();
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleStake = async () => {
    try {
      const amountToStake = parseFloat(stakeAmount);
      const weiAmountToStake = web3.utils.toWei(amountToStake.toString(), 'ether');
      const transaction = contract.methods.stake().send({
        from: account,
        value: weiAmountToStake
      });
      const receipt = await transaction;
      console.log('Stake transaction receipt:', receipt);
      loadTotalStakedETH();
      loadAccountBalance();
    } catch (error) {
      console.error('Failed to stake:', error);
    }
  };

  const handleUnstake = async () => {
    try {
      const amountToUnstake = parseFloat(unstakeAmount);
      const weiAmountToUnstake = web3.utils.toWei(amountToUnstake.toString(), 'ether');
      const transaction = contract.methods.unstake(weiAmountToUnstake).send({
        from: account
      });
      const receipt = await transaction;
      console.log('Unstake transaction receipt:', receipt);
      loadTotalStakedETH();
      loadAccountBalance();
    } catch (error) {
      console.error('Failed to unstake:', error);
    }
  };

  const calculateReward = async () => {
    try {
      const reward = await contract.methods.calculateReward().call({ from: account });
      setPendingReward(web3.utils.fromWei(reward, 'ether'));
    } catch (error) {
      console.error('Failed to calculate reward:', error);
    }
  };

  const claimReward = async () => {
    try {
      const transaction = contract.methods.claimReward().send({ from: account });
      const receipt = await transaction;
      console.log('Claim reward transaction receipt:',receipt);
      loadAccountBalance();
      calculateReward();
    } catch (error) {
      console.error('Failed to claim reward:', error);
    }
  };

  return (
    <div>
      <h1>Staking App</h1>
      <p>Account: {account}</p>
      <p>Account Balance: {accountBalance} ETH</p>
      <p>Total Staked: {totalStakedETH} ETH</p>
      <p>Pending Reward: {pendingReward} ETH</p>
      <button onClick={connectWallet}>Connect Wallet</button>
      <div>
        <h2>Stake</h2>
        <input
          type="text"
          placeholder="Amount to stake"
          value={stakeAmount}
          onChange={(e) => setStakeAmount(e.target.value)}
        />
        <button onClick={handleStake}>Stake</button>
      </div>
      <div>
        <h2>Unstake</h2>
        <input
          type="text"
          placeholder="Amount to unstake"
          value={unstakeAmount}
          onChange={(e) => setUnstakeAmount(e.target.value)}
        />
        <button onClick={handleUnstake}>Unstake</button>
      </div>
      <div>
        <h2>Reward</h2>
        <button onClick={calculateReward}>Calculate Reward</button>
        <button onClick={claimReward}>Claim Reward</button>
      </div>
    </div>
  );
};

export default App;