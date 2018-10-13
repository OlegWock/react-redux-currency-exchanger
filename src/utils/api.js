import axios from 'axios';
import store from '../store';

class API {
    constructor(apiKey=process.env.REACT_APP_API_KEY) {
        this.apiKey = apiKey;
        this.baseUrl = `http://apilayer.net/api/`;
        this.baseCurrency = 'USD';
    }

    async updateRates(currencies) {
        let result = await axios({
            url: this.baseUrl + 'live',
            method: 'get',
            params: {
                access_key: this.apiKey,
                currencies: currencies.join(',')
            }
        });

        return result.data.quotes;
    }

    convert(amount, fromCode, toCode) {
        let rates = store.getState().rates.data;
        let result;

        if (`${fromCode}${toCode}` in rates) {
            result = amount * rates[`${fromCode}${toCode}`];
        }

        else if (`${toCode}${fromCode}` in rates) {
            result = amount * (1 / rates[`${toCode}${fromCode}`]);
        }

        else  if (`${this.baseCurrency}${fromCode}` in rates
                  && `${this.baseCurrency}${toCode}` in rates) {
            result = amount * (1 / rates[`${this.baseCurrency}${fromCode}`]);
            result = result * rates[`${this.baseCurrency}${toCode}`];
        }

        return Math.round(result * 10000)/10000;
    }
}

export default API;

