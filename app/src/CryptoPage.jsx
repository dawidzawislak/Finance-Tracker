import CryptoTable from './components/CryptoTable.jsx'
import CryptoSummary from './components/CryptoSummary.jsx'
import React from 'react'

function CryptoPage() {
    const [entries, setEntries] = React.useState([])
    const [currVal, setCurrVal] = React.useState(0)

    React.useEffect(() => {
        fetch('http://localhost:8000/history-kryptowaluty-btc').then(response => response.json()).then(data => {
            setEntries(data)
        })
    }, [])

    React.useEffect(() => {
        fetch('http://localhost:8000/structure').then(response => response.json()).then(structure => {
            if (structure.kryptowaluty !== currVal) {
                structure.kryptowaluty = currVal
                fetch('http://localhost:8000/update-structure', {
                    method: 'POST',
                    body: JSON.stringify(structure),
                    headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    }
                })
            }
        })
    }, [currVal])

    return (
        <main className="content">
            <h1 className="heading-primary">Kryptowaluty</h1>
            <h2 className='heading-secondary'>Bitcoin</h2>
            <div className="flex" style={{marginBottom: '50px'}}>
                <CryptoTable data={entries} updateData={setEntries}/>
                <CryptoSummary data={entries} updateVal={setCurrVal} />
            </div>
        </main>
    )
}

export default CryptoPage