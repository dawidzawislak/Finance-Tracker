export const round = (num) => Math.round((num + Number.EPSILON) * 100) / 100

export const getDeltaStyle = (currValue, priceAll) => {
    let deltaStyle = {}
    let delta = round((currValue / priceAll - 1) * 100);
    if (currValue > priceAll) {
        delta = '+' + delta
        deltaStyle.color = 'green';
    } else {
        deltaStyle.color = 'red';
    }

    return [delta, deltaStyle];
}

export const getDatesBetween = (start, end, samples = -1) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dates = [];

    const timeDifference = Math.abs(endDate - startDate);
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    let step = 1;

    if (samples > 0 && daysDifference > samples) {
        step = Math.ceil(daysDifference / (samples - 1));
    }

    while (startDate < endDate) {
        dates.push(new Date(startDate).toISOString().split('T')[0]);
        startDate.setDate(startDate.getDate() + step);
    }
    dates.push(end);

    return dates;
}

export const getBondValue = (bond, time) => {
    const start = new Date(bond.date)
    const now = new Date(time)

    if (start > now) {
        return 0;
    }

    const difference = now.getTime() - start.getTime()
    let years = Math.ceil(difference / (1000 * 3600 * 24)) / 365.25

    let currVal = bond.price

    let i = 1
    while (years > 1) {
        currVal *= bond[`int${i}`] != '' ? 1 + Number(bond[`int${i}`]) / 100 : 1;
        years--;
        i++;
    }
    currVal *= bond[`int${i}`] != '' ? 1 + Number(bond[`int${i}`]) / 100 * years : 1;

    return round(currVal);
}

export const getBondValues = (wallet, timeStamps) => {
    let values = []
    timeStamps.forEach((time) => {
        let value = 0;
        let accInv = 0;
        Object.keys(wallet.bond).forEach((name) => {
            wallet.bond[name]['entries'].forEach((bond) => {
                accInv += bond.date <= time ? bond.count * 100 : 0;
                value += getBondValue(bond, time)
            });
        });
        values.push([value, accInv]);
    });

    return values;
}

export const getValues = async (asset, timeStamps, wallet, exchangeRatesCache) => {
    const values = Object.fromEntries(timeStamps.map(key => [key, [0, 0]]));

    await Promise.all(Object.keys(wallet[asset]).map(async (name) => {
        const price = await fetch(`http://localhost:8000/historical_data/${name}?start=${timeStamps[0]}&end=${timeStamps.at(-1)}`).then(response => response.json());
        if (price.curr != 'PLN' && !exchangeRatesCache[price.curr]) {
            exchangeRatesCache[price.curr] = await fetch(`http://localhost:8000/historical_data/${price.curr.toLowerCase()}pln?start=${timeStamps[0]}&end=${timeStamps.at(-1)}`).then(response => response.json());
        }

        for (const time of timeStamps) {
            let accCount = 0;
            let invested = 0;
            wallet[asset][name]['entries'].forEach((entry) => {
                if (entry.date <= time) {
                    accCount += entry.count;
                    invested += (entry.price ? entry.price : entry.count * entry.unitPrice) + (entry.fee ? entry.fee : 0);
                }
            });
            values[time][0] += accCount * price.values[time] * (price.curr != 'PLN' ? exchangeRatesCache[price.curr].values[time] : 1) * (name == "gold" ? 1.049 : 1);
            values[time][1] += invested;
        }
    }));

    return Object.values(values);
};

export const getValuesNamed = async (asset, name, timeStamps, wallet, exchangeRatesCache) => {
    const values = Object.fromEntries(timeStamps.map(key => [key, [0, 0]]));

    const price = await fetch(`http://localhost:8000/historical_data/${name}?start=${timeStamps[0]}&end=${timeStamps.at(-1)}`).then(response => response.json());
    if (price.curr != 'PLN' && !exchangeRatesCache[price.curr]) {
        exchangeRatesCache[price.curr] = await fetch(`http://localhost:8000/historical_data/${price.curr.toLowerCase()}pln?start=${timeStamps[0]}&end=${timeStamps.at(-1)}`).then(response => response.json());
    }

    for (const time of timeStamps) {
        let accCount = 0;
        let invested = 0;
        wallet[asset][name]['entries'].forEach((entry) => {
            if (entry.date <= time) {
                accCount += entry.count;
                invested += (entry.price ? entry.price : entry.count * entry.unitPrice) + (entry.fee ? entry.fee : 0);
            }
        });
        values[time][0] += accCount * price.values[time] * (price.curr != 'PLN' ? exchangeRatesCache[price.curr].values[time] : 1) * (name == "gold" ? 1.049 : 1);
        values[time][1] += invested;
    }

    return Object.values(values);
};

