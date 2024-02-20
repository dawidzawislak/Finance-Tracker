import '../style/Navbar.css'
import logo from '../assets/logo.png'
import { NavLink } from 'react-router-dom'

function Navbar() {

    return (
        <header className="header">
            <div className="logo">
                <img className="logo-img" src={logo} alt="Logo" />
                <span className="logo-text"><span className="accent-text">F</span>INAN<span className="accent-text">SE</span></span> 
            </div>
            <nav className="nav">
                <ul className="nav-list">
                    <li className="nav-link"><NavLink to="/" className="nav-link nav-link--active">Struktura</NavLink></li>
                    <li className="nav-link"><NavLink to="/obligacje" className="nav-link">Obligacje</NavLink></li>
                    <li className="nav-link"><NavLink to="/etf" className="nav-link">ETFy</NavLink></li>
                    <li className="nav-link"><NavLink to="/zloto" className="nav-link">Złoto</NavLink></li>
                    <li className="nav-link"><NavLink to="/kryptowaluty" className="nav-link">Kryptowaluty</NavLink></li>
                </ul>
            </nav>
        </header>
    )
}

export default Navbar