const PORT = 8000;

const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const { log } = require('console');

const app = express();
app.use(cors());
app.use(bodyParser.json())

let etfHoldings = [];
let bitcoinUSD = 0;
let XAUPLN = 0;
// Waluty załatwie fetch we frontendzie

let NUM_OF_ETFS;
let downloadedEtfsCount = 0;

const getEtfData = function(url, res) {
  axios(url).then(response => {
    const html = response.data;
    const $ = cheerio.load(html);
  
    let etfName, value, when, curr, etfSymbol;
    let vset = false;

    $('.font-bold', html).each(function () {
      let v = $(this).text().trim();
      v = v.replace('.', '');
      v = v.replace(',', '.');
      const regex = '^[0-9]+.[0-9]+$';
      if(vset == false && v.match(regex) != null) {
        value = v;
        vset = true;
      }
    });
    
    $('.text-xl.text-left.font-bold.leading-7', html).each(function () {
      etfName = $(this).text().trim();
      etfSymbol = etfName.substring(etfName.lastIndexOf('(')+1, etfName.lastIndexOf(')'));
    });
    // $('.flex.items-center.text-xs\/5.font-normal', html).each(function () {
    //   const t = $(this.children).text().trim()
    //   let start = t.indexOf("w  ")
    //   curr =  t.substring(start+3, start+6);
    //   return false
    // });
    // $('div.flex.items-center.p-0.gap-1.text-xs.leading-4.font-normal.text-\[\#5B616E\]', html).each(function () {
    //   const text = $(this).text().trim();
    //   let end = text.indexOf('</time>');
    //   const start = text.indexOf(">", end-15);
    //   when = text.substring(start+1, end);
    // });
    when = '';
    curr = '';
  
    etfHoldings.push({
      etfSymbol,
      'data': {
        etfName,
        value,
        curr,
        when
      }
    });
    downloadedEtfsCount++;

    if (downloadedEtfsCount === NUM_OF_ETFS) res.json(etfHoldings);
  
  }).catch(err => console.log(err));
};

const getBTCData = function(res) {
  axios('https://pl.investing.com/crypto/bitcoin').then(response => {
    const html = response.data;
    const $ = cheerio.load(html);
  
    let value, when;
  
    let vset = false;

    $('.font-bold', html).each(function () {
      let v = $(this).text().trim();
      v = v.replace('.', '');
      v = v.replace(',', '.');
      const regex = '^[0-9]+.[0-9]+$';
      if(vset == false && v.match(regex) != null) {
        value = v;
        vset = true;
      }
    });

    // $('.bottom.lighterGrayFont.arial_11', html).each(function () {
    //   const text = $(this).text().trim();
    //   when = text.split(' ')[0];
    // });

    when = '';
    
    bitcoinUSD = {
      value,
      when
    };

    res.json(bitcoinUSD);
  
  }).catch(err => console.log(err));
};

const getXAUData = function(res) {
  axios('https://pl.investing.com/currencies/xau-pln').then(response => {
    const html = response.data;
    const $ = cheerio.load(html);
  
    let value, when;
  
    $('[data-test=instrument-price-last]', html).each(function () {
      value = $(this).text().trim().substring(0, 8);
      value = value.replace('.', '');
      value = value.replace(',', '.');
    });
    let flag = false;
    $('.instrument-metadata_instrument-metadata__kgEl3', html).each(function () {
      if (!flag) {
        const text = $(this).text().trim();
        let t = text.indexOf('-');
        when = text.substring(0, t);
        flag = true;
      }
    });
    
    XAUPLN = {
      value,
      when
    };
    res.json(XAUPLN);
  
  }).catch(err => console.log(err));
};

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));

app.get('/etf', (req, res) => {
  NUM_OF_ETFS = 4;
  downloadedEtfsCount = 0;
  etfHoldings = [];
  getEtfData('https://pl.investing.com/etfs/ishares-core-msci-em-imi?cid=994133', res);
  getEtfData('https://pl.investing.com/etfs/ishares-msci-world---acc?cid=47285', res);
  getEtfData('https://pl.investing.com/etfs/ishares-msci-world---acc?cid=995447', res);
  getEtfData('https://pl.investing.com/etfs/beta-etf-mwig40tr-portfelowy-fiz', res);
});

app.get('/xaupln', (req, res) => {
  getXAUData(res);
});

app.get('/btcusd', (req, res) => {
  getBTCData(res);
});

app.post('/update-etf-swda', (req, res) => {
  const data = JSON.stringify(req.body);
  fs.writeFileSync('etf-swda.json', data);
  res.end();
});

app.post('/update-etf-iwda', (req, res) => {
  const data = JSON.stringify(req.body);
  fs.writeFileSync('etf-iwda.json', data);
  res.end();
});

app.post('/update-etf-is3n', (req, res) => {
  const data = JSON.stringify(req.body);
  fs.writeFileSync('etf-is3n.json', data);
  res.end();
});

app.post('/update-etf-mwig40tr', (req, res) => {
  const data = JSON.stringify(req.body);
  fs.writeFileSync('etf-mwig40tr.json', data);
  res.end();
});

app.post('/update-obligacje', (req, res) => {
  const data = JSON.stringify(req.body);
  fs.writeFileSync('obligacje.json', data);
  res.end();
});

app.post('/update-zloto', (req, res) => {
  const data = JSON.stringify(req.body);
  fs.writeFileSync('zloto.json', data);
  res.end();
});

app.post('/update-kryptowaluty-free', (req, res) => {
  const data = JSON.stringify(req.body);
  fs.writeFileSync('kryptowaluty-free.json', data);
  res.end();
});

app.post('/update-kryptowaluty-btc', (req, res) => {
  const data = JSON.stringify(req.body);
  fs.writeFileSync('kryptowaluty-btc.json', data);
  res.end();
});

app.post('/update-structure', (req, res) => {
  const data = JSON.stringify(req.body);
  fs.writeFileSync('structure.json', data);
  res.end();
});

app.get('/history-obligacje', (req, res) => {
  const rawdata = fs.readFileSync('obligacje.json');
  const data = JSON.parse(rawdata);
  res.json(data);
});

app.get('/kryptowaluty-free', (req, res) => {
  const rawdata = fs.readFileSync('kryptowaluty-free.json');
  const data = JSON.parse(rawdata);
  res.json(data);
});

app.get('/history-etf-swda', (req, res) => {
  const rawdata = fs.readFileSync('etf-swda.json');
  const data = JSON.parse(rawdata);
  res.json(data);
});

app.get('/history-etf-iwda', (req, res) => {
  const rawdata = fs.readFileSync('etf-iwda.json');
  const data = JSON.parse(rawdata);
  res.json(data);
});

app.get('/history-kryptowaluty-btc', (req, res) => {
  const rawdata = fs.readFileSync('kryptowaluty-btc.json');
  const data = JSON.parse(rawdata);
  res.json(data);
});

app.get('/history-etf-is3n', (req, res) => {
  const rawdata = fs.readFileSync('etf-is3n.json');
  const data = JSON.parse(rawdata);
  res.json(data);
});

app.get('/history-etf-mwig40tr', (req, res) => {
  const rawdata = fs.readFileSync('etf-mwig40tr.json');
  const data = JSON.parse(rawdata);
  res.json(data);
});

app.get('/history-zloto', (req, res) => {
  const rawdata = fs.readFileSync('zloto.json');
  const data = JSON.parse(rawdata);
  res.json(data);
});

app.get('/structure', (req, res) => {
  const rawdata = fs.readFileSync('structure.json');
  const data = JSON.parse(rawdata);
  res.json(data);
});