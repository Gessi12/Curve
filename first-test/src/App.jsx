import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './App.css'; // 导入自定义的 CSS 文件

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [balance, setBalance] = useState('');

  useEffect(() => {
    checkMetaMaskConnection();
  }, []);

  const checkMetaMaskConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setIsConnected(true);
          setAccounts(accounts);
          setSelectedAccount(accounts[0]);
          subscribeToAccountChanges();
          getAccountBalance(accounts[0]);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('MetaMask not found');
    }
  };

  const connectToMetaMask = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setIsConnected(true);
      setAccounts(accounts);
      setSelectedAccount(accounts[0]);
      subscribeToAccountChanges();
      getAccountBalance(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const subscribeToAccountChanges = () => {
    window.ethereum.on('accountsChanged', (newAccounts) => {
      setAccounts(newAccounts);
      setSelectedAccount(newAccounts[0]);
      getAccountBalance(newAccounts[0]);
    });
  };

  const getAccountBalance = async (account) => {
    const web3 = new Web3(window.ethereum);
    const balance = await web3.eth.getBalance(account);
    setBalance(web3.utils.fromWei(balance, 'ether'));
  };

  const handleAccountChange = (event) => {
    setSelectedAccount(event.target.value);
    getAccountBalance(event.target.value);
  };

  return (
    <div className="container">
      <h1 className="title">MetaMask Connection Example</h1>
      {isConnected ? (
        <div>
          <p className="info">Connected with MetaMask!</p>
          <p className="info">Selected Account: {selectedAccount}</p>
          <p className="info">ETH Balance: {balance} ETH</p>
          <select
            className="account-select"
            value={selectedAccount}
            onChange={handleAccountChange}
          >
            {accounts.map((account) => (
              <option key={account} value={account}>
                {account}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <button className="connect-btn" onClick={connectToMetaMask}>
          Connect Wallet
        </button>
      )}
    </div>
  );
}

export default App;