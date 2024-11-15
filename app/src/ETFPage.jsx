import React from 'react'
import ETFSection from './components/ETFSection.jsx'
import BuyETFs from './components/BuyETFs.jsx'

function ETFPage({wallet, setWallet, exchangeRates, price}) {
    const etfSections = Object.keys(wallet.etf).map((index) => <ETFSection wallet={wallet} setWallet={setWallet} index={index} exchangeRates={exchangeRates} price={price}/> )

    return (
        <>
        <aside className="currencies">
            <p>EUR: {exchangeRates['EUR']} zł | GBP: {exchangeRates['GBP']} zł | USD: {exchangeRates['USD']} zł</p>
        </aside>
        <main className="content">
            <h1 className="heading-primary">ETFs</h1>
            <BuyETFs wallet={wallet} setWallet={setWallet}/>
            {etfSections}
        </main>
        </>
    )
}

export default ETFPage