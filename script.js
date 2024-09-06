const weatherBlock = document.querySelector("#weather");
const searchIcon = document.getElementById("search-icon");
const weatherForm = document.getElementById("weatherForm");
const cityInput = document.getElementById("city");
const citySuggestions = document.getElementById("citySuggestions");

const weatherDescriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Freezing fog",
    51: "Drizzle: Light",
    53: "Drizzle: Moderate",
    55: "Drizzle: Dense",
    56: "Freezing drizzle: Light",
    57: "Freezing drizzle: Dense",
    61: "Rain: Slight",
    63: "Rain: Moderate",
    65: "Rain: Heavy",
    66: "Freezing rain: Light",
    67: "Freezing rain: Heavy",
    71: "Snow fall: Slight",
    73: "Snow fall: Moderate",
    75: "Snow fall: Heavy",
    77: "Snow grains",
    80: "Rain showers: Slight",
    81: "Rain showers: Moderate",
    82: "Rain showers: Violent",
    85: "Snow showers: Slight",
    86: "Snow showers: Heavy",
    95: "Thunderstorms: Slight or moderate",
    96: "Thunderstorms: Severe",
    99: "Thunderstorms with hail",
};

let temperatureChart = null;
let newGeoData = null;

searchIcon.addEventListener("click", () => {
    searchIcon.classList.add("hidden");
    weatherForm.classList.remove("hidden");
    weatherForm.classList.add("visible");
});

cityInput.addEventListener("input", async function () {
    const query = cityInput.value.trim();

    if (query.length > 1) {
        try {
            const geoResponse = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=en&format=json`
            );

            if (!geoResponse.ok) throw new Error("Geo API request failed");
            const geoData = await geoResponse.json();

            displayCitySuggestions(geoData.results);
        } catch (error) {
            console.error("Error fetching city suggestions:", error);
            citySuggestions.innerHTML = "<li>Error loading suggestions</li>";
        }
    } else {
        citySuggestions.innerHTML = "";
    }
});

function displayCitySuggestions(cities) {
    citySuggestions.innerHTML = "";

    if (cities && cities.length > 0) {
        cities.forEach((city) => {
            const cityItem = document.createElement("li");
            cityItem.textContent = `${city.name}, ${city.country_code}`;
            cityItem.addEventListener("click", () => {
                cityInput.value = city.name;
                citySuggestions.innerHTML = "";
            });
            citySuggestions.appendChild(cityItem);
        });
    } else {
        citySuggestions.innerHTML = "<li>No matches found</li>";
    }
}

document
    .getElementById("weatherForm")
    .addEventListener("submit", async function (event) {
        event.preventDefault();
        const city = cityInput.value;
        weatherBlock.innerHTML = `
        <div class="weather__loading">
            <img src="kOnzy.gif" alt="Loading" />
        </div>
    `;

        try {
            const geoResponse = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`
            );

            if (!geoResponse.ok) throw new Error("Geo API request failed");
            const geoData = await geoResponse.json();
            newGeoData = geoData.results[0].name;

            if (geoData.results && geoData.results.length > 0) {
                const { latitude, longitude } = geoData.results[0];

                const weatherResponse = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&current_weather=true&timezone=auto`
                );
                if (!weatherResponse.ok)
                    throw new Error("Weather API request failed");
                const weatherData = await weatherResponse.json();
                console.log(weatherData);

                const unsplashResponse = await fetch(
                    `https://api.unsplash.com/search/photos?query=${city}&client_id=OJWcSjmv4PmcWELYYmPUf37sU68G4YM8FbfUo0yiz0M`
                );
                if (!unsplashResponse.ok)
                    throw new Error("Unsplash API request failed");
                const unsplashData = await unsplashResponse.json();
                console.log(unsplashData);

                if (unsplashData.results && unsplashData.results.length > 0) {
                    const cityPhotoUrl = unsplashData.results[0].urls.regular;
                    displayWeather(weatherData, cityPhotoUrl);
                } else {
                    displayWeather(weatherData);
                }
            } else {
                weatherBlock.innerHTML =
                    "<p>City not found. Please try again.</p>";
            }
        } catch (error) {
            console.error("Error:", error);
            weatherBlock.innerHTML = "<p>Error. Please try again.</p>";
        }
    });

function displayWeather(data, cityPhotoUrl = null) {
    weatherBlock.innerHTML = "";

    const days = data.daily.time;
    console.log(days);
    const tempsMax = data.daily.temperature_2m_max;
    const tempsMin = data.daily.temperature_2m_min;
    const precipitation = data.daily.precipitation_sum;
    const weatherCodes = data.daily.weathercode;
    const currentTemp = data.current_weather.temperature;
    const currentWeatherCode = data.current_weather.weathercode;
    const currentWeatherDesc =
        weatherDescriptions[currentWeatherCode] || "Unknown weather";

    weatherBlock.innerHTML = `
    <h2 class="current-temp">Current Temperature: ${currentTemp}°C</h2>
    <p class="curr-weather">Current Weather: ${currentWeatherDesc}</p>
    <p class="curr-place"> ${newGeoData}</p>
    `;

    if (cityPhotoUrl) {
        weatherBlock.innerHTML += `
        <img class="city-img" src="${cityPhotoUrl}" alt="City Photo" class="city-photo"/>
        `;
    }
    const weatherDaysContainer = document.createElement("div");
    weatherDaysContainer.className = "weather-days-container";

    days.forEach((day, index) => {
        const weatherDiv = document.createElement("div");
        weatherDiv.className = "weather-day";
        weatherDiv.innerHTML = `
        <p class="date">Date: ${day}</p>
        <p>Max Temp: ${tempsMax[index]}°C</p>
        <p>Min Temp: ${tempsMin[index]}°C</p>
        <p>Precipitation: ${precipitation[index]}mm</p>
        <p class="weather-description"><span class="weather-word">Weather:</span> ${
            weatherDescriptions[weatherCodes[index]] || "Unknown"
        }</p>
        `;
        weatherDaysContainer.appendChild(weatherDiv);
    });

    weatherBlock.appendChild(weatherDaysContainer);

    const ctx = document.getElementById("temperatureChart").getContext("2d");
    if (temperatureChart) {
        temperatureChart.destroy();
    }

    temperatureChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: days,
            datasets: [
                {
                    label: "Max Temperature (°C)",
                    data: tempsMax,
                    borderColor: "rgba(255, 99, 132, 1)",
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    borderWidth: 1,
                },
                {
                    label: "Min Temperature (°C)",
                    data: tempsMin,
                    borderColor: "rgba(54, 162, 235, 1)",
                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false,
                },
            },
        },
    });
}

