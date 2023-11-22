const btnAdd = document.querySelector('#add');
const tableEl = document.querySelector('#table-zloto');
const currValEl = document.querySelector('#curr-val');
const xauplnSpotEl = document.querySelector('#xaupln-spot');
const xauplnBuyEl = document.querySelector('#xaupln');
const xauplnEl = document.querySelector('#xaupln');
const avgPriceEl = document.querySelector('#avg-buy');
const countEl = document.querySelector('#xau-mass');
const priceAllEl = document.querySelector('#xau-price');

const deltaEl = document.querySelector('#delta');
const colorEl = document.querySelector('#color');

let structure;
let zlotoVal = 0;
let zlotoMass = 0;
let XAUPLN = 0;

let priceAll = 0;

const updateTable = function () {
  let html = '';
  zlotoVal = 0;
  zlotoMass = 0;
  priceAll = 0;
  zloto.forEach(el => {
    html += `<tr><td>${el.zakup}</td><td>${el.masa}</td><td>${el.cenaOZ} zł</td></tr>`;
    zlotoVal += Number(el.masa) * XAUPLN;
    zlotoMass += Number(el.masa);
    priceAll += Number(el.masa) * Number(el.cenaOZ);
  });
  countEl.textContent = zlotoMass;
  currValEl.textContent = Math.round(zlotoVal*100)/100;
  avgPriceEl.textContent = Math.round(priceAll/zlotoMass*100)/100;
  priceAllEl.textContent = priceAll;
  if (zlotoVal > priceAll) {
    let delta = Math.round((zlotoVal/priceAll-1)*10000)/100;
    deltaEl.textContent = `+${delta}%`;
    colorEl.style.color = 'green';
  } else {
    let delta = Math.round((zlotoVal/priceAll-1)*10000)/100;
    deltaEl.textContent = `${delta}%`;
    colorEl.style.color = 'red';
  }
  structure.zloto = zlotoVal;
  fetch('http://localhost:8000/update-structure', {
    method: 'POST',
    body: JSON.stringify(structure),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    }
    }).then(res => {}).catch(error => console.error('Error:', error));
  html += `<tr class="no-border-td">
    <td><input id="date" class="input-fill" type="date" required></td>
    <td><input id="mass" class="input-fill-short" type="number" required></td>
    <td><input id="price" class="input-fill-short-last" type="number"><button onclick="add()" class="btn-add" id="add">+</button></td>
  </tr>`;
  tableEl.innerHTML = html;
};

let zloto = [];

fetch('http://localhost:8000/structure').then(response => response.json()).then(data => {
  structure = data;
  fetch('http://localhost:8000/xaupln').then(response => response.json()).then(data => {
  XAUPLN = Number(data.value)*1.049;
  xauplnSpotEl.textContent = data.value;
  xauplnBuyEl.textContent = XAUPLN;
  fetch('http://localhost:8000/history-zloto').then(response => response.json()).then(data => {
  zloto = data;
  updateTable();
}).catch(err => console.log(err));
}).catch(err => console.log(err));
  
}).catch(err => console.log(err));

function add() {
  const dateEl = document.querySelector('#date');
  const massEl = document.querySelector('#mass');
  const priceEl = document.querySelector('#price');
  if (!dateEl.value || !massEl.value || !priceEl.value) return;
  zloto.push({
  'zakup': dateEl.value, 
  'masa': massEl.value, 
  'cenaOZ': priceEl.value
  });
  
  dateEl.value = massEl.value = priceEl.value = '';
  
  fetch('http://localhost:8000/update-zloto', {
    method: 'POST',
    body: JSON.stringify(zloto),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    }
  }).then(res => updateTable()).catch(error => console.error('Error:', error));
}