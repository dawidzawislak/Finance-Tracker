import "../style/Table.css"

function CashTable({ wallet, curr, ike }) {
    const cashData = wallet['currency'][curr].entries.filter(entry => entry.ike === ike)

    if (cashData.length === 0) return null;

    const rows = cashData.map((entry, i) => 
      <tr key={i}>
          <td>{entry.date}</td>
          <td>{entry.count.toLocaleString('pl-PL')}</td>
      </tr>
    )

    return (
        <>
            <div style={{ width: "90%", marginBottom: "3rem" }}>
              <h3 className='heading-tetriary'>{curr.toUpperCase()}</h3>
                <table className="table" >
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default CashTable