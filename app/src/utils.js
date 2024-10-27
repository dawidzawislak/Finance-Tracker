export const round = (num) => Math.round((num + Number.EPSILON) * 100) / 100

export const getDatesBetween = (start, end, samples = -1) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dates = [];

    const timeDifference = Math.abs(endDate - startDate);
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    let step = 1;

    if (samples > 0) {
        step = Math.ceil(daysDifference / (samples-1));
    }

    while (startDate <= endDate) {
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
        currVal *= bond[`int${i}`] != '' ? 1 + Number(bond[`int${i}`])/100 : 1;
        years--;
        i++;
    }
    currVal *= bond[`int${i}`] != '' ? 1 + Number(bond[`int${i}`])/100*years : 1;
    
    return round(currVal);
}

export const getBondValues = (wallet, timeStamps) => {
    let values = []
    timeStamps.forEach((time) => {
        let value = 0;
        Object.keys(wallet.bond).forEach((name) => {
            wallet.bond[name]['entries'].forEach((bond) => {
                value += getBondValue(bond, time)
            });
        });
        values.push(value);
    });
    
    return values;
}

export const getETFValues = async (timeStamps, wallet, exchangeRates) => {
    const dict = Object.fromEntries(timeStamps.map(key => [key, 0]));

    await Promise.all(Object.keys(wallet.etf).map(async (name) => {
        const price = await fetch(`http://localhost:8000/historical_data/${name}?start=${timeStamps[0]}&end=${timeStamps.at(-1)}`).then(response => response.json());
        for (const time of timeStamps) {
            for (let i = 0; i < wallet.etf[name].entries.length; i++) {
                if ((i == wallet.etf[name].entries.length - 1 || wallet.etf[name].entries[i + 1].date > time) && wallet.etf[name].entries[i].date <= time) {
                    console.log(wallet.etf[name].entries[i].count, price.values[time], exchangeRates[price.curr])
                    dict[time] += wallet.etf[name].entries[i].count * price.values[time] * exchangeRates[price.curr];
                }
            }
        }
    }));
    
    return Object.values(dict);
};

export const getCryptoValues = async (timeStamps, wallet, exchangeRates) => {
    const dict = Object.fromEntries(timeStamps.map(key => [key, 0]));
    
    console.log(wallet.crypto)

    await Promise.all(Object.keys(wallet.crypto).map(async (name) => {
        const price = await fetch(`http://localhost:8000/historical_data/${name}?start=${timeStamps[0]}&end=${timeStamps.at(-1)}`).then(response => response.json());
        for (const time of timeStamps) {
            for (let i = 0; i < wallet.crypto[name].entries.length; i++) {
                if ((i == wallet.crypto[name].entries.length - 1 || wallet.crypto[name].entries[i + 1].date > time) && wallet.crypto[name].entries[i].date <= time) {
                    console.log(wallet.crypto[name].entries[i].count, price.values[time])
                    dict[time] += wallet.crypto[name].entries[i].count * price.values[time];
                }
            }
        }
    }));
    
    return Object.values(dict);
};