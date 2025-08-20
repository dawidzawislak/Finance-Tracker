import React from 'react'

function BuyBonds({ wallet, setWallet }) {
    const [avaiable, setAvailable] = React.useState([])
    const [params, setParams] = React.useState({ 'type': '', 'date': '', 'count': '', 'interest': '', 'margin': '' })

    React.useEffect(() => {
        fetch('http://localhost:8000/available/bond').then(response => response.json()).then(bonds => {
            setAvailable(bonds)
        })
    }, [])

    const handleBuy = (ev) => {
        ev.preventDefault()

        if (!params['type'] || !params['date'] || !params['count'] || !params['interest'] || !params['margin']) {
            alert('Please fill all fields')
            return
        }

        const _wallet = { ...wallet }
        _wallet['bond'][params['type']]['entries'].push({
            'date': params['date'],
            'price': Number(params['count']) * 100,
            'count': Number(params['count']),
            'int1': Number(params['interest']),
            'margin': Number(params['margin']),
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
                setParams({ 'type': '', 'date': '', 'count': '', 'interest': '', 'margin': '' })
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
                    Bond:
                    <select name='type' value={params['type']} onChange={handleChange}>
                        <option value=''>Select bond</option>
                        {avaiable.map((bond) => <option key={bond} value={bond}>{bond.toUpperCase()}</option>)}
                    </select>
                </label>
                <label>
                    Date:
                    <input type='date' name='date' value={params['date']} onChange={handleChange} />
                </label>
                <label>
                    Count:
                    <input type='number' name='count' value={params['count']} onChange={handleChange} />
                </label>
                <label>
                    Interest rate:
                    <input type='number' name='interest' value={params['interest']} onChange={handleChange} />
                </label>
                <label>
                    Margin:
                    <input type='number' name='margin' value={params['margin']} onChange={handleChange} />
                </label>
                <button onClick={handleBuy}>Buy</button>
            </div>
        </div>
    )
}

export default BuyBonds