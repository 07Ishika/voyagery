// Currency conversion service for the cost calculator
class CurrencyService {
    constructor() {
        this.exchangeRates = {};
        this.lastUpdated = null;
        this.baseCurrency = 'USD';

        // Fallback exchange rates (updated periodically)
        this.fallbackRates = {
            'USD': 1,
            'EUR': 0.85,
            'GBP': 0.73,
            'CAD': 1.25,
            'AUD': 1.35,
            'INR': 83.12,
            'JPY': 110.0,
            'CHF': 0.92,
            'CNY': 6.45,
            'SGD': 1.35,
            'NZD': 1.45,
            'ZAR': 15.2,
            'BRL': 5.1,
            'MXN': 20.5,
            'KRW': 1180.0,
            'THB': 33.5,
            'MYR': 4.2,
            'PHP': 55.8,
            'VND': 23500.0,
            'IDR': 14800.0
        };
    }

    // Get current exchange rates from API
    async fetchExchangeRates() {
        try {
            // Using a free API service (you can replace with your preferred service)
            const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${this.baseCurrency}`);

            if (!response.ok) {
                throw new Error('Failed to fetch exchange rates');
            }

            const data = await response.json();
            this.exchangeRates = data.rates;
            this.lastUpdated = new Date();

            // Store in localStorage for offline use
            localStorage.setItem('exchangeRates', JSON.stringify({
                rates: this.exchangeRates,
                lastUpdated: this.lastUpdated
            }));

            return this.exchangeRates;
        } catch (error) {
            console.warn('Failed to fetch live exchange rates, using fallback:', error);
            return this.loadFallbackRates();
        }
    }

    // Load rates from localStorage or use fallback
    loadFallbackRates() {
        try {
            const stored = localStorage.getItem('exchangeRates');
            if (stored) {
                const data = JSON.parse(stored);
                const lastUpdate = new Date(data.lastUpdated);
                const hoursSinceUpdate = (new Date() - lastUpdate) / (1000 * 60 * 60);

                // Use stored rates if less than 24 hours old
                if (hoursSinceUpdate < 24) {
                    this.exchangeRates = data.rates;
                    this.lastUpdated = lastUpdate;
                    return this.exchangeRates;
                }
            }
        } catch (error) {
            console.warn('Error loading stored exchange rates:', error);
        }

        // Use fallback rates
        this.exchangeRates = this.fallbackRates;
        this.lastUpdated = new Date();
        return this.exchangeRates;
    }

    // Initialize the service
    async initialize() {
        // Try to load from localStorage first
        this.loadFallbackRates();

        // Then fetch fresh rates in background
        try {
            await this.fetchExchangeRates();
        } catch (error) {
            console.warn('Using cached/fallback rates');
        }
    }

    // Convert amount from one currency to another
    convert(amount, fromCurrency, toCurrency) {
        if (!amount || amount === 0) return 0;
        if (fromCurrency === toCurrency) return amount;

        // Ensure amount is positive
        const positiveAmount = Math.max(0, parseFloat(amount) || 0);
        if (positiveAmount === 0) return 0;

        const rates = this.exchangeRates || this.fallbackRates;

        // Convert to USD first, then to target currency
        let usdAmount = positiveAmount;
        if (fromCurrency !== 'USD') {
            usdAmount = positiveAmount / (rates[fromCurrency] || 1);
        }

        // Convert from USD to target currency
        const targetAmount = usdAmount * (rates[toCurrency] || 1);

        return Math.round(targetAmount * 100) / 100; // Round to 2 decimal places
    }

    // Get exchange rate between two currencies
    getExchangeRate(fromCurrency, toCurrency) {
        if (fromCurrency === toCurrency) return 1;

        const rates = this.exchangeRates || this.fallbackRates;
        const fromRate = rates[fromCurrency] || 1;
        const toRate = rates[toCurrency] || 1;

        return (toRate / fromRate);
    }

    // Get all supported currencies
    getSupportedCurrencies() {
        return [
            { value: 'USD', label: 'USD ($)', symbol: '$', name: 'US Dollar' },
            { value: 'EUR', label: 'EUR (€)', symbol: '€', name: 'Euro' },
            { value: 'GBP', label: 'GBP (£)', symbol: '£', name: 'British Pound' },
            { value: 'CAD', label: 'CAD (C$)', symbol: 'C$', name: 'Canadian Dollar' },
            { value: 'AUD', label: 'AUD (A$)', symbol: 'A$', name: 'Australian Dollar' },
            { value: 'INR', label: 'INR (₹)', symbol: '₹', name: 'Indian Rupee' },
            { value: 'JPY', label: 'JPY (¥)', symbol: '¥', name: 'Japanese Yen' },
            { value: 'CHF', label: 'CHF (Fr)', symbol: 'Fr', name: 'Swiss Franc' },
            { value: 'CNY', label: 'CNY (¥)', symbol: '¥', name: 'Chinese Yuan' },
            { value: 'SGD', label: 'SGD (S$)', symbol: 'S$', name: 'Singapore Dollar' },
            { value: 'NZD', label: 'NZD (NZ$)', symbol: 'NZ$', name: 'New Zealand Dollar' },
            { value: 'ZAR', label: 'ZAR (R)', symbol: 'R', name: 'South African Rand' },
            { value: 'BRL', label: 'BRL (R$)', symbol: 'R$', name: 'Brazilian Real' },
            { value: 'MXN', label: 'MXN ($)', symbol: '$', name: 'Mexican Peso' }
        ];
    }

    // Format currency amount with proper symbol and locale
    formatCurrency(amount, currency) {
        const currencyInfo = this.getSupportedCurrencies().find(c => c.value === currency);
        const symbol = currencyInfo?.symbol || currency;

        // Format with appropriate decimal places
        const decimals = ['JPY', 'KRW', 'VND', 'IDR'].includes(currency) ? 0 : 2;

        return `${symbol}${amount.toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        })}`;
    }

    // Get last update time
    getLastUpdated() {
        return this.lastUpdated;
    }

    // Refresh exchange rates
    async refresh() {
        return await this.fetchExchangeRates();
    }
}

// Create singleton instance
const currencyService = new CurrencyService();

export default currencyService;