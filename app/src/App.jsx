import { Routes, Route } from 'react-router-dom';
import React from 'react';
import Navbar from "./components/Navbar.jsx"
import StructurePage from "./StructurePage.jsx"
import BondsPage from './BondsPage.jsx'
import ETFPage from './ETFPage.jsx';
import GoldPage from './GoldPage.jsx';
import CryptoPage from './CryptoPage.jsx';
import './style/App.css'

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
      
      let _accumulatedCount = {}
      let _investedValue = {}
      let _price = {}

      for (const category of Object.keys(_wallet)) {
        if (!_accumulatedCount[category]) {
          _accumulatedCount[category] = {};
          _price[category] = {};
          _investedValue[category] = 0;
        }
    
        for (const name of Object.keys(_wallet[category])) {
          if (category !== "bond") {
            _price[category][name] = await fetch(`http://localhost:8000/value/${name}`).then(response => response.json());

            if (!_accumulatedCount[category][name]) {
              _accumulatedCount[category][name] = [];
            }
  
            let acc = 0;
            _wallet[category][name]["entries"].forEach((entry) => {
              _accumulatedCount[category][name].push({ "date": entry["date"], "count": acc + entry["count"] });
              acc += entry["count"];
            });
          }
          _wallet[category][name]["entries"].forEach((entry) => {
            _investedValue[category] += (entry["price"] ? entry["price"] : entry["count"] * entry["unitPrice"]) + (entry["fee"] ? entry["fee"] : 0);
          });
        }
      }
      setPrice(_price);
      setAccumulatedCount(_accumulatedCount);
      setWallet(_wallet);
      setExchangeRates({..._exchangeRates, 'PLN': 1});
      setInvestedValue(_investedValue);
      setInitialized(true);
    }

    make_fetch();
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
          <Route path="/" element={initialized ? <StructurePage investedValue={investedValue} wallet={wallet} price={price} exchangeRates={exchangeRates} accumulatedCount={accumulatedCount} /> : <></>} />
          <Route path="/obligacje" element={<BondsPage />} />
          <Route path="/etf" element={<ETFPage />} />
          <Route path="/zloto" element={<GoldPage />} />
          <Route path="/kryptowaluty" element={<CryptoPage />} />
       </Routes>
    </>
  )
}

export default App
