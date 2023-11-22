// SWDA var
let swdagbpEl = document.querySelector('#swda-gbp');
let swdaplnEl = document.querySelector('#swda-pln');
let countSWDA = document.querySelector('#count-swda');
let priceSWDA = document.querySelector('#price-swda');
let valSWDA = document.querySelector('#val-swda');
let avgBuyPLNSWDA = document.querySelector('#avg-buy-pln-swda');
let avgBuyGBPSWDA = document.querySelector('#avg-buy-gbp-swda');

const deltaSWDAEl = document.querySelector('#delta-swda');
const colorSWDAEl = document.querySelector('#color-swda');

let swdaVal = 0;
let swdaCount = 0;
let swdagbp = 0;
let swdaPriceAll = 0;

const tableSWDAEl = document.querySelector('#table-swda');


// IWDA var
let btnAddIWDA = document.querySelector('#add-iwda');
let inputDateIWDAEl = document.querySelector('#date-iwda');
let inputPriceIWDAEl = document.querySelector('#input-price-iwda');
let inputCountIWDAEl = document.querySelector('#input-count-iwda');
let inputPriceOneIWDAEl = document.querySelector('#input-priceOne-iwda');
let inputCurrIWDAEl = document.querySelector('#input-curr-iwda');
let inputFeeIWDAEl = document.querySelector('#input-fee-iwda');

const iwdaeurEl = document.querySelector('#iwda-eur');
const iwdaplnEl = document.querySelector('#iwda-pln');
const countIWDA = document.querySelector('#count-iwda');
const priceIWDA = document.querySelector('#price-iwda');
const valIWDA = document.querySelector('#val-iwda');
const avgBuyPLNIWDA = document.querySelector('#avg-buy-pln-iwda');
const avgBuyEURIWDA = document.querySelector('#avg-buy-eur-iwda');

const deltaIWDAEl = document.querySelector('#delta-iwda');
const colorIWDAEl = document.querySelector('#color-iwda');

let iwdaVal = 0;
let iwdaCount = 0;
let iwdaeur = 0;
let iwdaPriceAll = 0;

const tableIWDAEl = document.querySelector('#table-iwda');


// IS3N var
let btnAddIS3N = document.querySelector('#add-is3n');
let inputDateIS3NEl = document.querySelector('#date-is3n');
let inputPriceIS3NEl = document.querySelector('#input-price-is3n');
let inputCountIS3NEl = document.querySelector('#input-count-is3n');
let inputPriceOneIS3NEl = document.querySelector('#input-priceOne-is3n');
let inputCurrIS3NEl = document.querySelector('#input-curr-is3n');
let inputFeeIS3NEl = document.querySelector('#input-fee-is3n');

const is3nusdEl = document.querySelector('#is3n-usd');
const is3nplnEl = document.querySelector('#is3n-pln');
const countIS3N = document.querySelector('#count-is3n');
const priceIS3N = document.querySelector('#price-is3n');
const valIS3N = document.querySelector('#val-is3n');
const avgBuyPLNIS3N = document.querySelector('#avg-buy-pln-is3n');
const avgBuyUSDIS3N = document.querySelector('#avg-buy-usd-is3n');

const deltaIS3NEl = document.querySelector('#delta-is3n');
const colorIS3NEl = document.querySelector('#color-is3n');

let is3nVal = 0;
let is3nCount = 0;
let is3nusd = 0;
let is3nPriceAll = 0;

const tableIS3NEl = document.querySelector('#table-is3n');

// mwig40tr var
let btnAddMWIG40TR = document.querySelector('#add-mwig40tr');
let inputDateMWIG40TREl = document.querySelector('#date-mwig40tr');
let inputPriceMWIG40TREl = document.querySelector('#input-price-mwig40tr');
let inputCountMWIG40TREl = document.querySelector('#input-count-mwig40tr');
let inputPriceOneMWIG40TREl = document.querySelector('#input-priceOne-mwig40tr');
let inputFeeMWIG40TREl = document.querySelector('#input-fee-mwig40tr');

