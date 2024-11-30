import React from "react"
import tickIcon from '../assets/tick-icon.png'
import crossIcon from '../assets/cross-icon.png'
import binIcon from '../assets/bin-icon.png'

const PROPS_NAMES = {
    'date': 'Date',
    'count': 'Count',
    'price': 'Price',
    'int1': 'Interest rate 1',
    'int2': 'Interest rate 2',
    'int3': 'Interest rate 3',
    'int4': 'Interest rate 4',
    'int5': 'Interest rate 5',
    'int6': 'Interest rate 6',
    'int7': 'Interest rate 7',
    'int8': 'Interest rate 8',
    'int9': 'Interest rate 9',
    'int10': 'Interest rate 10',
    'unitPrice': 'Unit price',
    'feeBTC': 'Fee in BTC',
    'exchangeRate': 'Exchange rate',
    'fee': 'Fee'
}

function EditEntryModal({ closeModal, wallet, category, name, idToChange, setWallet }) {
    const [toEdit, setToEdit] = React.useState(wallet[category][name].entries[idToChange])

    function handleSubmit(event) {
        event.preventDefault();

        const _wallet = { ...wallet }

        _wallet[category][name]['entries'][idToChange] = toEdit

        setWallet(_wallet)

        fetch('http://localhost:8000/change_wallet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(_wallet)
        }).then(response => {
            if (response.ok) {
                alert('Updated successfully')
            } else {
                alert('Failed to update')
            }
        })
    }

    function handleInput(event) {
        setToEdit(prev => ({
            ...prev,
            [event.target.name]: (event.target.name == 'date' ? event.target.value : (event.target.value == '' ? null : Number(event.target.value)))
        }))
        if (category == 'bond' && event.target.name === "count") {
            setToEdit(prev => ({
                ...prev,
                'price': event.target.value * 100
            }))
        }
    }

    React.useEffect(() => {
        const dial = document.getElementById("modal")
        dial.showModal()

        return () => {
            dial.close()
        }
    }, [])

    function handleDelete(event) {
        event.preventDefault();

        let _wallet = {...wallet}

        _wallet[category][name]['entries'].splice(idToChange, 1);

        setWallet(_wallet)

        fetch('http://localhost:8000/change_wallet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(_wallet)
        }).then(response => {
            if (response.ok) {
                alert('Deleted successfully')
            } else {
                alert('Failed to update')
            }
        })

        closeModal()
    }

    const inputs = Object.keys(toEdit).filter(key => key in PROPS_NAMES).map((key, i) => {
        if (key == 'price' && category == 'bond') return;
        return (
            <div className="modal-entry">
                <label>
                    {PROPS_NAMES[key]}: <br></br>
                    <input type={key == 'date' ? 'date' : 'number'} name={key} value={toEdit[key] != null ? toEdit[key] : ''} onChange={handleInput}></input><br></br>
                </label>
            </div>
        )
    })

    return (
        <dialog id="modal">
            <form>
                <div className="controls">
                    <button onClick={handleDelete} className="modal-btn modal-btn-bin">
                        <img src={binIcon} alt="binIcon" width={18} />
                    </button>
                    <button onClick={closeModal} className="modal-btn modal-btn-cross">
                        <img src={crossIcon} alt="crossIcon" width={18} />
                    </button>
                    <button onClick={handleSubmit} className="modal-btn modal-btn-tick">
                        <img src={tickIcon} alt="tickIcon" width={18} />
                    </button>
                </div>
                {inputs}
            </form>
        </dialog>
    )
}

export default EditEntryModal