export const getChartData = async (timeStamps, wallet) => {
    let data = [["Date"]];
    timeStamps.forEach((time) => {
        data.push([time]);
    });

    const dict = { 'ETFs': 'etf', 'Cryptocurrencies': 'crypto', 'Commodities': 'commodity', 'Bonds': 'bond' };

    const exchangeRatesCache = {};

    await Promise.all(['EUR', 'GBP', 'USD'].map(async (curr) => {
        exchangeRatesCache[curr] = await fetch(`http://localhost:8000/historical_data/${curr.toLowerCase()}pln?start=${timeStamps[0]}&end=${timeStamps.at(-1)}`).then(response => response.json());
    }));

    await Promise.all(['ETFs', 'Cryptocurrencies', 'Commodities', 'Bonds'].map(async (category) => {
        let values = []
        if (category === 'Bonds') {
            values = getBondValues(wallet, timeStamps);
        } else {
            values = await getValues(dict[category], timeStamps, wallet, exchangeRatesCache);
        }
        data = data.map((v, i) => {
            if (i == 0) {
                return [...v, category, `${category} invested`];
            }
            return [...v, values[i - 1][0] ? values[i - 1][0] : 0, values[i - 1][1] ? values[i - 1][1] : 0];
        });
    }));

    data = data.map((v, i) => {
        if (i == 0) {
            return [...v, 'All', 'All invested'];
        }
        const value = v.filter((_, index) => index > 0 && index % 2 == 1).reduce((acc, curr) => acc + curr, 0);
        const invested = v.filter((_, index) => index > 0 && index % 2 == 0).reduce((acc, curr) => acc + curr, 0);
        return [...v, value, invested];
    });

    return data;
}

export const getChartDataETF = async (timeStamps, wallet, name) => {
    let data = [["Date"]];
    timeStamps.forEach((time) => {
        data.push([time]);
    });

    const exchangeRatesCache = {};

    await Promise.all(['EUR', 'GBP', 'USD'].map(async (curr) => {
        exchangeRatesCache[curr] = await fetch(`http://localhost:8000/historical_data/${curr.toLowerCase()}pln?start=${timeStamps[0]}&end=${timeStamps.at(-1)}`).then(response => response.json());
    }));

    
    let values = await getValuesNamed('etf', name, timeStamps, wallet, exchangeRatesCache);

    data = data.map((v, i) => {
        if (i == 0) {
            return [...v, 'Value', `Invested`];
        }
        return [...v, values[i - 1][0] ? values[i - 1][0] : 0, values[i - 1][1] ? values[i - 1][1] : 0];
    });

    return data;
}

export function getIndex(arr, header) {
    return arr[0].indexOf(header);
}

export function getColumnsWithHeader(array, columnNames) {
    columnNames = columnNames.concat(columnNames.map(item => `${item} invested`));
    columnNames.push('Date');

    let data = array.map(row => row.filter((_, index) => columnNames.includes(array[0][index])));

    for (let name of columnNames) {
        if (name === 'Date') {
            continue;
        }
        for (let i = data.length - 1; i > 1; i--) {
            const delta = data[i][getIndex(data, `${name} invested`)] - data[i - 1][getIndex(data, `${name} invested`)];
            data[i][getIndex(data, `${name} invested`)] = delta != 0 ? `+${delta.toFixed(2)}` : null;
        }

        data[1][getIndex(data, `${name} invested`)] = null;

        data[0][getIndex(data, `${name} invested`)] = { role: "annotation" };
    }

    return data;
}