const mwig40trplnEl = document.querySelector('#mwig40tr-pln');
const countMWIG40TR = document.querySelector('#count-mwig40tr');
const priceMWIG40TR = document.querySelector('#price-mwig40tr');
const valMWIG40TR = document.querySelector('#val-mwig40tr');
const avgBuyPLNMWIG40TR = document.querySelector('#avg-buy-pln-mwig40tr');

const deltaMWIG40TREl = document.querySelector('#delta-mwig40tr');
const colorMWIG40TREl = document.querySelector('#color-mwig40tr');

let mwig40trVal = 0;
let mwig40trCount = 0;
let mwig40trpln = 0;
let mwig40trPriceAll = 0;

const tableMWIG40TREl = document.querySelector('#table-mwig40tr');

// other
let structure;

// Waluty
let gbppln, usdpln, eurpln;

const getETFVal = function  () {
  document.getElementById('etf-sum').innerText = swdaVal + is3nVal + mwig40trVal + iwdaVal;
  return swdaVal + is3nVal + mwig40trVal + iwdaVal;
}

const redrawChart = function () {
  google.charts.load("current", {packages:["corechart"]});
  google.charts.setOnLoadCallback(drawChart);
  function drawChart() {
    var data = google.visualization.arrayToDataTable([
      ['Rynki', 'Wartość'],
      ['Rynki rozwinięte',          swdaVal+iwdaVal],
      ['Rynki wschodzące',      is3nVal+mwig40trVal]
    ]);

    var options = {
      is3D: true
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart_etf'));
    chart.draw(data, options);
  }
}

const updateTableSWDA = function () {
  let html = '';
  swdaCount = swdaPriceAll = swdaVal = 0;
  swda.forEach(el => {
    html += `<tr><td>${el.data}</td><td>${el.cena} zł</td><td>${el.ilosc}</td><td>${el.cenaJedn} £</td><td>${el.kursGBP} zł</td><td>${el.prowizja} zł</td></tr>`;
    swdaCount += Number(el.ilosc);
    swdaPriceAll += Number(el.cena);
  });
  swdaVal = Math.round(swdaCount * swdagbp * gbppln*100)/100;
  priceSWDA.textContent = swdaPriceAll;
  countSWDA.textContent = swdaCount;
  if (swdaPriceAll === 0) swdaCount = 1;
  avgBuyPLNSWDA.textContent = Math.round(swdaPriceAll / swdaCount * 100)/100;
  avgBuyGBPSWDA.textContent = Math.round(Number(avgBuyPLNSWDA.textContent) / gbppln*100)/100;
  valSWDA.textContent = swdaVal;

  let delta = Math.round((swdaVal/swdaPriceAll-1)*10000)/100;
  if (swdaVal > swdaPriceAll) {
    deltaSWDAEl.textContent = `+${delta}%`;
    colorSWDAEl.style.color = 'green';
  } else {
    deltaSWDAEl.textContent = `${delta}%`;
    colorSWDAEl.style.color = 'red';
  }

  structure.etf = getETFVal();
  fetch('http://localhost:8000/update-structure', {
    method: 'POST',
    body: JSON.stringify(structure),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    }
    }).then(res => {}).catch(error => console.error('Error:', error));
    html += `<tr class="no-border-td">
      <td><input class="input-fill" id="date-swda" type="date" required></td>
      <td><input class="input-fill-short" id="input-price-swda" type="number" required></td>
      <td><input class="input-fill-short" id="input-count-swda" type="number" required></td>
      <td><input class="input-fill-short" id="input-priceOne-swda" type="number" required></td>
      <td><input class="input-fill-short" id="input-curr-swda" type="number" required></td>
      <td><input class="input-fill-short-last" id="input-fee-swda" type="number" required><button onclick="addSWDA()" class="btn-add" id="add-swda">+</button></td>
    </tr>`;
    tableSWDAEl.innerHTML = html;
    swdagbpEl = document.querySelector('#swda-gbp');
    swdaplnEl = document.querySelector('#swda-pln');
    countSWDA = document.querySelector('#count-swda');
    priceSWDA = document.querySelector('#price-swda');
    valSWDA = document.querySelector('#val-swda');
    avgBuyPLNSWDA = document.querySelector('#avg-buy-pln-swda');
    avgBuyGBPSWDA = document.querySelector('#avg-buy-gbp-swda');
};

