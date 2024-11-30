import React from "react"
import PieChart from "./components/PieChart"
import LineChart from "./components/LineChart"
import SummaryTable from "./components/SummaryTable"
import Loader from "./components/Loader"
import './style/StructurePage.css'
import {getBondValue, getDatesBetween, round, getChartData, getColumnsWithHeader, getIndex} from "./utils"

function StructurePage({wallet, price, exchangeRates, accumulatedCount, investedValue}) {
    const [values, setValues] = React.useState({})
    const [pieChartData, setPieChartData] = React.useState([])
    const [chartData, setChartData] = React.useState([])
    const options = ["ETFs", "Bonds", "Cryptocurrencies", "Commodities", "All"];
    const dictFriendlyNames = {'etf': 'ETFs', 'crypto': 'Cryptocurrencies', 'commodity': 'Commodities', 'bond': 'Bonds'};
    const [checkedItems, setCheckedItems] = React.useState(
        options.reduce((acc, option) => ({ ...acc, [option]: (option == "All") }), {})
    );
    const [allChartData, setAllChartData] = React.useState([]);
    const [firstTransaction, setFirstTransaction] = React.useState(new Date().toISOString().split('T')[0])

    const startD = new Date()
    startD.setFullYear(startD.getFullYear() - 1);

    const [start, setStart] = React.useState(startD.toISOString().split('T')[0])
    const [end, setEnd] = React.useState(new Date().toISOString().split('T')[0])

    const setStartDate = (interval, evnt) => {
        evnt.preventDefault();
        let startD = new Date();
        switch (interval) {
            case 'WEEK':
                startD.setDate(startD.getDate() - 7);
                break;
            case 'MONTH':
                startD.setMonth(startD.getMonth() - 1);
                break;
            case 'YEAR':
                startD.setFullYear(startD.getFullYear() - 1);
                break;
            default:
                throw new Error('Invalid interval');
        }
        setStart(startD.toISOString().split('T')[0])
    }

    React.useEffect(() => {
        let _values = {}
        let _chartData = [["Asset", "Share"]]
        let _firstTransaction = firstTransaction
        Object.keys(accumulatedCount).forEach((category) => {
            let value = 0;
            if (category != "bond") {
                Object.keys(accumulatedCount[category]).forEach((name) => {
                    if (accumulatedCount[category][name].length > 0) {
                        const date1 = new Date(accumulatedCount[category][name][0].date);
                        const date2 = new Date(_firstTransaction);
                        if (date1 < date2) {
                            _firstTransaction = accumulatedCount[category][name][0].date;
                        }
                        let last = accumulatedCount[category][name].at(-1);
                        value += last.count * price[category][name].value * exchangeRates[price[category][name].curr] * (name == "gold" ? 1.049 : 1);
                    }
                });
            } else {
                Object.keys(wallet[category]).forEach((name) => {
                    wallet[category][name]['entries'].forEach((bond) => {
                        value += getBondValue(bond, new Date().toISOString().split('T')[0]);
                        const date1 = new Date(bond.date);
                        const date2 = new Date(_firstTransaction);
                        if (date1 < date2) {
                            _firstTransaction = bond.date;
                        }
                    });
                });
            }
            _values[category] = round(value);
            _chartData.push([dictFriendlyNames[category], value]);
        });
        setValues(_values)
        setFirstTransaction(_firstTransaction)

        setPieChartData(_chartData)
        getChartData(getDatesBetween(start, end, 100), wallet).then((data) => {
            if (_chartData.length > 1) {
                let all = 0;
                _chartData.forEach((row) => {
                    if (['Bonds', 'ETFs', 'Cryptocurrencies', 'Commodities'].includes(row[0])) {
                        data[data.length-1][getIndex(data, row[0])] = row[1]
                        all += row[1]
                    }
                })

                data[data.length-1][getIndex(data, 'All')] = all
            }
            setAllChartData(data)
            setChartData(getColumnsWithHeader(data, Object.keys(checkedItems).filter((key) => checkedItems[key])))
        })
    }, [wallet, start, end]);

    React.useEffect(() => {
        if (allChartData.length > 0) {
            setChartData(getColumnsWithHeader(allChartData, Object.keys(checkedItems).filter((key) => checkedItems[key])))
        }
    }, [checkedItems]);

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

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setCheckedItems((prevState) => ({
          ...prevState,
          [name]: checked,
        }));
    };

    const checkboxes = options.map((option, i) => (
    <div>
        <input
        type="checkbox"
        name={option}
        checked={checkedItems[option]}
        onChange={handleCheckboxChange}
        key={i}
        />
        <label>{option}</label>
    </div>
    ));

    return (
        chartData.length > 1 && pieChartData.length > 1 ? 
        <div>
            <aside className="currencies">
                <p>EUR: {exchangeRates['EUR']} zł | GBP: {exchangeRates['GBP']} zł | USD: {exchangeRates['USD']} zł</p>
            </aside>
            <main className="content">
                <h1 className="heading-primary">Wallet structure:</h1>
                <div className="charts">
                    <div style={{width: "50%"}}>
                        <PieChart
                            data={pieChartData}
                            width={"100%"}
                            height={"300px"}
                        />
                        <h3 style={{marginTop: "30px"}} className="heading-secondary-no-margin">Current value: {curr_value.toLocaleString("pl-PL")} PLN <span style={deltaStyle}>({diff} %)</span></h3>
                        <h4 className="heading-tetriary">Invested value: {inv_value.toLocaleString("pl-PL")} PLN</h4>
                    </div>
                    <div style={{width: "50%"}}>
                        <div className="checkboxes">
                            {checkboxes}
                        </div>
                        <LineChart
                            data={chartData}
                            width={"100%"}
                            height={"300px"}
                        />
                        <form className="interval-btns">
                            <button onClick={(evnt) => setStartDate('WEEK', evnt)}>WEEK</button>
                            <button onClick={(evnt) => setStartDate('MONTH', evnt)}>MONTH</button>
                            <button onClick={(evnt) => setStartDate('YEAR', evnt)}>YEAR</button>
                            <button onClick={(evnt) => {evnt.preventDefault();setStart(firstTransaction)}}>MAX</button>
                        </form>
                        <div style={{display: "flex", justifyContent: "space-between", fontSize: "20px", marginTop: "15px", padding: "0 20px"}}>
                            <label>Start date: <input type="date" value={start} onChange={(ev) => setStart(ev.target.value)}></input></label>
                            <label>End date: <input type="date" value={end} onChange={(ev) => setEnd(ev.target.value)}></input></label>
                        </div>
                    </div>
                </div>
                <SummaryTable allChartData={allChartData}/>
            </main>
        </div> 
        : <Loader />
    )
}

export default StructurePage