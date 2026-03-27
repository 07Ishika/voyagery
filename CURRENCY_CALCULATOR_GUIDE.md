# Enhanced Cost Calculator with Currency Conversion

## Features Added

### 1. **Multi-Currency Support**
- Support for 14+ major currencies including USD, EUR, GBP, CAD, AUD, INR, JPY, CHF, CNY, SGD, etc.
- Real-time exchange rates from API with fallback rates for offline use
- Automatic rate caching for 24 hours

### 2. **Currency Conversion Modes**

#### Simple Mode (Default)
- Single currency selection
- All inputs and outputs in the same currency
- Perfect for users working within one currency

#### Conversion Mode
- **Input Currency**: Currency you're entering expenses in (e.g., INR)
- **Display Currency**: Currency you want to see the total in (e.g., USD)
- **Swap Button**: Quickly switch between input and display currencies
- **Live Conversion**: See converted amounts for each expense category

### 3. **Smart Features**
- **Auto-refresh**: Exchange rates update automatically
- **Manual refresh**: Click "Rates" button to get latest rates
- **Offline support**: Uses cached rates when internet is unavailable
- **Real-time conversion**: See converted amounts as you type
- **Exchange rate display**: Shows current conversion rate between currencies

## How to Use

### For Basic Use:
1. Open the cost calculator (floating button on bottom-right)
2. Select your currency from the dropdown
3. Enter your monthly expenses in each category
4. See your total monthly cost

### For Currency Conversion:
1. Click "Convert" button to enable conversion mode
2. Set **Input Currency** (currency you're entering amounts in)
3. Set **Display Currency** (currency you want to see totals in)
4. Enter expenses in your input currency
5. See converted amounts in real-time
6. Total shows in your preferred display currency

### Example Use Cases:

#### Scenario 1: Indian moving to Canada
- Input Currency: INR (₹)
- Display Currency: CAD (C$)
- Enter all expenses in Indian Rupees
- See equivalent costs in Canadian Dollars

#### Scenario 2: American comparing costs globally
- Input Currency: USD ($)
- Display Currency: EUR (€)
- Enter US costs, see European equivalent

## Technical Details

### Exchange Rate Sources
- Primary: ExchangeRate-API (free tier)
- Fallback: Cached rates (updated every 24 hours)
- Offline: Built-in fallback rates

### Supported Currencies
- USD - US Dollar
- EUR - Euro
- GBP - British Pound
- CAD - Canadian Dollar
- AUD - Australian Dollar
- INR - Indian Rupee
- JPY - Japanese Yen
- CHF - Swiss Franc
- CNY - Chinese Yuan
- SGD - Singapore Dollar
- NZD - New Zealand Dollar
- ZAR - South African Rand
- BRL - Brazilian Real
- MXN - Mexican Peso

### Data Persistence
- All settings and expenses saved to localStorage
- Automatic save on every change
- Restored when calculator reopens

## Benefits for Voyagery Users

1. **Migration Planning**: Calculate living costs in target country currency
2. **Budget Comparison**: Compare costs between current and destination locations
3. **Real-time Accuracy**: Up-to-date exchange rates for accurate planning
4. **Flexibility**: Work in familiar currency, see results in target currency
5. **Offline Support**: Works even without internet connection

## Future Enhancements

- Historical exchange rate trends
- Cost of living index integration
- Multi-city comparison
- Export to PDF/Excel
- Integration with guide session booking costs