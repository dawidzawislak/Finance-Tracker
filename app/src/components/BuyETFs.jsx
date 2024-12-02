import React from 'react'

function BuyETFs({ wallet, setWallet }) {
    const [available, setAvailable] = React.useState([])
    const [params, setParams] = React.useState({
        'index': '', 'date': '', 'count': '', 'price': '',
        'unitPrice': '', 'fee': ''
    })

    React.useEffect(() => {
        fetch('http://localhost:8000/available/etf').then(response => response.json()).then(etfs => {
            setAvailable(etfs)
        })
    }, [])

    const handleBuy = (ev) => {
        ev.preventDefault()

        if (!params['index'] || !params['date'] || !params['count'] || !params['price'] || !params['unitPrice'] || !params['fee']) {
            alert('Please fill all fields')
            return
        }

        const _wallet = { ...wallet }
        _wallet['etf'][params['index']]['entries'].push({
            'date': params['date'],
            'price': Number(params['price']),
            'count': Number(params['count']),
            'unitPrice': Number(params['unitPrice']),
            'fee': Number(params['fee'])
        })

        setWallet(_wallet)

        fetch('http://localhost:8000/change_wallet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(_wallet)
        }).then(response => {
            if (response.ok) {
                alert('Bought successfully')
                setParams({ 'index': '', 'date': '', 'count': '', 'price': '', 'unitPrice': '', 'fee': '' })
            } else {
                alert('Failed to buy')
            }
        })
    }

    const handleChange = (ev) => {
        ev.preventDefault();

        setParams(prev => ({
            ...prev,
            [ev.target.name]: ev.target.value
        }))
    }

    return (
        <div className='buy-panel'>
            <h1 className="heading-secondary">Buy:</h1>
            <div className='buy-panel-row'>
                <label>
                    ETF:
                    <select name='index' value={params['index']} onChange={handleChange}>
                        <option value=''>Select index</option>
                        {available.map((bond) => <option key={bond} value={bond}>{bond.toUpperCase()}</option>)}
                    </select>
                </label>
                <label>
                    Date:
                    <input type='date' name='date' value={params['date']} onChange={handleChange} />
                </label>
                <label>
                    Price:
                    <input type='number' name='price' value={params['price']} onChange={handleChange} />
                </label>
                <label>
                    Count:
                    <input type='number' name='count' value={params['count']} onChange={handleChange} />
                </label>
                <label>
                    Unit price:
                    <input type='number' name='unitPrice' value={params['unitPrice']} onChange={handleChange} />
                </label>
                <label>
                    Fee:
                    <input type='number' name='fee' value={params['fee']} onChange={handleChange} />
                </label>
                <button onClick={handleBuy}>Buy</button>
            </div>
        </div>
    )
}

export default BuyETFs