var app = angular.module('countryWeatherApp', []);
app.controller('MainController', function($scope, $http) {
    $scope.countries = [];
    $scope.filteredCountries = [];
    $scope.selectedCountry = null;
    $scope.weatherData = {};
    $scope.loading = true;
    $scope.searchQuery = "";
    $scope.units = "metric"; // Default to metric units (Celsius)

    // Fetch JSON data
    $http.get('./countries.json')
        .then(function(response) {
            // Sort countries alphabetically by name
            $scope.countries = response.data.sort(function(a, b) {
                return a.name.common.localeCompare(b.name.common);
            });
            $scope.filteredCountries = [...$scope.countries];
            $scope.loading = false;
        })
        .catch(function(error) {
            console.error("Error fetching countries:", error);
            $scope.loading = false;
        });

    // Watch for changes in search query
    $scope.$watch('searchQuery', function(newValue) {
        if (!$scope.countries.length) return;

        if (!newValue || newValue.trim() === "") {
            $scope.filteredCountries = [...$scope.countries];
        } else {
            const query = newValue.toLowerCase();
            $scope.filteredCountries = $scope.countries.filter(country => {
                return country.name.common.toLowerCase().includes(query) ||
                    (country.capital && country.capital[0] &&
                        country.capital[0].toLowerCase().includes(query)) ||
                    country.region.toLowerCase().includes(query);
            });
        }

        // Clear selection if the filtered list doesn't contain selected country
        if ($scope.selectedCountry &&
            !$scope.filteredCountries.some(c => c === $scope.selectedCountry)) {
            $scope.selectedCountry = null;
        }
    });

    // Toggle details function
    $scope.toggleDetails = function(country) {
        if ($scope.selectedCountry === country) {
            $scope.selectedCountry = null;
        } else {
            $scope.selectedCountry = country;
            $scope.getWeather(country.capital[0], country.cca2);
        }
    };

    // Set unit type and refresh weather data if country is selected
    $scope.setUnit = function(unitType) {
        if ($scope.units === unitType) return; // No change needed

        $scope.units = unitType;

        // Refresh weather data if a country is selected
        if ($scope.selectedCountry) {
            $scope.getWeather($scope.selectedCountry.capital[0], $scope.selectedCountry.cca2);
        }
    };

    // Function to format temperature based on current unit setting
    $scope.formatTemperature = function(tempCelsius) {
        if ($scope.units === 'imperial') {
            // Convert Celsius to Fahrenheit: (C × 9/5) + 32
            const tempFahrenheit = (tempCelsius * 9 / 5) + 32;
            return tempFahrenheit.toFixed(1) + "°F";
        } else {
            return tempCelsius.toFixed(1) + "°C";
        }
    };

    // Function to format wind speed based on current unit setting
    $scope.formatWindSpeed = function(speedMS) {
        if ($scope.units === 'imperial') {
            // Convert m/s to mph: m/s * 2.237
            const speedMph = speedMS * 2.237;
            return speedMph.toFixed(1) + " mph";
        } else {
            return speedMS.toFixed(1) + " m/s";
        }
    };

    // Function to get weather using OpenWeatherMap API
    $scope.getWeather = function(capital, countryCode) {
        console.log("Fetching weather for", capital, countryCode);
        // Clear previous weather data
        $scope.weatherData = {};
        // Define API URL
        var apiKey = "794ee95e63c5a32aaf88cd813fa2e425";
        var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" +
            capital + "," + countryCode + "&APPID=" + apiKey + "&units=" + $scope.units;

        $http.get(apiUrl)
            .then(function(response) {
                console.log("Weather data:", response.data);
                // Extract required weather information
                const tempValue = response.data.main.temp;
                const windValue = response.data.wind.speed;

                $scope.weatherData = {
                    temperature: $scope.units === 'metric' ?
                        tempValue.toFixed(1) + "°C" : tempValue.toFixed(1) + "°F",
                    precipitation: (response.data.rain ?
                        (response.data.rain["1h"] || response.data.rain["3h"] || "0") : "0") + " mm",
                    windSpeed: $scope.units === 'metric' ?
                        windValue.toFixed(1) + " m/s" : windValue.toFixed(1) + " mph"
                };
            })
            .catch(function(error) {
                console.error("Error fetching weather:", error);
                $scope.weatherData = {
                    temperature: "Error loading data",
                    precipitation: "Error loading data",
                    windSpeed: "Error loading data"
                };
            });
    };
});

$scope.formatPrecipitation = function(precipMM) {
    if ($scope.units === 'imperial') {
        // Convert mm to inches (1 mm = 0.0393701 inches)
        const precipInches = precipMM * 0.0393701;
        return precipInches.toFixed(2) + " in";
    } else {
        return precipMM + " mm";
    }
};

$scope.getWeather = function(capital, countryCode) {
    console.log("Fetching weather for", capital, countryCode);
    // Clear previous weather data
    $scope.weatherData = {};
    // Define API URL
    var apiKey = "794ee95e63c5a32aaf88cd813fa2e425";
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" +
        capital + "," + countryCode + "&APPID=" + apiKey + "&units=" + $scope.units;

    // Used angulars $http service to make a get request to OpenWeatherMap API
    $http.get(apiUrl)
        .then(function(response) {
            console.log("Weather data:", response.data);

            // Get precipitation value from API response
            const precipValue = response.data.rain ?
                (response.data.rain["1h"] || response.data.rain["3h"] || 0) : 0;

            // Format all values according to current unit system
            $scope.weatherData = {
                temperature: $scope.units === 'metric' ?
                    response.data.main.temp.toFixed(1) + "°C" : response.data.main.temp.toFixed(1) + "°F",
                precipitation: $scope.formatPrecipitation(precipValue),
                windSpeed: $scope.units === 'metric' ?
                    response.data.wind.speed.toFixed(1) + " m/s" : response.data.wind.speed.toFixed(1) + " mph"
            };
        })
        .catch(function(error) {
            console.error("Error fetching weather:", error);
            $scope.weatherData = {
                temperature: "Error loading data",
                precipitation: "Error loading data",
                windSpeed: "Error loading data"
            };
        });
};