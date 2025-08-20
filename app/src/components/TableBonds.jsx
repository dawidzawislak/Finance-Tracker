import React from "react"
import EditEntryModal from "./EditEntryModal.jsx"
import '../style/Table.css'
import editIcon from '../assets/edit-icon.png'
import { getBondValue } from "../utils"

function TableBonds({ name, wallet, setWallet, inflation }) {
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
    console.log(inflation)

    const today = new Date();

    const rows = wallet.bond[name].entries.map((val, i) => {
        const start = new Date(val.date);
        const interestRates = []
        console.log(val)
        interestRates.push(<td key={1}>{val["int1"] + "%"}</td>)
        for (let i = 2; i <= 10; i++) {
            if (start.getFullYear() + i - 1 < today.getFullYear() || (start.getFullYear() + i - 1 == today.getFullYear() && (start.getMonth() - 1 < 0
            ? start.getMonth() + 11
            : start.getMonth() - 1) <= today.getMonth())) {
            console.log(start.getFullYear() + i - 1, start.getMonth() - 1 < 0
            ? start.getMonth() + 11
            : start.getMonth() - 1)
            const int = val["margin"] +
            inflation[start.getFullYear() + i - 1][
              start.getMonth() - 1 < 0
                ? start.getMonth() + 11
                : start.getMonth() - 1
            ] - 100
            interestRates.push(int ? <td key={i}>{int.toFixed(2) + "%"}</td> : <td key={i}></td>)
        } else {
            interestRates.push(<td key={i}></td>)
        }
        }

        const currValue = getBondValue(val, new Date().toISOString().split("T")[0], inflation)
        cumulated += currValue

        return (
            <tr key={i}>
                <td>{val.date}</td>
                <td>{val.count}</td>
                {interestRates}
                <td>{currValue.toLocaleString("pl-PL")} PLN</td>
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