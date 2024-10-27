import '../style/Table.css'
import EditEntryModal from './EditEntryModal.jsx'
import editIcon from '../assets/edit-icon.png'
import React from 'react'

function CryptoTable(props) {
    const [formData, setFormData] = React.useState({
        zakup: '',
        kwota: '',
        iloscpro: '',
        prowizjabtc: ''
    })

    const [toEdit, setToEdit] = React.useState({})
    const [showModal, setModalVisibility] = React.useState(false)
    const [idToChange, setIdToChange] = React.useState(-1)

    function handleChange(event) {
        setFormData(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }))
    }

    function updateData(newData) {
        fetch('http://localhost:8000/update-kryptowaluty-btc', {
            method: 'POST',
            body: JSON.stringify(newData),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        })

        props.updateData(newData)
    }

    function addEntry(event) {
        event.preventDefault();

        const updated = [...props.data, {
            ...formData,
            'kurs':  Math.round(Number(formData.kwota/formData.iloscpro)*100)/100,
            'ilosc': formData.iloscpro-formData.prowizjabtc,
            'prowizjapln': Math.round(Number(formData.prowizjabtc) * Number(formData.kwota/formData.iloscpro)*100)/100
        }]

        updateData(updated)
    }

    function handleClick(key) {
        setToEdit(props.data[key])
        setModalVisibility(true)
        setIdToChange(key)
    }

    const description = [
        {
            desc: 'Data zakupu',
            name: 'zakup',
            type:"date"
        },
        {
            desc: 'Kwota [PLN]',
            name: 'kwota',
            type:"number"
        },
        {
            desc: 'Ilość BTC + prowizja [BTC]',
            name: 'iloscpro',
            type:"number"
        },
        {
            desc: 'Prowizja [BTC]',
            name: 'prowizjabtc',
            type:"number"
        },
        {
            desc: 'Kurs BTC [PLN]',
            name: 'kurs',
            type:"number"
        },
        {
            desc: 'Ilość kupionych BTC',
            name: 'ilosc',
            type:"number"
        },
        {
            desc: 'Prowizja [PLN]',
            name: 'prowizjapln',
            type:"number"
        }
    ]

    const form = description.filter((obj, i) => i < 4).map((obj, i) => (
        <input key={i} className="input-fill" type={obj.type} name={obj.name} value={formData[obj.name]} onChange={handleChange} required />
    ))

    const header = description.map((obj, i) => (
        <th key={i}>{obj.desc}</th>
    ))
    
    const rows = props.data.map((entry, i) => (
        <tr key={i}>
            {description.map((obj,j) => (<td key={j}>{entry[obj.name]}</td>))}
            <td><button onClick={() => handleClick(i)} className='btn-edit'>
                    <img src={editIcon} alt="edit-icon" width={14} />
                </button></td>
        </tr>
    ))

    return (
        <>
        <div style={{width: '60%'}}>
            <table className="table table--not-round">
            <thead>
                {header}
                <th>Edytuj</th>
            </thead>
            <tbody id="table-btc">
                {rows}
            </tbody>
            </table>
            <form className="form">
            {form}
            <button className="btn-add" onClick={addEntry}>+</button>
            </form>
        </div>
        {showModal && <EditEntryModal data={props.data} description={description} toEditID={idToChange} updateData={updateData} setToEdit={setToEdit} closeModal={() => setModalVisibility(false)} toEdit={toEdit} /> }
        </>
    )
}

export default CryptoTable