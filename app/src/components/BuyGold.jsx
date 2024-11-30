import React from 'react'

function BuyGold({wallet, setWallet}) {
    const [params, setParams] = React.useState({'date': '', 'count': '', 'unitPrice': ''})

    const handleBuy = (ev) => {
        ev.preventDefault()

        if (!params['date'] || !params['count'] || !params['unitPrice']) {
            alert('Please fill all fields')
            return
        }

        const _wallet = {...wallet}
        _wallet['commodity']['gold']['entries'].push({
            'date': params['date'],
            'price': Number(params['count']) * Number(params['unitPrice']),
            'count': Number(params['count']), 
            'unitPrice': Number(params['unitPrice']),
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
                setParams({'date': '', 'count': '', 'unitPrice': ''})
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
            <h1 className="heading-secondary">Buy gold:</h1>
            <div>
                <label>
                    Date:
                    <input type='date' name='date' value={params['date']} onChange={handleChange}/>
                </label>
                <label>
                    Mass [oz.]:
                    <input type='number' name='count' value={params['count']} onChange={handleChange}/>
                </label>
                <label>
                    Price/oz.:
                    <input type='number' name='unitPrice' value={params['unitPrice']} onChange={handleChange}/>
                </label>
                <button onClick={handleBuy}>Buy</button>
            </div>
        </div>
    )
}

export default BuyGold