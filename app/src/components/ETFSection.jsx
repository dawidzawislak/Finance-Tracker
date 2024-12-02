import ETFSummary from "./ETFSummary.jsx"
import ETFTable from './ETFTable.jsx'

function ETFSection({ wallet, setWallet, exchangeRates, index, price }) {
    return (
        <>
            <h2 className='heading-secondary'>{index.toUpperCase()}</h2>
            <div className="flex" style={{ marginBottom: '50px' }}>
                <ETFTable index={index} exchangeRates={exchangeRates} wallet={wallet} setWallet={setWallet} price={price} />
                <ETFSummary index={index} exchangeRates={exchangeRates} wallet={wallet} setWallet={setWallet} price={price} />
            </div>
        </>
    )
}

export default ETFSection