import React from "react"

function GoldSummary(props) {
    const mass = props.data.reduce((acc, entry) => acc + Number(entry.masa), 0)
    const priceAll = props.data.reduce((acc, entry) => acc + (Number(entry.cenaOZ) * Number(entry.masa)), 0)
    const avgPrice = Math.round(priceAll*100/mass)/100
    const [currPriceSPOT, setCurrPriceSPOT] = React.useState(0)
    const currPrice = Math.round(currPriceSPOT * 1.049 * 100) / 100

    React.useEffect(() => {
        fetch('http://localhost:8000/xaupln').then(response => response.json()).then(data => {
            setCurrPriceSPOT(Number(data.value))
        })
    }, [])

    const currValue = currPrice * mass

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
            <h3 className="heading-tetriary">Średnia cena zakupu za 1oz: {avgPrice} PLN </h3>
            <br />
            <h3 className="heading-tetriary">Posiadana ilość: {mass} oz</h3>
            <h3 className="heading-tetriary">Cena: {priceAll} PLN</h3>
            <br />
            <h3 className="heading-tetriary">Aktualna cena złota / 1oz (spot):  {currPriceSPOT} PLN</h3>
            <h3 className="heading-tetriary">Aktualna cena złota / 1oz (zakup):  {currPrice} PLN</h3>
            <h3 className="heading-tetriary">Aktualna wartość kupionego złota: <span style={deltaStyle}>{currValue} zł ({delta}%)</span></h3>
        </div>
    )
}

export default GoldSummary