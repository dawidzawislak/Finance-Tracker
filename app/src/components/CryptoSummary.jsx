import React from "react"

function CryptoSummary(props) {
    const [currPrice, setCurrPrice] = React.useState(0)
    const [usd, setUSD] =  React.useState(0)

    console.log(props)

    const count = props.data.reduce((acc, entry) => acc + Number(entry.iloscpro), 0)
    const priceAll = props.data.reduce((acc, entry) => acc + (Number(entry.kurs) * Number(entry.iloscpro)), 0)
    const avgPrice = Math.round(priceAll*100/count)/100
    
    
    React.useEffect(() => {
        fetch('http://localhost:8000/btcusd').then(response => response.json()).then(data => {
            setCurrPrice(Number(data.value))
        })

        fetch('https://api.nbp.pl/api/exchangerates/tables/A/?format=json').then(res => res.json()).then(data => {
            data[0].rates.forEach(rate => {
                if (rate.code === 'USD') {
                    setUSD(Math.round(Number(rate.mid)*100)/100)
                }
            })
        })
    }, [])

    const currValue = Math.round(count * currPrice * usd * 100)/100

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
            <h3 className="heading-tetriary">Średnia cena zakupu 1 BTC: {avgPrice} PLN | {Math.round(avgPrice*usd*100)/100} USD </h3>
            <br />
            <h3 className="heading-tetriary">Posiadana ilość: {count} BTC</h3>
            <h3 className="heading-tetriary">Cena: {Math.round(priceAll*100)/100} PLN</h3>
            <br />
            <h3 className="heading-tetriary">Aktualna cena 1 BTC:  {Math.round(currPrice*usd*100)/100} PLN | {Math.round(currPrice*100)/100} USD </h3>
            <h3 className="heading-tetriary">Aktualna wartość kupionego BTC: <span style={deltaStyle}>{currValue} PLN ({delta}%)</span></h3>
        </div>
    )
}

export default CryptoSummary