import React from "react"
import crossIcon from '../assets/cross-icon.png'
import LineChart from "./LineChart"
import { getDatesBetween, getChartDataETF } from "../utils"

function ChartModal({ closeModal, wallet, firstTransaction, name }) {
    const startD = new Date()
    startD.setFullYear(startD.getFullYear() - 1);

    const [start, setStart] = React.useState(startD.toISOString().split('T')[0])
    const [end, setEnd] = React.useState(new Date().toISOString().split('T')[0])
    const [chartData, setChartData] = React.useState([])

    React.useEffect(() => {
        const dial = document.getElementById("modal")
        dial.showModal()

        return () => {
            dial.close()
        }
    }, [])

    React.useEffect(() => {
        getChartDataETF(getDatesBetween(start, end, 100), wallet, name).then((data) => {
           setChartData(data)
        })
    }, [start, end])

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

    return (
        <dialog id="modal">
            <form>
                <div className="controls">
                    <button onClick={closeModal} className="modal-btn modal-btn-cross">
                        <img src={crossIcon} alt="crossIcon" width={18} />
                    </button>
                </div>
            </form>
            <div className="chart-container">
                <LineChart data={chartData}/>
            </div>
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
        </dialog>
    )
}

export default ChartModal