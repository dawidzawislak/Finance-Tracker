let freePLN, freeEUR;
let freePLNEl = document.querySelector('#free-pln');
let freeEUREl = document.querySelector('#free-eur');

// BTC
const tableBTCEl = document.querySelector('#table-btc');
const dateBTCEl = document.querySelector('#date-btc');
const priceBTCEl = document.querySelector('#price-btc');
const countproBTCEl = document.querySelector('#countpro-btc');
const proBTCEl = document.querySelector('#pro-btc');
const btnAddBTC = document.querySelector('#add-btc');

const btcCountEl = document.querySelector('#btc-count');
const btcCurrValEl = document.querySelector('#btc-curr-val');
const btcPriceAllEl = document.querySelector('#btc-price');
const btcAvgBuyEl = document.querySelector('#btc-avg-buy');
const btcplnEl = document.querySelector('#btc-pln');

const deltaBTCEl = document.querySelector('#btc-delta');
const colorBTCEl = document.querySelector('#btc-color');

let btcVal, btcCount, priceAllBTC, btcpln, btcusd, btcAvgBuy, btcCurrVal = 0;

let structure;

fetch('http://localhost:8000/kryptowaluty-free').then(response => response.json()).then(data => {
  freePLN = data.PLN;
  freeEUR = data.EUR;
  freePLNEl.value = freePLN;
  freeEUREl.value = freeEUR;
}).catch(err => console.log(err));

fetch('http://localhost:8000/structure').then(response => response.json()).then(data => {
  structure = data;
  fetch('http://localhost:8000/btcusd').then(response => response.json()).then(data => {
  btcusd = data.value;
  fetch('https://api.nbp.pl/api/exchangerates/tables/A/?format=json').then(response => response.json()).then(data => {
  data[0].rates.forEach(rate => {
    if (rate.code === 'USD') {
      btcpln = Math.round(btcusd * Number(rate.mid)*100)/100;
      btcplnEl.textContent = btcpln.toLocaleString();
    }
  });
  fetch('http://localhost:8000/history-kryptowaluty-btc').then(response => response.json()).then(data => {
  btc = data;
  updateTableBTC();
}).catch(err => console.log(err));
}).catch(err => console.log(err));
}).catch(err => console.log(err));
}).catch(err => console.log(err));

const setFree = function () {
  freePLN = freePLNEl.value;
  freeEUR = freeEUREl.value;
  fetch('http://localhost:8000/update-kryptowaluty-free', {
    method: 'POST',
    body: JSON.stringify({"PLN": freePLN, "EUR": freeEUR}),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    }
  }).then(res => {}).catch(error => console.error('Error:', error));
};

let btc = [];

const updateTableBTC = function () {
  let html = '';
  btcVal = btcCount = priceAllBTC = 0;
  btc.forEach(el => {
    html += `<tr><td>${el.zakup}</td><td>${el.kwota} zł</td><td>${el.iloscpro} BTC</td><td>${el.prowizjabtc} BTC</td><td>${Number(el.kurs).toLocaleString()} zł</td><td>${el.ilosc} BTC</td><td>${el.prowizjapln} zł</td></tr>`;
    //btcVal += Number(el.ilosc) * btcpln;
    btcCount += Number(el.ilosc);
    priceAllBTC += Number(el.iloscpro) * Number(el.kurs);
  });
  
  btcCountEl.textContent = btcCount;
  btcPriceAllEl.textContent = Math.round(priceAllBTC*100)/100;
  btcAvgBuy = Math.round(priceAllBTC/btcCount*100)/100;
  btcAvgBuyEl.textContent = btcAvgBuy.toLocaleString();
  btcCurrVal = Math.round(btcCount * btcpln * 100)/100;
  btcCurrValEl.textContent = btcCurrVal.toLocaleString();

  if (btcCurrVal > priceAllBTC) {
    let delta = Math.round((btcCurrVal/priceAllBTC-1)*10000)/100;
    deltaBTCEl.textContent = `+${delta}%`;
    colorBTCEl.style.color = 'green';
  } else {
    let delta = Math.round((btcCurrVal/priceAllBTC-1)*10000)/100;
    deltaBTCEl.textContent = `${delta}%`;
    colorBTCEl.style.color = 'red';
  }

  structure.kryptowaluty = btcCurrVal;
  fetch('http://localhost:8000/update-structure', {
    method: 'POST',
    body: JSON.stringify(structure),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    }
    }).then(res => {}).catch(error => console.error('Error:', error));
    tableBTCEl.innerHTML = html;
};

btnAddBTC.addEventListener('click', function () {
  btc.push({
    'zakup': dateBTCEl.value, 
    'kwota': priceBTCEl.value, 
    'iloscpro': countproBTCEl.value, 
    'prowizjabtc':proBTCEl.value,
    'kurs':  Math.round(Number(priceBTCEl.value/countproBTCEl.value)*100)/100,
    'ilosc': countproBTCEl.value-proBTCEl.value,
    'prowizjapln': Math.round(Number(proBTCEl.value*priceBTCEl.value/countproBTCEl.value)*100)/100});
  
  dateBTCEl.value = priceBTCEl.value = countproBTCEl.value = proBTCEl.value = '';
  
  fetch('http://localhost:8000/update-kryptowaluty-btc', {
    method: 'POST',
    body: JSON.stringify(btc),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
    }).then(res => updateTableBTC()).catch(error => console.error('Error:', error));
});