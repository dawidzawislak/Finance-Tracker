import React from "react"
import PieChart from "./components/PieChart"
import './style/StructurePage.css'

function StructurePage() {
    const [value, setValue] = React.useState(0)
    const [chartData, setChartData] = React.useState([])

    React.useEffect(() => {
        fetch('http://localhost:8000/structure').then(response => response.json()).then(data => {
            setValue(Math.round(Number(data.obligacje + data.etf + data.zloto + data.kryptowaluty)*100)/100)

            setChartData([
                ["Asset", "Share"],
                ["Obligacje", data.obligacje],
                ["ETF", data.etf],
                ["Złoto", data.zloto],
                ["Kryptowaluty", data.kryptowaluty]
            ])
        })        
    }, [])
    
    const modelData = [
        ["Asset", "Share"],
        ["Obligacje", 40],
        ["ETF", 40],
        ["Złoto", 10],
        ["Kryptowaluty", 10]
    ];
    

    return (
        <main className="content">
            <h1 className="heading-primary">Struktura portfela</h1>
            <div className="charts">
                <div style={{width: "45%"}}>
                    <h2 className="heading-secondary-no-margin">Aktualna: </h2>
                    <PieChart
                        data={chartData}
                        width={"100%"}
                        height={"420px"}
                    />
                </div>
                <div style={{width: "45%"}}>
                    <h2 className="heading-secondary-no-margin">Modelowa: </h2>
                    <PieChart
                        data={modelData}
                        width={"100%"}
                        height={"420px"}
                    />
                </div>
            </div>
            <h3 className="heading-secondary-no-margin">Wartość: {value} zł</h3>
        </main>
    )
}

export default StructurePage