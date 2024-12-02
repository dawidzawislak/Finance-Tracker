import editIcon from '../assets/edit-icon.png'

function TableRowBonds(props) {
    const { elem, years } = props

    const interestRates = []
    for (let i = 1; i <= years; i++) {
        interestRates.push(<td key={i}>{elem['opr' + i]} {elem['opr' + i] && '%'}</td>)
    }

    return (
        <tr>
            <td>{elem.zakup}</td>
            <td>{elem.ilosc}</td>
            <td>{elem.wartoscPocz} zł</td>
            {interestRates}
            <td>{elem.wykup}</td>
            <td>{elem.currValue} zł</td>
            <td>
                <button onClick={props.handleClick} className='btn-edit'>
                    <img src={editIcon} alt="edit-icon" width={14} />
                </button>
            </td>
        </tr>
    )
}

export default TableRowBonds