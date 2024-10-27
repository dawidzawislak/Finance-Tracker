import React from 'react'
import ETFSection from './components/ETFSection.jsx'

function ETFPage() {
    const [currencies, setCurrencies] = React.useState({EURPLN: 0, GBPPLN: 0, USDPLN: 0})

    const [etfInfo, setEtfInfo] = React.useState({})

    const [swdaVal, setSWDAVal] = React.useState(0)
    const [iwdaVal, setIWDAVal] = React.useState(0)
    const [is3nVal, setIS3NVal] = React.useState(0)
    const [etfbm40trVal, setETFBM40TRVal] = React.useState(0)

    React.useEffect(() => {
        fetch('https://api.nbp.pl/api/exchangerates/tables/A/?format=json').then(res => res.json()).then(data => {
            data[0].rates.forEach(rate => {
                if (rate.code === 'GBP' || rate.code === 'USD' || rate.code === 'EUR') {
                    setCurrencies(prev => ({...prev, [rate.code]: Math.round(Number(rate.mid)*100)/100}))
                }
            })
        })

        fetch('http://localhost:8000/etf').then(response => response.json()).then(data => {
            setEtfInfo(data)
        })
    }, [])

    React.useEffect(() => {
        fetch('http://localhost:8000/structure').then(response => response.json()).then(structure => {
            const overAll = swdaVal + iwdaVal + is3nVal + etfbm40trVal
            if (structure.etf !== overAll) {
                structure.etf = overAll
                fetch('http://localhost:8000/update-structure', {
                    method: 'POST',
                    body: JSON.stringify(structure),
                    headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    }
                })
            }
        })
    }, [swdaVal, iwdaVal, is3nVal, etfbm40trVal])

    return (
        <>
        <aside className="currencies">
            <p>EUR: {currencies.EUR} zł | GBP: {currencies.GBP} zł | USD: {currencies.USD} zł</p>
        </aside>
        <main className="content">
            <h1 className="heading-primary">ETFy</h1>
            <ETFSection currencies={currencies} info={etfInfo} ticker="swda" updateVal={setSWDAVal} />
            <ETFSection currencies={currencies} info={etfInfo} ticker="iwda" updateVal={setIWDAVal}/>
            <ETFSection currencies={currencies} info={etfInfo} ticker="is3n" updateVal={setIS3NVal}/>
            <ETFSection currencies={currencies} info={etfInfo} ticker="etfbm40tr" updateVal={setETFBM40TRVal}/>
        </main>
        </>
    )
}

export default ETFPage