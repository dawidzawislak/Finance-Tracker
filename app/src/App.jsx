import { Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar.jsx"
import StructurePage from "./StructurePage.jsx"
import BondsPage from './BondsPage.jsx'
import ETFPage from './ETFPage.jsx';
import GoldPage from './GoldPage.jsx';
import CryptoPage from './CryptoPage.jsx';
import './style/App.css'

function App() {

  return (
    <>
      <Navbar />
      <Routes>
          <Route path="/" element={<StructurePage />} />
          <Route path="/obligacje" element={<BondsPage />} />
          <Route path="/etf" element={<ETFPage />} />
          <Route path="/zloto" element={<GoldPage />} />
          <Route path="/kryptowaluty" element={<CryptoPage />} />
       </Routes>
    </>
  )
}

export default App
