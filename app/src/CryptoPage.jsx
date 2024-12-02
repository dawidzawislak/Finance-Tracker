import CryptoTable from './components/CryptoTable.jsx'
import CryptoSummary from './components/CryptoSummary.jsx'
import BuyCrypto from './components/BuyCrypto.jsx'

function CryptoPage({ wallet, setWallet, price }) {
    return (
        <main className="content">
            <h1 className="heading-primary">Cryptocurrencies</h1>
            <BuyCrypto wallet={wallet} setWallet={setWallet} />
            <h2 className='heading-secondary'>Bitcoin</h2>
            <div className="flex" style={{ marginBottom: '50px' }}>
                <CryptoTable wallet={wallet} setWallet={setWallet} />
                <CryptoSummary wallet={wallet} price={price} />
            </div>
        </main>
    )
}

export default CryptoPage