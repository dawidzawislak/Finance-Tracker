import GoldTable from './components/GoldTable.jsx'
import GoldSummary from './components/GoldSummary.jsx'
import BuyGold from './components/BuyGold.jsx'
import React from 'react'

function GoldPage({wallet, setWallet, price}) {
    return (
        <main className="content">
            <h1 className="heading-primary">Gold</h1>
            <BuyGold wallet={wallet} setWallet={setWallet}/>
            <div className="flex" style={{marginBottom: '50px'}}>
                <GoldTable wallet={wallet} setWallet={setWallet}/>
                <GoldSummary wallet={wallet} price={price} />
            </div>
        </main>
    )
}

export default GoldPage