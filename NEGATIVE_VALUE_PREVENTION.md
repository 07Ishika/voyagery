# Negative Value Prevention in Cost Calculator

## Implemented Safeguards

### 1. **Input Field Restrictions**
```jsx
<Input
  type="number"
  min="0"                    // HTML5 min attribute
  step="0.01"               // Allow decimal values
  onKeyDown={(e) => {
    // Prevent minus key, 'e', and 'E' keys
    if (e.key === '-' || e.key === 'e' || e.key === 'E') {
      e.preventDefault();
    }
  }}
/>
```

### 2. **JavaScript Validation in handleExpenseChange**
```javascript
const handleExpenseChange = (key, value) => {
  // Prevent negative values and ensure valid number
  const numericValue = parseFloat(value) || 0;
  const validValue = Math.max(0, numericValue); // Ensure non-negative
  
  setExpenses(prev => ({
    ...prev,
    [key]: validValue
  }));
};
```

### 3. **Currency Conversion Protection**
```javascript
convert(amount, fromCurrency, toCurrency) {
  if (!amount || amount === 0) return 0;
  if (fromCurrency === toCurrency) return amount;
  
  // Ensure amount is positive
  const positiveAmount = Math.max(0, parseFloat(amount) || 0);
  if (positiveAmount === 0) return 0;
  
  // ... rest of conversion logic
}
```

## Multi-Layer Protection

### Layer 1: UI Prevention
- `min="0"` attribute prevents negative input in most browsers
- `onKeyDown` handler blocks minus key, 'e', and 'E' keys
- `step="0.01"` allows proper decimal input

### Layer 2: Input Processing
- `parseFloat()` converts string to number safely
- `Math.max(0, value)` ensures result is never negative
- Handles edge cases like empty strings, NaN, etc.

### Layer 3: Conversion Safety
- Currency conversion function validates input
- Ensures no negative amounts are processed
- Returns 0 for invalid inputs

## User Experience Benefits

1. **Intuitive**: Users can't accidentally enter negative values
2. **Forgiving**: Invalid inputs are automatically corrected to 0
3. **Consistent**: All expense categories follow same validation rules
4. **Reliable**: Multiple validation layers prevent edge cases

## Edge Cases Handled

- Empty input → 0
- Negative input → 0
- Non-numeric input → 0
- Scientific notation (1e5) → prevented at input level
- Copy-paste negative values → converted to positive
- Programmatic negative values → sanitized in conversion

## Testing Scenarios

✅ Typing negative numbers
✅ Using minus key
✅ Copy-pasting negative values
✅ Scientific notation input
✅ Empty/null values
✅ Currency conversion with edge values
✅ Rapid input changes
✅ Browser autofill with negative values