import { useState, useEffect } from "react";
import EditCash from "./components/EditCash";
import CashTable from "./components/CashTable";
import CashSummary from "./components/CashSummary";

function CurrenciesPage({ wallet, setWallet }) {
    const [available, setAvailable] = useState([])

    useEffect(() => {
        fetch('http://localhost:8000/available/currency').then(response => response.json()).then(currs => {
            setAvailable(currs)
        })
    }, [])

    const IKE = available.map(curr => <CashTable key={curr} wallet={wallet} ike={true} curr={curr} />)
    const others = available.map(curr => <CashTable key={curr} wallet={wallet} ike={false} curr={curr} />)

    return (
        <main className="content">
            <h1 className="heading-primary">Currencies</h1>
            <EditCash wallet={wallet} setWallet={setWallet}/>
            <hr />
            <h2 className='heading-secondary'>IKE</h2>
            <div className="flex">
                <div style={{width: "100%"}}>{IKE}</div>
                <CashSummary wallet={wallet} ike={true} available={available} />
            </div>
            <hr />
            <h2 className='heading-secondary'>Others</h2>
            <div className="flex">
                <div style={{width: "100%"}}>{others}</div>
                <CashSummary wallet={wallet} ike={false} available={available} />
            </div>
        </main>
    )
}

export default CurrenciesPage