//////////////////////////
const updateTableIWDA = function () {
  let html = '';
  iwdaCount = iwdaPriceAll = iwdaVal = 0;
  iwda.forEach(el => {
    html += `<tr><td>${el.data}</td><td>${el.cena} zł</td><td>${el.ilosc}</td><td>${el.cenaJedn} £</td><td>${el.kursEUR} zł</td><td>${el.prowizja} zł</td></tr>`;
    iwdaCount += Number(el.ilosc);
    iwdaPriceAll += Number(el.cena);
  });
  iwdaVal = Math.round(iwdaCount * iwdaeur * eurpln*100)/100;
  priceIWDA.textContent = iwdaPriceAll;
  countIWDA.textContent = iwdaCount;
  if (iwdaPriceAll === 0) iwdaCount = 1;
  avgBuyPLNIWDA.textContent = Math.round(iwdaPriceAll / iwdaCount * 100)/100;
  avgBuyEURIWDA.textContent = Math.round(Number(avgBuyPLNIWDA.textContent) / eurpln*100)/100;
  valIWDA.textContent = iwdaVal;

  let delta = Math.round((iwdaVal/iwdaPriceAll-1)*10000)/100;
  if (iwdaVal > iwdaPriceAll) {
    deltaIWDAEl.textContent = `+${delta}%`;
    colorIWDAEl.style.color = 'green';
  } else {
    deltaIWDAEl.textContent = `${delta}%`;
    colorIWDAEl.style.color = 'red';
  }

  structure.etf = getETFVal();
  fetch('http://localhost:8000/update-structure', {
    method: 'POST',
    body: JSON.stringify(structure),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    }
    }).then(res => {}).catch(error => console.error('Error:', error));
    html += `<tr class="no-border-td">
      <td><input class="input-fill" id="date-iwda" type="date" required></td>
      <td><input class="input-fill-short" id="input-price-iwda" type="number" required></td>
      <td><input class="input-fill-short" id="input-count-iwda" type="number" required></td>
      <td><input class="input-fill-short" id="input-priceOne-iwda" type="number" required></td>
      <td><input class="input-fill-short" id="input-curr-iwda" type="number" required></td>
      <td><input class="input-fill-short-last" id="input-fee-iwda" type="number" required><button onclick="addIWDA()" class="btn-add" id="add-iwda">+</button></td>
    </tr>`;
    tableIWDAEl.innerHTML = html;
    btnAddIWDA = document.querySelector('#add-iwda');
    inputDateIWDAEl = document.querySelector('#date-iwda');
    inputPriceIWDAEl = document.querySelector('#input-price-iwda');
    inputCountIWDAEl = document.querySelector('#input-count-iwda');
    inputPriceOneIWDAEl = document.querySelector('#input-priceOne-iwda');
    inputCurrIWDAEl = document.querySelector('#input-curr-iwda');
    inputFeeIWDAEl = document.querySelector('#input-fee-iwda');
};
////////////////////////// END

