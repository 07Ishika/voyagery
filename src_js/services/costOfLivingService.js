// Cost of Living Service with real-world data and comparison logic

// Cost data for major cities
const costData = {
    canada: {
        toronto: {
            name: 'Toronto',
            country: 'Canada',
            currency: 'CAD',
            rent: { studio: 1800, oneBedroom: 2200, twoBedroom: 2800, threeBedroom: 3500 },
            food: { groceries: 400, restaurant: 200, fastFood: 80 },
            transport: { public: 120, gas: 200, car: 500 },
            utilities: { electricity: 80, water: 40, internet: 60, phone: 50 },
            other: { healthcare: 100, entertainment: 150, clothing: 100, fitness: 60 }
        },
        vancouver: {
            name: 'Vancouver',
            country: 'Canada',
            currency: 'CAD',
            rent: { studio: 2000, oneBedroom: 2400, twoBedroom: 3000, threeBedroom: 3800 },
            food: { groceries: 450, restaurant: 220, fastFood: 90 },
            transport: { public: 130, gas: 220, car: 550 },
            utilities: { electricity: 90, water: 45, internet: 65, phone: 55 },
            other: { healthcare: 110, entertainment: 160, clothing: 110, fitness: 70 }
        }
    },
    usa: {
        newyork: {
            name: 'New York',
            country: 'United States',
            currency: 'USD',
            rent: { studio: 2500, oneBedroom: 3200, twoBedroom: 4200, threeBedroom: 5500 },
            food: { groceries: 500, restaurant: 300, fastFood: 120 },
            transport: { public: 150, gas: 250, car: 600 },
            utilities: { electricity: 100, water: 50, internet: 70, phone: 60 },
            other: { healthcare: 200, entertainment: 200, clothing: 150, fitness: 80 }
        }
    },
    uk: {
        london: {
            name: 'London',
            country: 'United Kingdom',
            currency: 'GBP',
            rent: { studio: 1500, oneBedroom: 1800, twoBedroom: 2400, threeBedroom: 3000 },
            food: { groceries: 300, restaurant: 220, fastFood: 85 },
            transport: { public: 140, gas: 300, car: 500 },
            utilities: { electricity: 90, water: 50, internet: 50, phone: 40 },
            other: { healthcare: 0, entertainment: 180, clothing: 120, fitness: 70 }
        }
    },
    india: {
        mumbai: {
            name: 'Mumbai',
            country: 'India',
            currency: 'INR',
            rent: { studio: 25000, oneBedroom: 35000, twoBedroom: 55000, threeBedroom: 75000 },
            food: { groceries: 8000, restaurant: 4000, fastFood: 1500 },
            transport: { public: 1200, gas: 3500, car: 12000 },
            utilities: { electricity: 2000, water: 600, internet: 800, phone: 500 },
            other: { healthcare: 1500, entertainment: 3000, clothing: 2000, fitness: 1500 }
        }
    }
};

// Get all supported countries and cities
export function getSupportedLocations() {
    const locations = [];
    Object.keys(costData).forEach(countryCode => {
        const countryData = costData[countryCode];
        Object.keys(countryData).forEach(cityCode => {
            const cityData = countryData[cityCode];
            locations.push({
                countryCode,
                cityCode,
                countryName: cityData.country,
                cityName: cityData.name,
                currency: cityData.currency
            });
        });
    });
    return locations;
}

// Get cost data for a specific city
export function getCityData(countryCode, cityCode) {
    return costData[countryCode]?.[cityCode] || null;
}

// Calculate total monthly cost for basic living
export function calculateBasicLivingCost(cityData, options = {}) {
    if (!cityData) return 0;

    const {
        housingType = 'oneBedroom',
        includeRestaurant = true,
        includeTransport = true,
        includeEntertainment = false
    } = options;

    let total = 0;

    // Housing
    total += cityData.rent[housingType] || cityData.rent.oneBedroom;

    // Food
    total += cityData.food.groceries;
    if (includeRestaurant) {
        total += cityData.food.restaurant;
    }

    // Transport
    if (includeTransport) {
        total += cityData.transport.public;
    }

    // Utilities
    total += cityData.utilities.electricity;
    total += cityData.utilities.water;
    total += cityData.utilities.internet;
    total += cityData.utilities.phone;

    // Healthcare
    total += cityData.other.healthcare;

    // Entertainment (optional)
    if (includeEntertainment) {
        total += cityData.other.entertainment;
    }

    return Math.round(total);
}

// Compare costs between two cities
export function compareCities(city1Data, city2Data) {
    if (!city1Data || !city2Data) return null;

    // Convert both cities to USD for fair comparison
    const exchangeRates = {
        'USD': 1,
        'CAD': 1.35,
        'EUR': 0.85,
        'GBP': 0.73,
        'AUD': 1.45,
        'INR': 83.0,  // 1 USD = 83 INR
        'SGD': 1.35,
        'THB': 35.0
    };

    const city1USD = convertCostsToUSD(city1Data, exchangeRates);
    const city2USD = convertCostsToUSD(city2Data, exchangeRates);

    const city1Total = calculateBasicLivingCost(city1USD);
    const city2Total = calculateBasicLivingCost(city2USD);

    const difference = city1Total - city2Total;
    const percentageDiff = city2Total > 0 ? ((difference / city2Total) * 100) : 0;

    return {
        city1: {
            name: city1Data.name,
            total: city1Total,
            currency: 'USD'
        },
        city2: {
            name: city2Data.name,
            total: city2Total,
            currency: 'USD'
        },
        comparison: {
            absoluteDifference: Math.abs(difference),
            percentageDifference: Math.abs(percentageDiff),
            city1IsMoreExpensive: difference > 0
        }
    };
}

// Convert costs to different currency using exchange rates
export function convertCostsToUSD(cityData, exchangeRates) {
    if (!cityData || !exchangeRates) return cityData;

    const rate = exchangeRates[cityData.currency] || 1;
    const convertedData = JSON.parse(JSON.stringify(cityData)); // Deep copy

    // Convert all monetary values
    Object.keys(convertedData.rent).forEach(key => {
        convertedData.rent[key] = Math.round(convertedData.rent[key] / rate);
    });

    Object.keys(convertedData.food).forEach(key => {
        convertedData.food[key] = Math.round(convertedData.food[key] / rate);
    });

    Object.keys(convertedData.transport).forEach(key => {
        convertedData.transport[key] = Math.round(convertedData.transport[key] / rate);
    });

    Object.keys(convertedData.utilities).forEach(key => {
        convertedData.utilities[key] = Math.round(convertedData.utilities[key] / rate);
    });

    Object.keys(convertedData.other).forEach(key => {
        convertedData.other[key] = Math.round(convertedData.other[key] / rate);
    });

    convertedData.currency = 'USD';
    return convertedData;
}

// Create service object with all functions
const costOfLivingService = {
    getSupportedLocations,
    getCityData,
    calculateBasicLivingCost,
    compareCities,
    convertCostsToUSD
};

export default costOfLivingService;