import { Chart } from "react-google-charts"

function PieChart(props) {

    const options = {
        is3D: true,
        chartArea: {width: "100%"}
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