const updateTableIS3N = function () {
  let html = '';
  is3nCount = is3nPriceAll = is3nVal = 0;
  is3n.forEach(el => {
    html += `<tr><td>${el.data}</td><td>${el.cena} zł</td><td>${el.ilosc}</td><td>${el.cenaJedn} EUR</td><td>${el.kursGBP} zł</td><td>${el.prowizja} zł</td></tr>`;
    is3nCount += Number(el.ilosc);
    is3nPriceAll += Number(el.cena);
  });
  is3nVal = Math.round(is3nCount * is3nusd * eurpln*100)/100;
  priceIS3N.textContent = is3nPriceAll;
  countIS3N.textContent = is3nCount;
  if (is3nPriceAll === 0) is3nCount = 1;
  avgBuyPLNIS3N.textContent = Math.round(is3nPriceAll / is3nCount * 100)/100;
  avgBuyUSDIS3N.textContent = Math.round(Number(avgBuyPLNIS3N.textContent) / eurpln*100)/100;
  valIS3N.textContent = is3nVal;

  let delta = Math.round((is3nVal/is3nPriceAll-1)*10000)/100;
  if (is3nVal > is3nPriceAll) {
    deltaIS3NEl.textContent = `+${delta}%`;
    colorIS3NEl.style.color = 'green';
  } else {
    deltaIS3NEl.textContent = `${delta}%`;
    colorIS3NEl.style.color = 'red';
  }

  structure.etf = getETFVal();
  fetch('http://localhost:8000/update-structure', {
    method: 'POST',
    body: JSON.stringify(structure),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    }
    }).then(res => {}).catch(error => console.error('Error:', error));
    html += `<tr class="no-border-td">
      <td><input class="input-fill" id="date-is3n" type="date" required></td>
      <td><input class="input-fill-short" id="input-price-is3n" type="number" required></td>
      <td><input class="input-fill-short" id="input-count-is3n" type="number" required></td>
      <td><input class="input-fill-short" id="input-priceOne-is3n" type="number" required></td>
      <td><input class="input-fill-short" id="input-curr-is3n" type="number" required></td>
      <td><input class="input-fill-short-last" id="input-fee-is3n" type="number" required><button onclick="addIS3N()" class="btn-add" id="add-is3n">+</button></td>
    </tr>`;
    tableIS3NEl.innerHTML = html;
    btnAddIS3N = document.querySelector('#add-is3n');
    inputDateIS3NEl = document.querySelector('#date-is3n');
    inputPriceIS3NEl = document.querySelector('#input-price-is3n');
    inputCountIS3NEl = document.querySelector('#input-count-is3n');
    inputPriceOneIS3NEl = document.querySelector('#input-priceOne-is3n');
    inputCurrIS3NEl = document.querySelector('#input-curr-is3n');
    inputFeeIS3NEl = document.querySelector('#input-fee-is3n');
};

const updateTableMWIG40TR = function () {
  let html = '';
  mwig40trCount = mwig40trPriceAll = mwig40trVal = 0;
  mwig40tr.forEach(el => {
    html += `<tr><td>${el.data}</td><td>${el.cena} zł</td><td>${el.ilosc}</td><td>${el.cenaJedn} zł</td><td>${el.prowizja} zł</td></tr>`;
    mwig40trCount += Number(el.ilosc);
    mwig40trPriceAll += Number(el.cena);
  });
  mwig40trVal = Math.round(mwig40trCount * mwig40trpln*100)/100;
  priceMWIG40TR.textContent = mwig40trPriceAll;
  countMWIG40TR.textContent = mwig40trCount;
  if (mwig40trPriceAll === 0) mwig40trCount = 1;
  avgBuyPLNMWIG40TR.textContent = Math.round(mwig40trPriceAll / mwig40trCount * 100)/100;
  valMWIG40TR.textContent = mwig40trVal;

  let delta = Math.round((mwig40trVal/mwig40trPriceAll-1)*10000)/100;
  if (mwig40trVal > mwig40trPriceAll) {
    deltaMWIG40TREl.textContent = `+${delta}%`;
    colorMWIG40TREl.style.color = 'green';
  } else {
    deltaMWIG40TREl.textContent = `${delta}%`;
    colorMWIG40TREl.style.color = 'red';
  }

  structure.etf = getETFVal();
  fetch('http://localhost:8000/update-structure', {
    method: 'POST',
    body: JSON.stringify(structure),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    }
    }).then(res => {}).catch(error => console.error('Error:', error));
    html += `
    <tr class="no-border-td">
      <td><input class="input-fill" id="date-mwig40tr" type="date" required></td>
      <td><input class="input-fill-short" id="input-price-mwig40tr" type="number" required></td>
      <td><input class="input-fill-short" id="input-count-mwig40tr" type="number" required></td>
      <td><input class="input-fill-short" id="input-priceOne-mwig40tr" type="number" required></td>
      <td><input class="input-fill-short-last" id="input-fee-mwig40tr" type="number" required><button onclick="addMWIG40TR()" class="btn-add" id="add-mwig40tr">+</button></td>
    </tr>`;
    tableMWIG40TREl.innerHTML = html;
    btnAddMWIG40TR = document.querySelector('#add-mwig40tr');
    inputDateMWIG40TREl = document.querySelector('#date-mwig40tr');
    inputPriceMWIG40TREl = document.querySelector('#input-price-mwig40tr');
    inputCountMWIG40TREl = document.querySelector('#input-count-mwig40tr');
    inputPriceOneMWIG40TREl = document.querySelector('#input-priceOne-mwig40tr');
    inputFeeMWIG40TREl = document.querySelector('#input-fee-mwig40tr');
};


