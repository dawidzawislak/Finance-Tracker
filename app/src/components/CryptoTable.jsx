import '../style/Table.css'
import EditEntryModal from './EditEntryModal.jsx'
import editIcon from '../assets/edit-icon.png'
import React from 'react'
import { round } from '../utils.js'

function CryptoTable({ wallet, setWallet }) {
    const [showModal, setModalVisibility] = React.useState(false)
    const [idToChange, setIdToChange] = React.useState(-1)

    function handleClick(key) {
        setModalVisibility(true)
        setIdToChange(key)
    }

    const rows = wallet['crypto']['btc']['entries'].map((entry, i) => {
        return (
            <tr key={i}>
                <td>{entry.date}</td>
                <td>{round(entry.price).toLocaleString('pl-PL')}</td>
                <td>{entry.count}</td>
                <td>{round(entry.price / (entry.count + entry.feeBTC)).toLocaleString('pl-PL')}</td>
                <td>{entry.feeBTC}</td>
                <td><button onClick={() => handleClick(i)} className='btn-edit'>
                    <img src={editIcon} alt="edit-icon" width={14} />
                </button></td>
            </tr>
        )
    })

    return (
        <>
            <div style={{ width: '60%' }}>
                <table className="table">
                    <thead>
                        <th>Date</th>
                        <th>Price [PLN]</th>
                        <th>Count [BTC]</th>
                        <th>BTC price</th>
                        <th>Fee [BTC]</th>
                        <th>Edit</th>
                    </thead>
                    <tbody id="table-btc">
                        {rows}
                    </tbody>
                </table>
            </div>
            {showModal && <EditEntryModal closeModal={() => setModalVisibility(false)} wallet={wallet} setWallet={setWallet} category='crypto' name='btc' idToChange={idToChange} />}
        </>
    )
}

export default CryptoTable