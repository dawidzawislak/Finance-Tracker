import React from 'react'
import TableBonds from './components/TableBonds.jsx'

function BondsPage() {

    const [bonds10, setBonds10Value] = React.useState(0)
    const [bonds4, setBonds4Value] = React.useState(0)

    React.useEffect(() => {
        fetch('http://localhost:8000/structure').then(response => response.json()).then(structure => {
            if (structure.obligacje !== bonds10 + bonds4) {
                structure.obligacje = bonds10 + bonds4
                fetch('http://localhost:8000/update-structure', {
                    method: 'POST',
                    body: JSON.stringify(structure),
                    headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    }
                })
            }
        })
    }, [bonds10, bonds4])

    return (
        <main className="content">
            <h1 className="heading-primary">Obligacje skarbowe</h1>
            <h2 className='heading-secondary'>EDO10</h2>
            <TableBonds type={10} updateValue={setBonds10Value}/>
            <h2 className='heading-secondary' style={{marginTop: '40px'}}>COI4</h2>
            <TableBonds type={4} updateValue={setBonds4Value}/>
        </main>
    )
}

export default BondsPage