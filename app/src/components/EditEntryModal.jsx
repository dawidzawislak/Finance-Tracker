import React from "react"
import tickIcon from '../assets/tick-icon.png'
import crossIcon from '../assets/cross-icon.png'
import binIcon from '../assets/bin-icon.png'

function EditEntryModal(props) {
    const {toEditID, setToEdit, toEdit, closeModal, updateData, description, data} = props

    const inputs = description.map(({desc, name, type}, i) => {
        return(
        <label key={i}>
            {desc}: <br />
            <input type={type} onChange={handleInput} name={name} value={toEdit[name]}/>  <br /><br />
        </label>
    )})

    function handleInput(event) {
        setToEdit(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }))
    }

    function handleSubmit(event) {
        event.preventDefault();
        
        const updated = data.map((entry, i) => {
            return i === toEditID ? toEdit : entry
        })

        updateData(updated)

        closeModal()
    }

    function handleDelete(event) {
        event.preventDefault();

        const updated = props.data.filter((_, id) => id != toEditID)

        updateData(updated)

        closeModal()
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
                {inputs}
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

export default EditEntryModal