import logo from './logo.svg';
import './App.scss';
import { useEffect, useState } from 'react';
import Web3 from 'web3'
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import ERC20 from './ERC20.json'

import ConnectedComponent from './components/ConnectedComponent';
const INFURA_KEY = 'bb6b6f6f39434b1da5b19f5853dfd502';
const WALLETCONNECT_BRIDGE_URL = "https://bridge.walletconnect.org";

const NETWORk_URLS = {
  1: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  4: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
  5: `https://goerli.infura.io/v3/${INFURA_KEY}`,
  42: `https://kovan.infura.io/v3/${INFURA_KEY}`
}

const injected = new InjectedConnector({
  supportedChainIds: [1, 4, 5, 42]
})

const walletConnectConnector = new WalletConnectConnector({
  supportedChainIds: [1, 4, 5, 42],
  rpc: NETWORk_URLS,
  bridge: WALLETCONNECT_BRIDGE_URL,
  qrcode: true
})

function App() {
  const { account, chainId, connector, activate, library } = useWeb3React();

  // console.log(library.network.name)

  console.log('CHAINID: ', chainId)
  const [accountBalance, setAccountBalance] = useState()
  const [wethBalance, setWethBalance] = useState()
  const connectInjectedConnector = () => {
    activate(injected);
  }

  const connectWalletConnectConnector = () => {
    activate(walletConnectConnector, undefined, true).catch((e) => console.log(e))
  }

  const getAccountBalance = async () => {
    const web3 = new Web3(library.provider)

    const accBalance = await web3.eth.getBalance(account)
    // console.log(accBalance)
    setAccountBalance(web3.utils.fromWei(accBalance))
  }


  const getWethBalance = async () => {
    const web3 = new Web3(library.provider)
    const wethContract = new web3.eth.Contract(ERC20, '0xc778417E063141139Fce010982780140Aa0cD5Ab');

    const weBalance = await wethContract.methods.balanceOf(account).call()
    setWethBalance(web3.utils.fromWei(weBalance))
  }

  const getStateInfo = async () => {
    await getAccountBalance()
    await getWethBalance();
  }

  const withdraw = async (input) => {
    if (account && chainId && library) {
      const web3 = new Web3(library.provider)

      const wethContract = new web3.eth.Contract(ERC20, '0xc778417E063141139Fce010982780140Aa0cD5Ab');
      await wethContract.methods.withdraw(input).send({ from: account })

      getStateInfo();
      console.log('WITHDRAW SUCCESS')
    }
  }

  const deposit = async (input) => {
    const web3 = new Web3(library.provider)
    const wethContract = new web3.eth.Contract(ERC20, '0xc778417E063141139Fce010982780140Aa0cD5Ab');
    await wethContract.methods.deposit().send({ value: web3.utils.toWei(input), from: account })

    getStateInfo();
    console.log('DEPOSIT SUCCESS')
  }

  useEffect(() => {
    if (account) {
      getStateInfo();
    }
  }, [account])

  return (
    <div className="App">
      {
        account ?
          <>
            <ConnectedComponent
              account={account}
              accountBalance={accountBalance}
              wethBalance={wethBalance}
              network={library.network}
              deposit={deposit}
              withdraw={withdraw}
            />
            {/* <h1>Account: {account}</h1>
            <h2>Balance: {balance}</h2>
            <button onClick={deposit}>Deposit</button> */}
          </> :
          <>
            <button onClick={connectInjectedConnector}>Connect with Metamask</button>
            <button onClick={connectWalletConnectConnector}>Connect with WalletConnect</button>
          </>
      }


    </div>
  );
}

export default App;
