import React from "react"
import tickIcon from '../assets/tick-icon.png'
import crossIcon from '../assets/cross-icon.png'
import binIcon from '../assets/bin-icon.png'

function EditBondEntryModal(props) {
    const {updateBondsData, toEdit, closeModal, bonds, years, idToChange, setToEdit} = props

    const interestRates = []
    for (let i = 1; i <= years; i++) {
        interestRates.push(
            <label key={i}>
                Opr. {i}: <br />
                <input type="number" step="0.01" onChange={handleInput} name={'opr'+i} value={toEdit['opr'+i]}/>   <br /> <br />
            </label>
        )
    }

    function handleSubmit(event) {
        event.preventDefault();
        
        const updated = bonds.map((entry, i) => {
            return i === idToChange ? toEdit : entry
        })

        updateBondsData(updated)

        closeModal()
    }

    function handleDelete(event) {
        event.preventDefault();

        const updated = bonds.filter((_, id) => id != idToChange)

        updateBondsData(updated)

        closeModal()
    }

    function handleInput(event) {
        setToEdit(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }))
        
        if (event.target.name === "zakup") {
            let buyOutDate = new Date(event.target.value)
            buyOutDate.setFullYear(buyOutDate.getFullYear() + years)

            setToEdit(prev => ({
                ...prev,
                'wykup': buyOutDate.toISOString().substring(0, 10)
            }))
        }

        if (event.target.name === "ilosc") {
            setToEdit(prev => ({
                ...prev,
                'wartoscPocz': event.target.value*100
            }))
        }

    }

    React.useEffect(() =>{
        const dial = document.getElementById("modal")
        dial.showModal()

        return () =>{
            dial.close()
        }
    }, [])

    return (
        <dialog id="modal">
            <form>
                <label>
                    Data zakupu: <br />
                    <input type="date" onChange={handleInput} name="zakup" value={toEdit.zakup}/>  <br /><br />
                </label>
                <label>
                    Ilość: <br />
                    <input type="number" onChange={handleInput} name="ilosc" value={toEdit.ilosc}/>             <br /> <br />
                </label>
                {interestRates}
                <div className="controls">
                <button onClick={handleDelete} className="modal-btn modal-btn-bin">
                    <img src={binIcon} alt="binIcon" width={18}/>
                    </button>
                    <button onClick={closeModal} className="modal-btn modal-btn-cross">
                        <img src={crossIcon} alt="crossIcon" width={18}/>
                    </button>
                    <button onClick={handleSubmit} className="modal-btn modal-btn-tick">
                        <img src={tickIcon} alt="tickIcon" width={18}/>
                    </button>
                </div>
            </form>
        </dialog>
    )
}

export default EditBondEntryModal