import { Chart } from "react-google-charts"

function PieChart(props) {

    const options = {
        is3D: true,
        chartArea: {left:0,top:0, width: "100%", height: "100%"},
    }

    return (
        <Chart
            chartType="PieChart"
            data={props.data}
            options={options}
            width={props.width}
            height={props.height}
        />
    )
}

export default PieChart