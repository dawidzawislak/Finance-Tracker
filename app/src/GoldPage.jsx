import GoldTable from './components/GoldTable.jsx'
import GoldSummary from './components/GoldSummary.jsx'
import BuyGold from './components/BuyGold.jsx'

function GoldPage({ wallet, setWallet, price }) {
    return (
        <main className="content">
            <h1 className="heading-primary">Commodities</h1>
            <BuyGold wallet={wallet} setWallet={setWallet} />
            <h2 className='heading-secondary'>Gold</h2>
            <div className="flex" style={{ marginBottom: '50px' }}>
                <GoldTable wallet={wallet} setWallet={setWallet} />
                <GoldSummary wallet={wallet} price={price} />
            </div>
        </main>
    )
}

export default GoldPage