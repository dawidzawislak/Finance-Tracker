import '../style/Table.css'
import React from 'react'
import editIcon from '../assets/edit-icon.png'
import EditEntryModal from './EditEntryModal.jsx'

function GoldTable({ wallet, setWallet }) {
    const [showModal, setModalVisibility] = React.useState(false)
    const [idToChange, setIdToChange] = React.useState(-1)

    function handleClick(key) {
        setModalVisibility(true)
        setIdToChange(key)
    }

    const rows = wallet['commodity']['gold']['entries'].map((entry, i) => {
        return (
            <tr key={i}>
                <td>{entry.date}</td>
                <td>{entry.count * entry.unitPrice}</td>
                <td>{entry.count}</td>
                <td>{entry.unitPrice.toLocaleString('pl-PL')}</td>
                <td><button onClick={() => handleClick(i)} className='btn-edit'>
                    <img src={editIcon} alt="edit-icon" width={14} />
                </button></td>
            </tr>
        )
    })

    return (
        <>
            <div style={{ width: '60%' }}>
                <table className="table" >
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Price [PLN]</th>
                            <th>Count [oz.]</th>
                            <th>Price / oz. [PLN]</th>
                            <th>Edytuj</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
            {showModal && <EditEntryModal closeModal={() => setModalVisibility(false)} wallet={wallet} setWallet={setWallet} category='commodity' name='gold' idToChange={idToChange} />}
        </>
    )
}

export default GoldTable