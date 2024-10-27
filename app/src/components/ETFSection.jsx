import ETFSummary from "./ETFSummary.jsx"
import ETFTable from './ETFTable.jsx'
import React from "react"

function ETFSection(props) {
    const [tickerData, setTickerData] = React.useState([])
    const tickerInfo = props.info[props.ticker.toUpperCase()] ? props.info[props.ticker.toUpperCase()] : {etfName: '', tickerData: ''}

    React.useEffect(() => {
        fetch('http://localhost:8000/history-etf-'+props.ticker).then(response => response.json()).then(data => {
            setTickerData(data)
        })
    }, [])

    const value = props.ticker !== 'swda' ? tickerInfo.value : tickerInfo.value / 100

    return (
        <>
        <h2 className='heading-secondary'>{tickerInfo.etfName}</h2>
        <div className="flex" style={{marginBottom: '50px'}}>
            <ETFTable tickerName={props.ticker} currency={tickerInfo.curr} data={tickerData} updateData={setTickerData}/>
            <ETFSummary currency={tickerInfo.curr} currencyRate={props.currencies[tickerInfo.curr]} price={value} data={tickerData} updateVal={props.updateVal}/>
        </div>
        </>
    )
}

export default ETFSection