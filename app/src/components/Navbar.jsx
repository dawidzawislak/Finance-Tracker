import '../style/Navbar.css'
import logo from '../assets/logo.png'
import { NavLink } from 'react-router-dom'

function Navbar() {

    return (
        <header className="header">
            <div className="logo">
                <img className="logo-img" src={logo} alt="Logo" />
                <span className="logo-text"><span className="accent-text">F</span>INAN<span className="accent-text">CES</span></span>
            </div>
            <nav className="nav">
                <ul className="nav-list">
                    <li className="nav-link"><NavLink to="/" className="nav-link nav-link--active">Summary</NavLink></li>
                    <li className="nav-link"><NavLink to="/bonds" className="nav-link">Bonds</NavLink></li>
                    <li className="nav-link"><NavLink to="/etf" className="nav-link">ETFs</NavLink></li>
                    <li className="nav-link"><NavLink to="/commodities" className="nav-link">Commodities</NavLink></li>
                    <li className="nav-link"><NavLink to="/crypto" className="nav-link">Cryptocurrencies</NavLink></li>
                </ul>
            </nav>
        </header>
    )
}

export default Navbar