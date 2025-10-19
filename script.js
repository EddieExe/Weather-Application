const API_KEY = '3fa41897c753b25f1da40e30097ab727';
const API_URL = 'https://api.openweathermap.org/data/2.5';

// DOM Elements
const cityInput = document.querySelector('.city_input');
const searchBtn = document.querySelector('.searchBtn');
const locationBtn = document.querySelector('.locationBtn');
const locationName = document.querySelector('.location_name');
const dateDisplay = document.querySelector('.date');
const weatherCondition = document.querySelector('.weather_condition');
const temperatureDisplay = document.querySelector('.temperature');
const rainChanceDisplay = document.querySelector('.rain_chance_percentage');
const windSpeedDisplay = document.querySelector('.wind_speed');
const backgroundImage = document.querySelector('.background_image');
const forecastDisplay = document.querySelector('.day_forecast');

// Fetch weather data by city name
async function fetchWeatherData(city) {
    try {
        const response = await fetch(`${API_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();
        displayWeather(data);
        fetchForecast(data.coord.lat, data.coord.lon);
    } catch (error) {
        alert(error.message);
    }
}

// Fetch weather data by location (latitude and longitude)
async function fetchWeatherByLocation(lat, lon) {
    try {
        const response = await fetch(`${API_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        displayWeather(data);
        fetchForecast(lat, lon);
    } catch (error) {
        alert('Error fetching weather data.');
    }
}

// Fetch 5-day forecast data
async function fetchForecast(lat, lon) {
    try {
        const response = await fetch(`${API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        displayForecast(data.list);
    } catch (error) {
        alert('Error fetching forecast data.');
    }
}

// Display current weather data
function displayWeather(data) {
    const { name, main, weather, wind } = data;

    // Updating text information
    locationName.innerText = `${name}, ${data.sys.country}`;
    dateDisplay.innerText = `Today ${new Date().toLocaleDateString()}`;
    weatherCondition.innerText = weather[0].description;
    temperatureDisplay.innerHTML = `${main.temp}&deg;C`;
    rainChanceDisplay.innerText = (weather[0].main === 'Rain') ? '40%' : '0%';
    windSpeedDisplay.innerText = wind.speed.toFixed(1);

    // Update background image based on the current weather condition
    updateBackgroundImage(weather[0].main);

    // Updating weather condition icon
    const conditionIcon = document.querySelector('.condition img');
    conditionIcon.src = getWeatherIcon(weather[0].main);
    conditionIcon.alt = weather[0].description;
}

// Function to update the background image based on weather conditions
function updateBackgroundImage(condition) {
    console.log('Weather condition received:', condition);
    switch (condition.toLowerCase()) {
        case 'clear':
        case 'partly cloudy':
            document.body.style.backgroundImage = "url('./Images/sunny_weather.jpg')";
            break;
        case 'clouds':
        case 'fog':
        case 'haze':
            document.body.style.backgroundImage = "url('./Images/cloudy_weather.jpg')";
            break;
        case 'rain':
        case 'thunderstorm':
            document.body.style.backgroundImage = "url('./Images/rainy_weather.jpg')";
            break;
        case 'snow':
            document.body.style.backgroundImage = "url('./Images/snowy_weather.jpg')";
            break;
        default:
            document.body.style.backgroundImage = "url('./Images/sunny_weather.jpg')";
    }
}

// Icon based on weather condition
function getWeatherIcon(condition) {
    switch (condition.toLowerCase()) {
        case 'clear':
            return './Images/Icons/sunny.png';
        case 'clouds':
            return './Images/Icons/cloudy.png';
        case 'haze':
            return './Images/Icons/haze.png';
        case 'rain':
            return './Images/Icons/rainy.png';
        case 'snow':
        case 'light snow':
            return './Images/Icons/snow.png';
        case 'thunderstorm':
            return './Images/Icons/thunderstorm.png';
        case 'drizzle':
            return './Images/Icons/drizzle.png';
        case 'fog':
            return './Images/Icons/fog.png';
        default:
            return './Images/Icons/partly_cloudy.png';
    }
}

// Display 5-day weather forecast
function displayForecast(forecastList) {
    forecastDisplay.innerHTML = `<p class="forecast_title"><b>5 Days</b><br>Forecast</p>`; // Add title
    forecastList.forEach(forecast => {
        if (forecast.dt_txt.includes('12:00:00')) {
            const date = new Date(forecast.dt * 1000);
            const day = date.toLocaleDateString('en-US', { weekday: 'long' });
            const temp = forecast.main.temp;
            const icon = getWeatherIcon(forecast.weather[0].main); // Use custom icon

            forecastDisplay.innerHTML += `
                <div class="forecast_day">
                    <p class="day">${day}</p>
                    <img src="${icon}" alt="${forecast.weather[0].description}">
                    <p class="day_weather">${forecast.weather[0].description}</p>
                    <p class="day_temperature">${temp}&deg;C</p>
                </div>
            `;
        }
    });
}

function updateTime() {
    const now = new Date();
    document.querySelector('.time').innerHTML = `<b>Now</b> ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

// Call this function initially to display the current time
updateTime();

setTimeout(function () {
    setInterval(updateTime, 60000);
}, (60 - new Date().getSeconds()) * 1000);


// Event listeners
searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        fetchWeatherData(city);
    }
});

locationBtn.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherByLocation(lat, lon);
    }, error => alert('Unable to retrieve location'));
});