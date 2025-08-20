import React from 'react'

function EditCash({ wallet, setWallet }) {
    const [available, setAvailable] = React.useState([])
    const [params, setParams] = React.useState({
        'curr': '', 'date': '', 'count': '', 'ike': false
    })

    React.useEffect(() => {
        fetch('http://localhost:8000/available/currency').then(response => response.json()).then(currs => {
            setAvailable(currs)
        })
    }, [])

    const handleBuy = (ev) => {
        ev.preventDefault()

        if (!params['curr'] || !params['date'] || !params['count']) {
            alert('Please fill all fields')
            return
        }

        const _wallet = { ...wallet }
        _wallet['currency'][params['curr']]['entries'].push({
            'date': params['date'],
            'count': Number(params['count']),
            'ike': params['ike']
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
                setParams({ 'curr': '', 'date': '', 'count': '', 'ike': false})
            } else {
                alert('Failed to buy')
            }
        })
    }

    const handleSell = (ev) => {
      ev.preventDefault()

      if (!params['curr'] || !params['date'] || !params['count']) {
          alert('Please fill all fields')
          return
      }

      const _wallet = { ...wallet }

      if (Number(params['count']) > _wallet['currency'][params['curr']]['entries'].filter(entry => entry.ike == params['ike']).reduce((acc, entry) => acc + entry.count, 0)) {
          alert("You don't have enough cash")
          return
      }

      _wallet['currency'][params['curr']]['entries'].push({
          'date': params['date'],
          'count': -Number(params['count']),
          'ike': params['ike']
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
              alert('Sold successfully')
              setParams({ 'curr': '', 'date': '', 'count': '', 'ike': false})
          } else {
              alert('Failed to sell')
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
            <h1 className="heading-secondary">Currencies:</h1>
            <div className='buy-panel-row'>
                <label>
                    Currency:
                    <select name='curr' value={params['curr']} onChange={handleChange}>
                        <option value=''>Select currency</option>
                        {available.map((curr) => <option key={curr} value={curr}>{curr.toUpperCase()}</option>)}
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
                <label >IKE: <input type="checkbox" name="ike" value={params['ike']} onChange={() => setParams(prev => ({...prev, ike: !prev.ike}))} /></label>
                <div style={{display: "flex", gap: "1rem"}}>
                <button onClick={handleBuy}>Buy</button>
                <button onClick={handleSell}>Sell</button>
                </div>
            </div>
        </div>
    )
}

export default EditCash