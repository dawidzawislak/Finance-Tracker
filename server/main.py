import requests
import json
import datetime
from flask import Flask, request
from flask_cors import CORS
from bs4 import BeautifulSoup
import os

app = Flask(__name__)
CORS(app)

historical_data = dict()
avaiable_instruments = []

stooq_mapping = {
    'vwra': 'vwra.uk',
    'iwda': 'iwda.uk',
    'swda': 'swda.uk',
    'is3n': 'is3n.de',
    'etfbm40tr': 'etfbm40tr.pl',

    'btc': 'btcpln',
    'gold': 'xaupln',

    'usdpln': 'usdpln',
    'eurpln': 'eurpln',
    'gbppln': 'gbppln',
}

investing_mapping = {
    'vwra': 'etfs/vanguard-ftse-all-world-ucits-acc',
    'iwda': 'etfs/ishares-msci-world---acc',
    'swda': 'etfs/ishares-msci-world---acc?cid=995447',
    'is3n': 'etfs/ishares-core-msci-em-imi?cid=994133',
    'etfbm40tr': 'etfs/beta-etf-mwig40tr-portfelowy-fiz',
    'gold': 'currencies/xau-pln',
    'usdpln': 'currencies/usd-pln',
    'eurpln': 'currencies/eur-pln',
    'gbppln': 'currencies/gbp-pln',
}

curr_cache = {}


def get_instrument_and_appendix(name: str):
    dot_pos = name.rfind('.') 
    
    if dot_pos > -1:
        return name[:dot_pos], name[dot_pos+1:]
    else:
        return name, ''


def str_to_datetime(date: str):
    date = map(lambda x: int(x), date.split('-'))
    return datetime.date(*date)

def datetime_to_str(date: datetime):
    return date.strftime("%Y-%m-%d")


def get_values_from_time_range(entries, start_date: str, end_date: str):
    values = {}
    for entry in entries:
        if str_to_datetime(start_date) <= str_to_datetime(entry['date']) <= str_to_datetime(end_date):
            values[entry['date']] = float(entry['value'])
    return values

@app.route('/historical_data/<instrument>')
def historical_data(instrument: str):
    if instrument not in stooq_mapping.keys():
        return "Instrument not avaiable!"
    
    start = request.args.get('start', '1000-01-01')
    end = request.args.get('end', datetime_to_str(datetime.date.today()))

    with open(f'historical/{instrument}.json', 'r') as f:
        entries = json.loads(f.read())

        if instrument in curr_cache.keys():
            curr = curr_cache[instrument]
        else:
            if instrument.find('pln') > -1:
                curr = 'PLN'
                curr_cache[instrument] = curr
            else:
                req = 'http://127.0.0.1/value/' + instrument
                curr = json.loads(requests.get(req).text)['curr']
                curr_cache[instrument] = curr

        return {'curr': curr, 'values': {key: entries[key] for key in entries if str_to_datetime(start) <= str_to_datetime(key) <= str_to_datetime(end)}}


@app.route('/value/<instrument>')
def value(instrument: str):
    if instrument == 'btc':
        curr_cache[instrument] = 'PLN'
        return json.dumps({'value': 1.0 / float(requests.get("https://blockchain.info/tobtc?currency=PLN&value=1").text), 'curr': 'PLN'})

    if instrument not in investing_mapping.keys():
        return "Instrument not avaiable!"

    link = investing_mapping[instrument]
    req = requests.get(f"https://www.investing.com/{link}")

    if req.status_code == 200:
        soup = BeautifulSoup(req.text, 'html.parser')
        value = float(soup.find_all('div', {'data-test': 'instrument-price-last'})[0].string.replace(',', ''))
        if instrument == 'swda':
            value /= 100
        
        if link.find('pln') > -1:
            curr = 'PLN'
        else:
            for td in soup.find_all('div', {'data-test': 'currency-in-label'}):
                curr = td.find_all('span')[0].string

        if instrument not in curr_cache.keys():
            curr_cache[instrument] = curr

        return json.dumps({'value': value, 'curr': curr})
    
    return f"Request at /{link} failed!"

@app.route('/exchange_rates')
def exchange_rates():
    req = requests.get("https://api.nbp.pl/api/exchangerates/tables/A/?format=json")
    if req.status_code == 200:
        rates = json.loads(req.text)[0]['rates']
        exchange_rates = {'PLN': 1.0}
        for rate in rates:
            if rate['code'] in ['USD', 'EUR', 'GBP']:
                exchange_rates[rate['code']] = rate['mid']

        return json.dumps(exchange_rates)
    return "Request failed!"


@app.route('/wallet')
def wallet():
    with open('wallet.json', 'r') as f:
        return f.read()

@app.route('/available/<instrument>')
def avaiable(instrument):
    if instrument == 'bond':
        return ["edo10"]
    elif instrument == 'etf':
        return list(stooq_mapping.keys())[:-2]
    elif instrument == 'crypto':
        return ['btc']
    elif instrument == 'commodity':
        return ['gold']

def download_instrument_data(instrument: str):
    req = requests.get(f'https://stooq.pl/q/d/l/?s={stooq_mapping[instrument]}&i=d&c=1')
    if req.status_code == 200:
        with open(f"historical/{instrument}.json", 'w') as f:
            entries = {}
            last = None
            prev = datetime.date.today()

            for l in req.text.split('\n')[1:]:
                if l.strip() == "": continue

                values = l.strip().split(';')

                val = float(values[4])
                if instrument == 'swda':
                    val /= 100

                current_date = prev + datetime.timedelta(days=1)
                while current_date < str_to_datetime(values[0]):
                    entries[datetime_to_str(current_date)] = last
                    current_date += datetime.timedelta(days=1)
                entries[values[0]] = val
                last = val
                prev = str_to_datetime(values[0])
            
            if len(entries) > 0:
                current_date = prev + datetime.timedelta(days=1)
                while current_date <= datetime.date.today():
                    entries[datetime_to_str(current_date)] = last
                    current_date += datetime.timedelta(days=1)
            
            f.write(json.dumps(entries))
    else:
        print(f"Request at https://stooq.pl/q/d/l/?s={instrument}&i=d&c=1 failed!")


@app.route('/change_wallet', methods=['POST'])
def change_wallet():
    data = request.get_json()

    with open('wallet.json', 'w') as f:
        f.write(json.dumps(data, indent=4))

    return {"message": "Data received", "data": data}, 200

def main():
    for ins in stooq_mapping.keys():
        if (not os.path.exists(f"historical/{ins}.json") or 
            datetime.datetime.fromtimestamp(os.path.getmtime(f"historical/{ins}.json")).day != datetime.datetime.now().day):
            download_instrument_data(ins)
        
    app.run(host='127.0.0.1', port=8000)

if __name__ == "__main__":
    main()
