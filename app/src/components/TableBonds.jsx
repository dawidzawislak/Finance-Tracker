import React from "react"
import EditEntryModal from "./EditEntryModal.jsx"
import '../style/Table.css'
import editIcon from '../assets/edit-icon.png'
import { getBondValue } from "../utils"

function TableBonds({ name, wallet, setWallet }) {
    const [showModal, setModalVisibility] = React.useState(false)
    const [idToChange, setIdToChange] = React.useState(-1)

    function handleClick(key) {
        setModalVisibility(true)
        setIdToChange(key)
    }

    const interestRatesHeaders = []
    for (let i = 1; i <= 10; i++) {
        interestRatesHeaders.push(<th key={i}>Int. {i}</th>)
    }

    let cumulated = 0

    const rows = wallet.bond[name].entries.map((val, i) => {
        const interestRates = []
        for (let i = 1; i <= 10; i++) {
            interestRates.push(<td key={i}>{val[`int${i}`]} {val[`int${i}`] ? "%" : ""}</td>)
        }

        const currValue = getBondValue(val, new Date().toISOString().split("T")[0])
        cumulated += currValue

        return (
            <tr key={i}>
                <td>{val.date}</td>
                <td>{val.count}</td>
                {interestRates}
                <td>{getBondValue(val, new Date().toISOString().split("T")[0]).toLocaleString("pl-PL")} PLN</td>
                <td><button onClick={() => handleClick(i)} className='btn-edit'>
                    <img src={editIcon} alt="edit-icon" width={14} />
                </button></td>
            </tr>
        )
    })

    return (
        <>
            <table className="table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Count</th>
                        {interestRatesHeaders}
                        <th>Current value</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
            <br />
            <h2 className="heading-tetriary">Overall value: {cumulated.toLocaleString("pl-PL")} PLN</h2>

            {showModal && <EditEntryModal idToChange={idToChange} name="edo10" category="bond" closeModal={() => setModalVisibility(false)} wallet={wallet} setWallet={setWallet} />}
        </>
    )
}

export default TableBonds