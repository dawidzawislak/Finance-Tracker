import { round, getDeltaStyle } from "../utils.js"

function CryptoSummary({ wallet, price }) {
    const btcPrice = price['crypto']['btc']['value']

    const btcData = wallet.crypto.btc['entries'];
    const count = btcData.reduce((acc, entry) => acc + Number(entry.count), 0)
    const priceAll = btcData.reduce((acc, entry) => acc + Number(entry.price), 0)
    const avgPrice = round(priceAll / count)
    const currValue = round(count * btcPrice)

    let [delta, deltaStyle] = getDeltaStyle(currValue, priceAll);

    return (
        <div className="summary">
            <h3 className="heading-tetriary">Avg purchase BTC price: {round(avgPrice).toLocaleString('pl-PL')} PLN</h3>
            <br />
            <h3 className="heading-tetriary">Quantity held: {count} BTC</h3>
            <h3 className="heading-tetriary">Price: {round(priceAll).toLocaleString('pl-PL')} PLN</h3>
            <br />
            <h3 className="heading-tetriary">Current BTC price:  {round(btcPrice).toLocaleString('pl-PL')} PLN</h3>
            <h3 className="heading-tetriary">Current value of bought BTC: <span style={deltaStyle}>{currValue.toLocaleString('pl-PL')} PLN ({delta}%)</span></h3>
        </div>
    )
}

export default CryptoSummary