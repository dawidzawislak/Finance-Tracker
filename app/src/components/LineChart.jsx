import { Chart } from "react-google-charts"

function LineChart(props) {

    const options = {
        chart: {
            title: 'Value of assets in time',
            left: 0, top: 0, width: "100%", height: "100%"
        },
        legend: { position: 'top' },
        tooltip: { isHtml: true }

    }

    return (
        <Chart
            chartType="LineChart"
            data={props.data}
            options={options}
            width={props.width}
            height={props.height}
            legendToggle
        />
    )
}

export default LineChart