let swda = [];
let iwda = [];
let is3n = [];
let mwig40tr = [];

fetch('http://localhost:8000/structure').then(response => response.json()).then(data => {
  structure = data;
  fetch('http://localhost:8000/etf').then(response => response.json()).then(data => {
  data.forEach(etf => {
    if (etf.etfSymbol === 'SWDA') {
      swdagbp = Math.round(Number(etf.data.value)) / 100;
      swdagbpEl.textContent = swdagbp;
    } else if (etf.etfSymbol === 'IWDA') {
      iwdaeur = Math.round(Number(etf.data.value)*100) / 100;
      iwdaeurEl.textContent = iwdaeur;
    } else if (etf.etfSymbol === 'IS3N') {
      is3nusd = Math.round(Number(etf.data.value)*100) / 100;
      is3nusdEl.textContent = is3nusd;
    } else if (etf.etfSymbol === 'ETFBM40TR') {
      mwig40trpln = Math.round(Number(etf.data.value)*100) / 100;
      mwig40trplnEl.textContent = mwig40trpln;
    }
    fetch('https://api.nbp.pl/api/exchangerates/tables/A/?format=json').then(response => response.json()).then(data => {
      data[0].rates.forEach(rate => {
        if (rate.code === 'GBP') {
          gbppln = Number(rate.mid);
          document.querySelector('#gbppln').textContent = Math.round(gbppln*100)/100;
          swdaplnEl.textContent = Math.round(gbppln*swdagbp*100)/100;
        } else if (rate.code === 'USD') {
          usdpln = Number(rate.mid);
          document.querySelector('#usdpln').textContent = Math.round(usdpln*100)/100;
        } else if (rate.code === 'EUR') {
          eurpln = Number(rate.mid);
          document.querySelector('#eurpln').textContent = Math.round(eurpln*100)/100;
          is3nplnEl.textContent = Math.round(eurpln*is3nusd*100)/100;
          iwdaplnEl.textContent = Math.round(eurpln*iwdaeur*100)/100;
        }
      });
      fetch('http://localhost:8000/history-etf-swda').then(response => response.json()).then(data => {
        swda = data;
        updateTableSWDA();

        fetch('http://localhost:8000/history-etf-iwda').then(response => response.json()).then(data => {
        iwda = data;
        updateTableIWDA();

        fetch('http://localhost:8000/history-etf-is3n').then(response => response.json()).then(data => {
        is3n = data;
        updateTableIS3N();

          fetch('http://localhost:8000/history-etf-mwig40tr').then(response => response.json()).then(data => {
            mwig40tr = data;
            updateTableMWIG40TR();
            redrawChart();
        }).catch(err => console.log(err));
      }).catch(err => console.log(err));
      }).catch(err => console.log(err));
    }).catch(err => console.log(err));
    }).catch(err => console.log(err));
  });
}).catch(err => console.log(err));
  
}).catch(err => console.log(err));

