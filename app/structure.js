google.charts.load("current", {packages:["corechart"]});

let structure = [];

fetch('http://localhost:8000/structure').then(response => response.json()).then(data => {
  structure = data;
  document.querySelector('#val').textContent = Math.round(Number(structure.obligacje + structure.etf + structure.zloto + structure.kryptowaluty)*100)/100 + 'zł';
}).catch(err => console.log(err));

google.charts.setOnLoadCallback(drawChart);
function drawChart() {
  var data = google.visualization.arrayToDataTable([
    ['Instrument', 'Wartość'],
    ['Obligacje',     structure.obligacje],
    ['ETFy',      structure.etf],
    ['Złoto',  structure.zloto],
    ['Kryptowaluty', structure.kryptowaluty]
  ]);

  var options = {
    is3D: true
  };

  var chart = new google.visualization.PieChart(document.getElementById('piechart_curr'));
  chart.draw(data, options);
}

google.charts.setOnLoadCallback(drawChart2);
function drawChart2() {
  var data = google.visualization.arrayToDataTable([
    ['Instrument', 'Wartość'],
    ['Obligacje',     40],
    ['ETFy',      40],
    ['Złoto',  10],
    ['Kryptowaluty', 10]
  ]);

  var options = {
    is3D: true
  };

  var chart = new google.visualization.PieChart(document.getElementById('piechart_model'));
  chart.draw(data, options);
}