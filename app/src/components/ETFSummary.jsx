
function ETFSummary(props) {
    const count = props.data.reduce((acc, entry) => acc + Number(entry.ilosc), 0)
    const priceAll = props.data.reduce((acc, entry) => acc + Number(entry.cena) + Number(entry.prowizja), 0)
    const avgPricePLN = Math.round(priceAll*100/count)/100
    const avgPrice = Math.round(avgPricePLN / props.currencyRate * 100) / 100;
    const currPrice = props.price
    const currValue = props.currency !== 'PLN' ? Math.round(count * currPrice * props.currencyRate * 100)/100 : Math.round(count * currPrice * 100)/100

    let deltaStyle = {}

    let delta = Math.round((currValue/priceAll - 1)*10000)/100;
    if (currValue > priceAll) {
        delta = '+' + delta
        deltaStyle.color = 'green';
    } else {
        deltaStyle.color = 'red';
    }

    if (currPrice) props.updateVal(currValue)

    return (
        <div className="etf-summary">
            <h3 className="heading-tetriary">Średnia cena za jednostke: {avgPricePLN} PLN {props.currency !== 'PLN' && <span>/ {avgPrice} {props.currency}</span>}</h3>
            <br />
            <h3 className="heading-tetriary">Posiadana ilość: {count} jednostek</h3>
            <h3 className="heading-tetriary">Cena: {priceAll} PLN</h3>
            <br />
            <h3 className="heading-tetriary">Aktualna cena za jednostke: {props.currency !== 'PLN' && <span>{Math.round(currPrice * props.currencyRate * 100) /100} PLN / </span>}{currPrice} {props.currency}</h3>
            <h3 className="heading-tetriary">Aktualna wartość: <span style={deltaStyle}>{currValue} zł ({delta}%)</span></h3>
        </div>
    )
}

export default ETFSummary