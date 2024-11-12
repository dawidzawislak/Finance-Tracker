import {round} from '../utils.js'

function ETFSummary({wallet, exchangeRates, index, price}) {
    const currency = price['etf'][index]['curr'];

    const etfData = wallet.etf[index].entries
    const count = etfData.reduce((acc, entry) => acc + Number(entry.count), 0)
    const priceAll = etfData.reduce((acc, entry) => acc + Number(entry.price) + Number(entry.fee), 0)
    const avgPricePLN = round(priceAll / count)
    const avgPrice = round(etfData.reduce((acc, entry) => acc + (entry.count * entry.unitPrice), 0) / count);
    const currPrice = price['etf'][index]['value']
    const currValue = round(count * currPrice * exchangeRates[currency])

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
            <h3 className="heading-tetriary">Avg. purchase unit price: {avgPricePLN.toLocaleString('pl-PL')} PLN {currency !== 'PLN' && <span>/ {avgPrice.toLocaleString('pl-PL')} {currency}</span>}</h3>
            <br />
            <h3 className="heading-tetriary">Quantity held: {count} units</h3>
            <h3 className="heading-tetriary">Purchase price: {priceAll.toLocaleString('pl-PL')} PLN</h3>
            <br />
            <h3 className="heading-tetriary">Current unit price: {currency !== 'PLN' && <span>{round(currPrice * exchangeRates[currency]).toLocaleString('pl-PL')} PLN / </span>}{currPrice.toLocaleString('pl-PL')} {currency}</h3>
            <h3 className="heading-tetriary">Current value: <span style={deltaStyle}>{currValue.toLocaleString('pl-PL')} zł ({delta}%)</span></h3>
        </div>
    )
}

export default ETFSummary