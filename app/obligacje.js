const btnAdd = document.querySelector('#add');
const dateEl = document.querySelector('#date');
const countEl = document.querySelector('#count');

const tableEl = document.querySelector('#table-obligacje');
const oblValEl = document.querySelector('#obl-val');

let obligacjeVal;

let structure;

const getCurrValue = function (pos) {
  const now = new Date();
  const start = new Date(obligacje[pos].zakup);
  const difference = now.getTime() - start.getTime();
  let years = Math.ceil(difference / (1000 * 3600 * 24)) / 365.25;

  let currValue = obligacje[pos].wartoscPocz;
  let i = 1;
  while (years > 1) {
    const opr = obligacje[pos][`opr${i}`] != '' ? Number(obligacje[pos][`opr${i}`])/100+1 : 1;
    currValue *= opr;
    years--;
    i++;
  }
  const opr = obligacje[pos][`opr${i}`] != '' ? Number(obligacje[pos][`opr${i}`])/100*years+1 : 1;
  currValue *= opr;
  return Math.round(currValue*100)/100;
};

const updateTable = function () {
  let html = '';
  let pos = 0;
  obligacjeVal = 0;
  obligacje.forEach(el => {
    html += `<tr><td>${el.zakup}</td><td>${el.ilosc}</td><td>${el.wartoscPocz} zł</td>`;
    for (let i = 1; i <= 10; i++) {
      html += `<td><form><input onchange="changeVal(${pos}, 'opr${i}', this)" class="input-opr" type="number" value="${el[`opr${i}`]}"> %</form></td>`
    }
      currVal = getCurrValue(pos);
      obligacjeVal += currVal;
      html += `<td>${currVal} zł</td><td>${el.wykup}</td></tr>`;
    pos++;
  });
  oblValEl.textContent = obligacjeVal;
  structure.obligacje = obligacjeVal;
  fetch('http://localhost:8000/update-structure', {
    method: 'POST',
    body: JSON.stringify(structure),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    }
    }).then(res => {}).catch(error => console.error('Error:', error));
    tableEl.innerHTML = html;
};

let obligacje = [];

fetch('http://localhost:8000/structure').then(response => response.json()).then(data => {
  structure = data;
  fetch('http://localhost:8000/history-obligacje').then(response => response.json()).then(data => {
  obligacje = data;
  updateTable();
}).catch(err => console.log(err));
}).catch(err => console.log(err));


function changeVal(pos, fieldname, input) {
  obligacje[pos][fieldname] = input.value;
  fetch('http://localhost:8000/update-obligacje', {
      method: 'POST',
      body: JSON.stringify(obligacje),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      }
      }).then(res => updateTable()).catch(error => console.error('Error:', error));
}

btnAdd.addEventListener('click', function () {
  if(dateEl.value && countEl.value) {
    let temp = dateEl.value.substring(0, 2) + (Number(dateEl.value.substring(2, 4))+10) + dateEl.value.substring(4);
    obligacje.push({
      'zakup': dateEl.value, 
      'ilosc': countEl.value, 
      'wartoscPocz': Number(countEl.value)*100, 
      'opr1': '',
      'opr2': '',
      'opr3': '',
      'opr4': '',
      'opr5': '',
      'opr6': '',
      'opr7': '',
      'opr8': '',
      'opr9': '',
      'opr10': '',
      'wykup': temp});
    
    dateEl.value = countEl.value = '';
    
    fetch('http://localhost:8000/update-obligacje', {
      method: 'POST',
      body: JSON.stringify(obligacje),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      }
      }).then(res => updateTable()).catch(error => console.error('Error:', error));
  }
});