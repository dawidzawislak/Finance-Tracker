import React from "react"
import TableRowBonds from './TableRowBonds.jsx'
import EditBondEntryModal from "./EditBondEntryModal.jsx"
import '../style/Table.css'

function TableBonds({type, updateValue}) {
    const [bonds, setBonds] = React.useState([])
    const [toEdit, setToEdit] = React.useState({})
    const [showModal, setModalVisibility] = React.useState(false)
    const [idToChange, setIdToChange] = React.useState(-1)
    const [toAdd, setToAdd] = React.useState({
        date: '',
        count: ''
    })
    const [refresh, setRefresh] = React.useState(0)

    React.useEffect(() => {
        fetch('http://localhost:8000/history-obligacje'+type).then(response => response.json()).then(data => {

            const updated = data.map(entry => {
                const now = new Date()
                const start = new Date(entry.zakup)
                const difference = now.getTime() - start.getTime()
                let years = Math.ceil(difference / (1000 * 3600 * 24)) / 365.25

                let currVal = entry.wartoscPocz

                let i = 1
                while (years > 1) {
                    const opr = entry[`opr${i}`] != '' ? 1 + Number(entry[`opr${i}`])/100 : 1;
                    currVal *= opr;
                    years--;
                    i++;
                }
                const opr = entry[`opr${i}`] != '' ? 1 + Number(entry[`opr${i}`])/100*years : 1;
                currVal *= opr;
                
                entry.currValue = Math.round(currVal*100)/100

                return entry
            })

            setBonds(updated)
        })
    }, [refresh])

    function handleClick(key) {
        setToEdit(bonds[key])
        setModalVisibility(true)
        setIdToChange(key)
    }

    function updateBondsData(newData) {
        fetch('http://localhost:8000/update-obligacje'+type, {
            method: 'POST',
            body: JSON.stringify(newData),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        })

        setBonds(newData)
        setRefresh(prev => prev+1)
    }

    function handleAddInput(event) {
        setToAdd(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }))
    }

    function addEntry(event) {
        event.preventDefault();

        let buyOutDate = new Date(toAdd.date)
        buyOutDate.setFullYear(buyOutDate.getFullYear() + type)

        const entryToAdd = {
            'zakup': toAdd.date, 
            'ilosc': toAdd.count, 
            'wartoscPocz': Number(toAdd.count)*100, 
            'wykup': buyOutDate.toISOString().substring(0, 10)
        }

        for (let i = 1; i <= type; i++) {
            entryToAdd['opr'+i] = ''
        }
        
        const updated = [...bonds, entryToAdd]

        updateBondsData(updated)
    }

    let overallValue = 0
    bonds.forEach(b => overallValue += b.currValue)
    overallValue = Math.round(overallValue*100)/100

    updateValue(overallValue)

    const rows = bonds.map((val, i) => <TableRowBonds years={type} key={i} elem={val} handleClick={() => handleClick(i)} />)

    const interestRatesHeaders = []
    for (let i = 1; i <= type; i++) {
        interestRatesHeaders.push(<th key={i}>Opr. {i}.</th>)
    }

    return (
        <>
        <table className="table table--not-round">
            <thead>
                <tr>
                    <th>Data zakupu</th>
                    <th>Ilość</th>
                    <th>Wartość początkowa</th>
                    {interestRatesHeaders}
                    <th>Data wykupu</th>
                    <th>Aktualna wartość</th>
                    <th>Edytuj</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
        <div className="table-footer">
            <div className="left">
                <form className="add-new">
                    <input className="date--obligacje" type="date" name="date" value={toAdd.date} onChange={handleAddInput}/>
                    <input className="count--obligacje" type="number" step="1" name="count" value={toAdd.count} onChange={handleAddInput}/>
                    <button className="btn-add" onClick={addEntry}>+</button>
                </form>
            </div>
            <div className="right">
                <div className="summary">
                Wartość łącznie: {overallValue} zł
                </div>
            </div>
        </div>

        {showModal && <EditBondEntryModal idToChange={idToChange} setToEdit={setToEdit}  years={type} updateBondsData={updateBondsData} closeModal={() => setModalVisibility(false)} toEdit={toEdit} bonds={bonds}/>}
        </>
    )
}

export default TableBonds