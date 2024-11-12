import React from "react"
import PieChart from "./components/PieChart"
import LineChart from "./components/LineChart"
import SummaryTable from "./components/SummaryTable"
import './style/StructurePage.css'
import {getBondValue, getDatesBetween, round, getChartData, getColumnsWithHeader} from "./utils"

function StructurePage({wallet, price, exchangeRates, accumulatedCount, investedValue}) {
    const [values, setValues] = React.useState({})
    const [pieChartData, setPieChartData] = React.useState([])
    const [chartData, setChartData] = React.useState([])
    const options = ["ETFs", "Bonds", "Cryptocurrencies", "Commodities", "All"];
    const [checkedItems, setCheckedItems] = React.useState(
        options.reduce((acc, option) => ({ ...acc, [option]: (option == "All") }), {})
    );
    const [allChartData, setAllChartData] = React.useState([]);

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
        Object.keys(accumulatedCount).forEach((category) => {
            let value = 0;
            if (category != "bond") {
                Object.keys(accumulatedCount[category]).forEach((name) => {
                    if (accumulatedCount[category][name].length > 0) {
                        let last = accumulatedCount[category][name].at(-1);
                        value += last.count * price[category][name].value * exchangeRates[price[category][name].curr] * (name == "gold" ? 1.049 : 1);
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
        getChartData(getDatesBetween(start, end, 100), wallet, exchangeRates, checkedItems).then((data) => {
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
                        <button onClick={(evnt) => {evnt.preventDefault();setStart("2020-11-13")}}>MAX</button>
                    </form>
                    <div style={{display: "flex", justifyContent: "space-between", fontSize: "20px", marginTop: "15px", padding: "0 20px"}}>
                        <label>Start date: <input type="date" value={start} onChange={(ev) => setStart(ev.target.value)}></input></label>
                        <label>End date: <input type="date" value={end} onChange={(ev) => setEnd(ev.target.value)}></input></label>
                    </div>
                </div>
            </div>
            {allChartData && <SummaryTable allChartData={allChartData}/>}
        </main>
    )
}

export default StructurePage