document.addEventListener('DOMContentLoaded', function() {
    const apiKey = 'cur_live_wq6D29Pvcfx29OFu41u5ga67HrsUNVYlpgLuRajX';
    const apiUrl = `https://api.currencyapi.com/v3/latest?apikey=${apiKey}`;

    const inputAmount = document.getElementById('input-amount');
    const inputCurrency = document.getElementById('input-currency');
    const outputAmount = document.getElementById('output-amount');
    const outputCurrency = document.getElementById('output-currency');
    const rateElement = document.getElementById('rate');
    const dateElement = document.getElementById('date');

    async function fetchCurrencies() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const rates = data.data;
            // for the fecthing of the currency options.
            populateCurrencyOptions(rates);
            fetchExchangeRate();
        } catch (error) {
            console.error('Error fetching currencies:', error);
        }
    }

    const populateCurrencyOptions = (rates) => {
        Object.keys(rates).forEach(currency => {
            const option1 = document.createElement('option');
            option1.value = currency;
            option1.text = currency;
            inputCurrency.appendChild(option1);
    
            const option2 = document.createElement('option');
            option2.value = currency;
            option2.text = currency;
            outputCurrency.appendChild(option2);
        });
        inputCurrency.value = 'PKR';
        outputCurrency.value = 'GBP';
    };

    const fetchExchangeRate = async () => {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const rates = data.data;
            const inputCurrencyValue = inputCurrency.value;
            const outputCurrencyValue = outputCurrency.value;
            // dividing the currencyValues to get the exchange rate.
            const exchangeRate = rates[outputCurrencyValue].value / rates[inputCurrencyValue].value;
            const date = new Date(data.meta.last_updated_at);
            // updating the UI for the exchange rate and current time/date.
            updateUI(exchangeRate, date);
        } catch (error) {
            console.error('Error fetching exchange rate:', error);
        }
    };

    let updateUI = ((exchangeRate, date) => {
        const inputAmountValue = parseFloat(inputAmount.value);
        const convertedAmount = (inputAmountValue * exchangeRate).toFixed(4);
        outputAmount.value = convertedAmount;
        // dynamically allocating the fetched results onto the display frontend.
        rateElement.innerHTML = `${exchangeRate.toFixed(4)} <span class="currency">${outputCurrency.options[outputCurrency.selectedIndex].text}</span>`;
        dateElement.textContent = `${date.toLocaleDateString()}, ${date.toLocaleTimeString()} UTC · Disclaimer`;
    });

    let updateTime = () => {
        const now = new Date();
        dateElement.textContent = `${now.toLocaleDateString()}, ${now.toLocaleTimeString()} UTC · Disclaimer`;
    };

    inputAmount.addEventListener('input', fetchExchangeRate);
    inputCurrency.addEventListener('change', fetchExchangeRate);
    outputCurrency.addEventListener('change', fetchExchangeRate);
    fetchCurrencies();
    setInterval(updateTime, 1000);
});