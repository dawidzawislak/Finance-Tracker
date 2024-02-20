import GoldTable from './components/GoldTable.jsx'
import GoldSummary from './components/GoldSummary.jsx'
import React from 'react'

function GoldPage() {
    const [entries, setEntries] = React.useState([])
    const [currVal, setCurrVal] = React.useState(0)

    React.useEffect(() => {
        fetch('http://localhost:8000/history-zloto').then(response => response.json()).then(data => {
            setEntries(data)
        })
    }, [])

    React.useEffect(() => {
        fetch('http://localhost:8000/structure').then(response => response.json()).then(structure => {
            if (structure.zloto !== currVal) {
                structure.zloto = currVal
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
            <h1 className="heading-primary">Złoto</h1>
            <div className="flex" style={{marginBottom: '50px'}}>
                <GoldTable data={entries} updateData={setEntries}/>
                <GoldSummary data={entries} updateVal={setCurrVal} />
            </div>
        </main>
    )
}

export default GoldPage