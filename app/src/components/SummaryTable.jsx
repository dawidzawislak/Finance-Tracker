import { React } from 'react';
import { round, getIndex } from '../utils'

function SummaryTable({ allChartData }) {
    let invested = { 'All': 0, 'Bonds': 0, 'ETFs': 0, 'Commodities': 0, 'Cryptocurrencies': 0 };
    let startInd = { 'All': -1, 'Bonds': -1, 'ETFs': -1, 'Commodities': -1, 'Cryptocurrencies': -1 };

    const formatDelta = (delta) => {
        if (delta >= 0) {
            return <span style={{ color: 'green' }}><br></br>(+{round(delta).toLocaleString('pl-PL')})</span>
        } else {
            return <span style={{ color: 'red' }}><br></br>({round(delta).toLocaleString('pl-PL')})</span>
        }
    }

    const formatDelta2 = (delta, pref = '', post = '') => {
        if (delta > 0) {
            return <span style={{ color: 'green' }}>{pref} +{round(delta).toLocaleString('pl-PL')} {post}</span>
        } else if (delta < 0) {
            return <span style={{ color: 'red' }}>{pref} {round(delta).toLocaleString('pl-PL')} {post}</span>
        } else {
            return <span>{pref} {round(delta).toLocaleString('pl-PL')} {post}</span>
        }
    }

    const trs = allChartData.map((row, i) => {
        if (i === 0) return;

        return (
            <tr key={i}>
                <td key={i + "date"}>{row[0]}</td>
                {['All', 'Bonds', 'ETFs', 'Commodities', 'Cryptocurrencies'].map((name, j) => {
                    let delta = 0;
                    let deltaWOInv = 0;
                    let deltaABS = 0;
                    if (i > 0 && startInd[name] === -1 && row[getIndex(allChartData, `${name} invested`)] > 0) {
                        startInd[name] = i;
                    }
                    if (i > 1) {
                        delta = (row[getIndex(allChartData, `${name} invested`)] - allChartData[i - 1][getIndex(allChartData, `${name} invested`)]);
                        if (allChartData[i - 1][getIndex(allChartData, `${name} invested`)] > 0) {
                            invested[name] += delta;
                        }
                        if (startInd[name] > 0 && i > startInd[name]) {
                            deltaABS = row[getIndex(allChartData, name)] - allChartData[startInd[name]][getIndex(allChartData, name)] - invested[name];
                            deltaWOInv = ((row[getIndex(allChartData, name)]) / (allChartData[startInd[name]][getIndex(allChartData, name)] + invested[name]) - 1) * 100;
                        }
                    }
                    return (<>
                        <td key={name + j + "v"}>{round(row[getIndex(allChartData, name)]).toLocaleString("pl-PL")} PLN{delta != 0 && formatDelta(delta)}</td>
                        <td key={name + j + "i"} style={{ fontSize: "14px" }}>{formatDelta2(deltaABS, '', 'PLN')} {formatDelta2(deltaWOInv, '(', '%)')}</td>
                    </>)
                })}
            </tr>
        )
    });

    return (
        <div className="summary-table-container">
            <table className='summary-table'>
                <thead>
                    <tr>
                        <th rowSpan={2}>Date</th>
                        <th colSpan={2}>All</th>
                        <th colSpan={2}>Bonds</th>
                        <th colSpan={2}>ETFs</th>
                        <th colSpan={2}>Commodities</th>
                        <th colSpan={2}>Cryptocurrencies</th>
                    </tr>
                    <tr>
                        <th>Value</th>
                        <th>Delta w/o inv</th>
                        <th>Value</th>
                        <th>Delta w/o inv</th>
                        <th>Value</th>
                        <th>Delta w/o inv</th>
                        <th>Value</th>
                        <th>Delta w/o inv</th>
                        <th>Value</th>
                        <th>Delta w/o inv</th>
                    </tr>
                </thead>
                <tbody>
                    {trs}
                </tbody>
            </table>
        </div>
    )
}

export default SummaryTable