const API_key = 'dc517482254be1d5e9b83eb76839b72b';
let weatherData = null; 
let forecastData = null; 
let currentUnit = 'C'; 

function getWeather() {
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`;
    const reportURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_key}`;

    fetch(currWeatherURL)
        .then(response => response.json())
        .then(data => {
            weatherData = data;
            displayWeather();
        })
        .catch(error => {
            console.error('Error. Please try again.', error);
            alert('Error. Please try again.');
        });

    fetch(reportURL)
        .then(response => response.json())
        .then(data => {
            forecastData = data;
            displayDailyForecast();
        })
        .catch(error => {
            console.error('Error with forecast. Please try again.', error);
            alert('Error with forecast. Please try again.');
        });
}

function displayWeather() {
    const tempInfo = document.getElementById('temp-div');
    const weatherInfo = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');

    weatherInfo.innerHTML = '';
    tempInfo.innerHTML = '';

    if (weatherData.cod === '404') {
        weatherInfo.innerHTML = '<p>Please try again</p>';
    } else {
        const location = weatherData.name;
        const description = weatherData.weather[0].description;
        const iconCode = weatherData.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `
            <p id="current-temp">${convertTemperature(weatherData.main.temp)}°${currentUnit}</p>
            <p>Max: <span id="max-temp">${convertTemperature(weatherData.main.temp_max)}</span>°${currentUnit}, 
               Min: <span id="min-temp">${convertTemperature(weatherData.main.temp_min)}</span>°${currentUnit}</p>
        `;

        const weatherHTML = `
            <p>${location}</p>
            <p>${description}</p>
        `;

        tempInfo.innerHTML = temperatureHTML;
        weatherInfo.innerHTML = weatherHTML;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;
        weatherIcon.style.display = 'block';
    }
}

function displayDailyForecast() {
    const dailyForecastInfo = document.getElementById('daily-forecast');
    dailyForecastInfo.innerHTML = '';
    const reportData = {};

    forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000).toISOString().split('T')[0];
        if (!reportData[date]) {
            reportData[date] = [];
        }
        reportData[date].push(item);
    });

    const days = Object.keys(reportData).slice(0, 5);

    days.forEach(date => {
        const dailyData = reportData[date];
        const minTemp = Math.min(...dailyData.map(d => d.main.temp_min));
        const maxTemp = Math.max(...dailyData.map(d => d.main.temp_max));
        const description = dailyData[0].weather[0].description;
        const iconCode = dailyData[0].weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const reportItemHTML = `
            <div class="daily-item">
                <p>${new Date(date).toDateString()}</p>
                <img src="${iconUrl}" alt="Daily Weather Icon">
                <p>${description}</p>
                <p>Max: <span class="daily-max">${convertTemperature(maxTemp)}</span>°${currentUnit}, 
                   Min: <span class="daily-min">${convertTemperature(minTemp)}</span>°${currentUnit}</p>
            </div>
        `;

        dailyForecastInfo.innerHTML += reportItemHTML;
    });
}

function updateTempUnit() {
    currentUnit = document.getElementById('unit-toggle').value;

    if (weatherData) {
        displayWeather();
    }
    if (forecastData) {
        displayDailyForecast();
    }
}

function convertTemperature(kelvinTemp) {
    if (currentUnit === 'C') {
        return Math.round(kelvinTemp - 273.15);
    } else if (currentUnit === 'F') {
        return Math.round((kelvinTemp - 273.15) * 9/5 + 32);
    }
}