const btnAddSWDA = document.querySelector('#add-swda');
const inputDateSWDAEl = document.querySelector('#date-swda');
const inputPriceSWDAEl = document.querySelector('#input-price-swda');
const inputCountSWDAEl = document.querySelector('#input-count-swda');
const inputPriceOneSWDAEl = document.querySelector('#input-priceOne-swda');
const inputCurrSWDAEl = document.querySelector('#input-curr-swda');
const inputFeeSWDAEl = document.querySelector('#input-fee-swda');

function addSWDA() {
  swda.push({
    'data': inputDateSWDAEl.value, 
    'cena': inputPriceSWDAEl.value, 
    'ilosc': inputCountSWDAEl.value,
    'cenaJedn': inputPriceOneSWDAEl.value,
    'kursGBP': inputCurrSWDAEl.value,
    'prowizja': inputFeeSWDAEl.value
    });

    inputDateSWDAEl.value = inputPriceSWDAEl.value = inputCountSWDAEl.value = inputPriceOneSWDAEl.value = inputCurrSWDAEl.value = inputFeeSWDAEl.value = '';
  
  fetch('http://localhost:8000/update-etf-swda', {
    method: 'POST',
    body: JSON.stringify(swda),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    }
    }).then(res => {updateTableSWDA();redrawChart();}).catch(error => console.error('Error:', error));
}

function addIWDA() {
  iwda.push({
    'data': inputDateIWDAEl.value, 
    'cena': inputPriceIWDAEl.value, 
    'ilosc': inputCountIWDAEl.value,
    'cenaJedn': inputPriceOneIWDAEl.value,
    'kursEUR': inputCurrIWDAEl.value,
    'prowizja': inputFeeIWDAEl.value
    });

    inputDateIWDAEl.value = inputPriceIWDAEl.value = inputCountIWDAEl.value = inputPriceOneIWDAEl.value = inputCurrIWDAEl.value = inputFeeIWDAEl.value = '';
  
  fetch('http://localhost:8000/update-etf-iwda', {
    method: 'POST',
    body: JSON.stringify(iwda),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    }
    }).then(res => {updateTableIWDA();redrawChart();}).catch(error => console.error('Error:', error));
}

function addIS3N() {
  is3n.push({
    'data': inputDateIS3NEl.value, 
    'cena': inputPriceIS3NEl.value, 
    'ilosc': inputCountIS3NEl.value,
    'cenaJedn': inputPriceOneIS3NEl.value,
    'kursGBP': inputCurrIS3NEl.value,
    'prowizja': inputFeeIS3NEl.value
    });

    inputDateIS3NEl.value = inputPriceIS3NEl.value = inputCountIS3NEl.value = inputPriceOneIS3NEl.value = inputCurrIS3NEl.value = inputFeeIS3NEl.value = '';
  
  fetch('http://localhost:8000/update-etf-is3n', {
    method: 'POST',
    body: JSON.stringify(is3n),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    }
    }).then(res => {updateTableIS3N();redrawChart();}).catch(error => console.error('Error:', error));
}

function addMWIG40TR() {
  mwig40tr.push({
    'data': inputDateMWIG40TREl.value, 
    'cena': inputPriceMWIG40TREl.value, 
    'ilosc': inputCountMWIG40TREl.value,
    'cenaJedn': inputPriceOneMWIG40TREl.value,
    'prowizja': inputFeeMWIG40TREl.value
    });

    inputDateMWIG40TREl.value = inputPriceMWIG40TREl.value = inputCountMWIG40TREl.value = inputPriceOneMWIG40TREl.value = inputFeeMWIG40TREl.value = '';
  
  fetch('http://localhost:8000/update-etf-mwig40tr', {
    method: 'POST',
    body: JSON.stringify(mwig40tr),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    }
    }).then(res => {updateTableMWIG40TR();redrawChart();}).catch(error => console.error('Error:', error));
};