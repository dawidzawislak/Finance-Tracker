import React from "react"
import { round } from "../utils"

function GoldSummary({wallet, price}) {
    const goldData = wallet['commodity']['gold']['entries']

    const mass = goldData.reduce((acc, entry) => acc + entry.count, 0)
    const priceAll = goldData.reduce((acc, entry) => acc + (entry.unitPrice * entry.count), 0)
    const avgPrice = round(priceAll/mass)
    const currPrice = round(price['commodity']['gold']['value'] * 1.049)

    const currValue = currPrice * mass

    let deltaStyle = {}

    let delta = Math.round((currValue/priceAll - 1)*10000)/100;
    if (currValue > priceAll) {
        delta = '+' + delta
        deltaStyle.color = 'green';
    } else {
        deltaStyle.color = 'red';
    }

    return (
        <div className="etf-summary">
            <h3 className="heading-tetriary">Avg. purchase price/1oz.: {avgPrice} PLN </h3>
            <br />
            <h3 className="heading-tetriary">Quantity held: {mass} oz.</h3>
            <h3 className="heading-tetriary">Price: {priceAll} PLN</h3>
            <br />
            <h3 className="heading-tetriary">Current price/1oz:  {currPrice} PLN</h3>
            <h3 className="heading-tetriary">Current value: <span style={deltaStyle}>{currValue} zł ({delta}%)</span></h3>
        </div>
    )
}

export default GoldSummary