import "../style/Table.css"
import EditEntryModal from "./EditEntryModal.jsx"
import editIcon from '../assets/edit-icon.png'
import React from "react"
import { round } from "../utils"

function ETFTable({index, exchangeRates, wallet, setWallet, price}) {
    const [showModal, setModalVisibility] = React.useState(false)
    const [idToChange, setIdToChange] = React.useState(-1)

    const etfData = wallet['etf'][index]['entries']

    function handleClick(key) {
        setModalVisibility(true)
        setIdToChange(key)
    }

    const currPrice = price['etf'][index]['value']*exchangeRates[price['etf'][index]['curr']]

    const rows = etfData.map((entry, i) => {
        return(
            <tr key={i}>
                <td>{entry.date}</td>
                <td>{entry.price.toLocaleString('pl-PL')}</td>
                <td>{entry.count}</td>
                <td>{entry.unitPrice.toLocaleString('pl-PL')}</td>
                {price['etf'][index]['curr'] != 'PLN' && <td>{round(entry.price / (entry.count * entry.unitPrice)).toLocaleString('pl-PL')}</td>}
                <td>{entry.fee.toLocaleString('pl-PL')}</td>
                <td>{round(entry.count*currPrice).toLocaleString('pl-PL')}</td>
                <td><button onClick={() => handleClick(i)} className='btn-edit'>
                    <img src={editIcon} alt="edit-icon" width={14} />
                </button></td>
            </tr>
        )
    })

    return (
        <>
        <div style={{width: '60%'}}>
        <table className="table" >
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Price [PLN]</th>
                    <th>Count</th>
                    <th>Unit price [{price['etf'][index]['curr']}]</th>
                    {price['etf'][index]['curr'] != 'PLN' && <th>Exchange rate</th>}
                    <th>Fee [PLN]</th>
                    <th>Value [PLN]</th>
                    <th>Edit</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
        </div>
        {showModal && <EditEntryModal closeModal={() => setModalVisibility(false)} wallet={wallet} setWallet={setWallet} category={'etf'} name={index} idToChange={idToChange} /> }
        </>
    )
}

export default ETFTable