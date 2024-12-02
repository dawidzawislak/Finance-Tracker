import { Routes, Route } from 'react-router-dom';
import React from 'react';
import Navbar from "./components/Navbar.jsx"
import StructurePage from "./StructurePage.jsx"
import BondsPage from './BondsPage.jsx'
import ETFPage from './ETFPage.jsx';
import GoldPage from './GoldPage.jsx';
import CryptoPage from './CryptoPage.jsx';
import Loader from './components/Loader.jsx';
import './style/App.css'
import './style/loader.css'

function App() {
  const [wallet, setWallet] = React.useState({})
  const [accumulatedCount, setAccumulatedCount] = React.useState({})
  const [price, setPrice] = React.useState({})
  const [exchangeRates, setExchangeRates] = React.useState({})
  const [investedValue, setInvestedValue] = React.useState({})
  const [initialized, setInitialized] = React.useState(false)

  React.useEffect(() => {
    const make_fetch = async () => {
      let _wallet = await fetch('http://localhost:8000/wallet').then(response => response.json())

      let _exchangeRates = await fetch('http://localhost:8000/exchange_rates').then(response => response.json())

      let _price = {}

      for (const category of Object.keys(_wallet)) {
        if (!_price[category]) {
          _price[category] = {};
        }

        for (const name of Object.keys(_wallet[category])) {
          if (category !== "bond") {
            _price[category][name] = await fetch(`http://localhost:8000/value/${name}`).then(response => response.json());
          }
        }
      }
      setPrice(_price);
      setWallet(_wallet);
      setExchangeRates(_exchangeRates);
      setInitialized(true);
    }

    make_fetch();
  }, []);

  React.useEffect(() => {
    if (!wallet) return;
    let _accumulatedCount = {}
    let _investedValue = {}

    for (const category of Object.keys(wallet)) {
      if (!_accumulatedCount[category]) {
        _accumulatedCount[category] = {};
        _investedValue[category] = 0;
      }

      for (const name of Object.keys(wallet[category])) {
        if (category !== "bond") {
          if (!_accumulatedCount[category][name]) {
            _accumulatedCount[category][name] = [];
          }

          let acc = 0;
          wallet[category][name]["entries"].forEach((entry) => {
            _accumulatedCount[category][name].push({ "date": entry["date"], "count": acc + entry["count"] });
            acc += entry["count"];
          });
        }
        wallet[category][name]["entries"].forEach((entry) => {
          _investedValue[category] += (entry["price"] ? entry["price"] : entry["count"] * entry["unitPrice"]) + (entry["fee"] ? entry["fee"] : 0);
        });
      }
    }
    setAccumulatedCount(_accumulatedCount);
    setInvestedValue(_investedValue);

  }, [wallet]);

  return (
    <>
      <Navbar />
      {initialized ? <Routes>
        <Route path="/" element={<StructurePage investedValue={investedValue} wallet={wallet} price={price} exchangeRates={exchangeRates} accumulatedCount={accumulatedCount} />} />
        <Route path="/bonds" element={<BondsPage wallet={wallet} setWallet={setWallet} />} />
        <Route path="/etf" element={<ETFPage wallet={wallet} setWallet={setWallet} exchangeRates={exchangeRates} price={price} />} />
        <Route path="/commodities" element={<GoldPage wallet={wallet} setWallet={setWallet} price={price} />} />
        <Route path="/crypto" element={<CryptoPage wallet={wallet} setWallet={setWallet} price={price} />} />
      </Routes> : <Loader />}
    </>
  )
}

export default App
