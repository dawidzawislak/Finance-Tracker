import React from 'react'

function BuyCrypto({wallet, setWallet}) {
    const [params, setParams] = React.useState({'date': '', 'price': '', 'count': '', 'feeBTC': ''})

    const handleBuy = (ev) => {
        ev.preventDefault()

        if (!params['date'] || !params['price'] || !params['count'] || !params['feeBTC']) {
            alert('Please fill all fields')
            return
        }

        const _wallet = {...wallet}
        _wallet['crypto']['btc']['entries'].push({
            'date': params['date'],
            'price': Number(params['price']),
            'count': Number(params['count']), 
            'feeBTC': Number(params['feeBTC']),
        })

        setWallet(_wallet)

        fetch('http://localhost:8000/change_wallet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({_wallet})
        }).then(response => {
            if (response.ok) {
                alert('Bought successfully')
                setParams({'date': '', 'price': '', 'count': '', 'feeBTC': ''})
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
            <div>
                <label>
                    Date:
                    <input type='date' name='date' value={params['date']} onChange={handleChange}/>
                </label>
                <label>
                    Price [PLN]:
                    <input type='number' name='price' value={params['price']} onChange={handleChange}/>
                </label>
                <label>
                    Count [BTC]:
                    <input type='number' name='count' value={params['count']} onChange={handleChange}/>
                </label>
                <label>
                    Fee [BTC]:
                    <input type='number' name='feeBTC' value={params['feeBTC']} onChange={handleChange}/>
                </label>
                <button onClick={handleBuy}>Buy</button>
            </div>
        </div>
    )
}

export default BuyCrypto