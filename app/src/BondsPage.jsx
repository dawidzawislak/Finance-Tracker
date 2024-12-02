import TableBonds from './components/TableBonds.jsx'
import BuyBonds from './components/BuyBonds.jsx'

function BondsPage({ wallet, setWallet }) {
    return (
        <main className="content">
            <h1 className="heading-primary">Bonds</h1>
            <BuyBonds wallet={wallet} setWallet={setWallet} />
            <h2 className='heading-secondary'>EDO10</h2>
            <TableBonds wallet={wallet} name="edo10" setWallet={setWallet} />
        </main>
    )
}

export default BondsPage