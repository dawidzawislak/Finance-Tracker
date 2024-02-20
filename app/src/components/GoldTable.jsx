import '../style/Table.css'
import React from 'react'
import editIcon from '../assets/edit-icon.png'
import EditEntryModal from './EditEntryModal.jsx'

function GoldTable(props) {
    const [formData, setFormData] = React.useState({
        zakup: '',
        masa: '',
        cenaOZ: ''
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
        fetch('http://localhost:8000/update-zloto', {
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

        const updated = [...props.data, formData]

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
            desc: 'Masa [oz]',
            name: 'masa',
            type:"number"
        },
        {
            desc: 'Cena za 1 oz [PLN]',
            name: 'cenaOZ',
            type:"number"
        }
    ]

    const form = description.map((obj, i) => (
        <td key={i}><input className="input-fill" type={obj.type} name={obj.name} value={formData[obj.name]} onChange={handleChange} required /></td>
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
        <table className="table" >
            <thead>
                <tr>
                    {header}
                    <th>Edytuj</th>
                </tr>
            </thead>
            <tbody>
                {rows}
                <tr className="no-border-td">
                    {form}
                    <td><button onClick={addEntry} className="btn-add">+</button></td>
                </tr>
            </tbody>
        </table>
        </div>
        {showModal && <EditEntryModal data={props.data} description={description} toEditID={idToChange} updateData={updateData} setToEdit={setToEdit} closeModal={() => setModalVisibility(false)} toEdit={toEdit} /> }
        </>
    )
}

export default GoldTable