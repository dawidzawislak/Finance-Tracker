function CashSummary({ wallet, ike, available }) {
    const cashData = wallet.currency;
    const currencies = available.map(curr => <>
      <h3 className="heading-tetriary">{curr.toUpperCase()}: {cashData[curr].entries.filter(entry => entry.ike === ike).reduce((acc, entry) => acc + entry.count, 0)}</h3>
    </>)

    return (
        <div className="summary" style={{marginBottom: "4rem"}}>
            <h2 className="heading-secondary">{ike ? "IKE" : "Others"}</h2>
            <br />
            {currencies}
        </div>
    )
}

export default CashSummary