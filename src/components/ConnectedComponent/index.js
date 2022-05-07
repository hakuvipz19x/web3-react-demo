import { useState } from 'react'

import './ConnectedComponent.scss'

function ConnectedComponent({ account, accountBalance, wethBalance, network, deposit, withdraw }) {

    const [depositInput, setDepositInput] = useState('')
    const [withdrawInput, setWithdrawInput] = useState('')
    // console.log(input)
    return (
        <div className="connected">
            Account: <span className="connected__account">{account}</span> <br/>
            ETH balance: {accountBalance} ETH<br/>
            WETH balance: {wethBalance} WETH<br/>
            network: {network === undefined ? '' : network.name}

            <div className="connected__deposit">
                <input type="text" className="connected__deposit-input mt-20" placeholder='input amount here'
                    value={depositInput}
                    onChange={(e) => setDepositInput(e.target.value)}
                />
                <button className="connected__deposit-btn mt-20" onClick={() => deposit(depositInput)}>Deposit ETH</button>
            </div>

            <div className="connected__withdraw">
                <input type="text" className="connected__withdraw-input" placeholder='input amount here'
                    value={withdrawInput}
                    onChange={(e) => setWithdrawInput(e.target.value)}
                />
                <button className="connected__withdraw-btn mt-20" onClick={() => withdraw(withdrawInput)}>Withdraw ETH</button>
            </div>
        </div>
    )
}

export default ConnectedComponent