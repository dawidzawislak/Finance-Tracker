import React from "react"
import PieChart from "./components/PieChart"
import LineChart from "./components/LineChart"
import SummaryTable from "./components/SummaryTable"
import Loader from "./components/Loader"
import './style/StructurePage.css'
import { getBondValue, getDatesBetween, round, getChartData, getColumnsWithHeader, getIndex } from "./utils"

function StructurePage({ inflation, inflationMonthly, wallet, price, exchangeRates, accumulatedCount, investedValue }) {
    const [values, setValues] = React.useState({})
    const [pieChartData, setPieChartData] = React.useState([])
    const [chartData, setChartData] = React.useState([])
    const options = ["ETFs", "Bonds", "Cryptocurrencies", "Commodities", "Cash", "All"];
    const dictFriendlyNames = { 'etf': 'ETFs', 'crypto': 'Cryptocurrencies', 'commodity': 'Commodities', 'bond': 'Bonds', 'currency': 'Cash' };
    const [checkedItems, setCheckedItems] = React.useState(
        options.reduce((acc, option) => ({ ...acc, [option]: (option == "All") }), {})
    );
    const [allChartData, setAllChartData] = React.useState([]);
    const [firstTransaction, setFirstTransaction] = React.useState(new Date().toISOString().split('T')[0])

    if(!inflation)
        return <Loader />

    const startD = new Date()
    startD.setMonth(startD.getMonth() - 1);

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
                        if (category === "currency") {
                            value += last.count * exchangeRates[name.toUpperCase()];
                        }
                        else {
                            value += last.count * price[category][name].value * exchangeRates[price[category][name].curr] * (name == "gold" ? 1.049 : 1);
                        }
                    }
                });
            } else {
                Object.keys(wallet[category]).forEach((name) => {
                    wallet[category][name]['entries'].forEach((bond) => {
                        value += getBondValue(bond, new Date().toISOString().split('T')[0], inflation)
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

        setPieChartData(_chartData.map((row) => [`${row[0]}\n${round(row[1]).toLocaleString('pl-PL')} PLN`, row[1]]))
        getChartData(getDatesBetween(start, end, 100), wallet, inflation).then((data) => {
            if (end === new Date().toISOString().split('T')[0]) {
                let all = 0;
                _chartData.forEach((row) => {
                    if (['Bonds', 'ETFs', 'Cryptocurrencies', 'Commodities', 'Cash'].includes(row[0])) {
                        data[data.length - 1][getIndex(data, row[0])] = row[1]
                        all += row[1]
                    }
                })

                data[data.length - 1][getIndex(data, 'All')] = all
            }

            setAllChartData(data)
            
            console.log(data)
            console.log(inflationMonthly["2025"])

            const all_ind = getIndex(data, "All");
            const invested_ind = getIndex(data, "All invested");
            let invested = 0;
            const [_, startMonth, startDay] = data[1][0].split("-");
            let prev = 0;
            const return_values = data.map((row, i) => {
                if (i === 0) return ["Date", "Return", "Inflation"];
                else if (i === 1) return [row[0], 0, 0];
                else {
                    const delta = (row[invested_ind] - data[i - 1][invested_ind]);
                    if (data[i - 1][invested_ind] > 0) {
                        invested += delta;
                    }

                    let [year, month, day] = row[0].split("-");
                    let inflation = 0;
                    if (month != 1) {
                        month = Number(month)-1;
                    } else {
                        year = Number(year) - 1;
                        month = Number(month) + 11;
                    }

                    console.log(year, month)

                    if (startMonth == month) {
                        inflation = (inflationMonthly[year][month]-100)*(day-startDay)/(30)
                    } else {
                        inflation = (inflationMonthly[year][month]-100)*day/30
                    }

                    
                    const deltaWOInv = ((row[all_ind]) / (data[1][all_ind] + invested) - 1) * 100;
                    
                    if (row[0].split("-")[1] != data[i-1][0].split("-")[1]) {
                        console.log("PREV", prev, inflation, (1+(inflation)))
                        inflation = prev * (1+inflation)
                    }

                    prev = inflation;

                    return [row[0], deltaWOInv, inflation]
                }
            })

            console.log(return_values);

            setChartData(getColumnsWithHeader(data, Object.keys(checkedItems).filter((key) => checkedItems[key])))
            //setChartData(return_values)
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
        <div key={i}>
            <input
                type="checkbox"
                name={option}
                checked={checkedItems[option]}
                onChange={handleCheckboxChange}
            />
            <label>{option}</label>
        </div>
    ));

    return (
        chartData.length > 1 && pieChartData.length > 1 ?
            <div className="container">
                <aside className="currencies">
                    <div className="flex">
                        <div>EURPLN: {exchangeRates['EUR'].toLocaleString('pl-PL')}</div>
                        <div>GBPPLN: {exchangeRates['GBP'].toLocaleString('pl-PL')}</div>
                        <div>USDPLN: {exchangeRates['USD'].toLocaleString('pl-PL')}</div>
                    </div>
                </aside>
                <main className="content">
                    <h1 className="heading-primary">Wallet structure:</h1>
                    <div className="charts">
                        <div style={{ width: "50%" }}>
                            <PieChart
                                data={pieChartData}
                                width={"100%"}
                                height={"400px"}
                            />
                        </div>
                        <div style={{ width: "50%", paddingLeft: "100px"}}>
                            <h3 style={{ marginTop: "140px" }} className="heading-secondary-no-margin">Current value: {curr_value.toLocaleString("pl-PL")} PLN <span style={deltaStyle}>({diff} %)</span></h3>
                            <h4 style={{ marginTop: "10px" }} className="heading-tetriary">Invested value: {inv_value.toLocaleString("pl-PL")} PLN</h4>
                        </div>
                    </div>
                    <hr />
                    <h2 style={{marginTop: "2rem"}}className='heading-secondary'>Portfolio return value in time:</h2>

                    <hr />
                    <h2 style={{marginTop: "2rem"}}className='heading-secondary'>Portfolio value in time:</h2>
                    <div style={{margin: "50px 0"}}>
                        <div className="checkboxes">
                            {checkboxes}
                        </div>
                        <LineChart
                            data={chartData}
                            width={"100%"}
                            height={"600px"}
                        />
                        <form className="interval-btns">
                            <button onClick={(evnt) => setStartDate('WEEK', evnt)}>WEEK</button>
                            <button onClick={(evnt) => setStartDate('MONTH', evnt)}>MONTH</button>
                            <button onClick={(evnt) => setStartDate('YEAR', evnt)}>YEAR</button>
                            <button onClick={(evnt) => { evnt.preventDefault(); setStart(firstTransaction) }}>MAX</button>
                        </form>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", marginTop: "15px", padding: "0 20px" }}>
                            <label>Start date: <input type="date" value={start} onChange={(ev) => setStart(ev.target.value)}></input></label>
                            <label>End date: <input type="date" value={end} onChange={(ev) => setEnd(ev.target.value)}></input></label>
                        </div>
                    </div>
                    <hr />
                    <SummaryTable allChartData={allChartData} />
                </main>
            </div>
            : <Loader />
    )
}

export default StructurePage