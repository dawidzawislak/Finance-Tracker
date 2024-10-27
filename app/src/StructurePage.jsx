import React from "react"
import PieChart from "./components/PieChart"
import LineChart from "./components/LineChart"
import './style/StructurePage.css'
import {getBondValue, getBondValues, getDatesBetween, round, getETFValues, getCryptoValues} from "./utils"

function StructurePage({wallet, price, exchangeRates, accumulatedCount, investedValue}) {
    const [values, setValues] = React.useState({})
    const [pieChartData, setPieChartData] = React.useState([])
    const [chartData, setChartData] = React.useState([])

    const start = "2020-11-13"
    const end = "2024-10-26"

    React.useEffect(() => {
        let _values = {}
        let _chartData = [["Asset", "Share"]]
        let _chartData2 = [["Date", "ETF", "Bonds", "Crypto", "All"]]
        Object.keys(accumulatedCount).forEach((category) => {
            let value = 0;
            if (category != "bond") {
                Object.keys(accumulatedCount[category]).forEach((name) => {
                    if (accumulatedCount[category][name].length > 0) {
                        let last = accumulatedCount[category][name].at(-1);
                        value += last.count * price[category][name].value * exchangeRates[price[category][name].curr];
                    }
                });
            } else {
                Object.keys(wallet[category]).forEach((name) => {
                    wallet[category][name]['entries'].forEach((bond) => {
                        value += getBondValue(bond, new Date().toISOString().split('T')[0]);
                    });
                });
            }
            _values[category] = round(value);
            _chartData.push([category.toUpperCase(), value]);
        });
        setValues(_values)        

        setPieChartData(_chartData)
        getETFValues(getDatesBetween(start, end, 100), wallet, exchangeRates).then((values) => {
            getCryptoValues(getDatesBetween(start, end, 100), wallet, exchangeRates).then((cryptoValues) => {
                let bonds = getBondValues(wallet, getDatesBetween(start, end, 100))
                getDatesBetween(start, end, 100).map((item, index) => {
                    _chartData2.push([item, values[index], bonds[index], cryptoValues[index], cryptoValues[index] + values[index] + bonds[index]]);
                });
                setChartData(_chartData2)
            })
        })
    }, [wallet]);

    const curr_value = Object.values(values).reduce((acc, val) => acc + val, 0)
    const inv_value = Object.values(investedValue).reduce((acc, val) => acc + val, 0)

    let diff = round((curr_value / inv_value - 1) * 100)

    let deltaStyle = {}

    if (curr_value > inv_value) {
        diff = '+' + diff
        deltaStyle.color = 'green';
    } else {
        deltaStyle.color = 'red';
    }

    return (
        <main className="content">
            <h1 className="heading-primary">Wallet structure:</h1>
            <div className="charts">
                <div style={{width: "50%"}}>
                    <PieChart
                        data={pieChartData}
                        width={"100%"}
                        height={"300px"}
                    />
                </div>
                <div style={{width: "50%"}}>
                    <LineChart
                        data={chartData}
                        width={"100%"}
                        height={"300px"}
                    />
                </div>
            </div>
            <h3 className="heading-secondary-no-margin">Current value: {curr_value.toLocaleString("pl-PL")} PLN <span style={deltaStyle}>({diff} %)</span></h3>
            <h4 className="heading-tetriary">Invested value: {inv_value.toLocaleString("pl-PL")} PLN</h4>
        </main>
    )
}

export default StructurePage