var apiKey = "271eb3166d39afc7090c6ceb0e032766";

// Initialize variables
var currentWeatherEl = document.getElementById("current-weather");
var forecastEl = document.getElementById("forecast");
var historyListEl = document.getElementById("history-list");
var searchHistory = [];

// Event listener for form submission
document.querySelector("form").addEventListener("submit", function(event) {
  event.preventDefault();
  let city = document.getElementById("city-input").value;
  getWeatherData(city);
});

// Event listener for search history item click
historyListEl.addEventListener("click", function(event) {
  let city = event.target.textContent;
  getWeatherData(city);
});

// Get weather data from OpenWeatherMap API
function getWeatherData(city) {
  // Add city to search history
  if (!searchHistory.includes(city)) {
    searchHistory.push(city);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    updateHistoryList();
  }

  // API request for current weather
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`)
    .then(response => response.json())
    .then(data => {
      // Display current weather data
      let cityName = data.name;
      let date = new Date(data.dt * 1000).toLocaleDateString();
      let weatherIcon = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
      let temp = Math.round(data.main.temp);
      let humidity = data.main.humidity;
      let windSpeed = Math.round(data.wind.speed);
      currentWeatherEl.innerHTML = `
        <h2>${cityName} (${date}) <img src="${weatherIcon}" alt="${data.weather[0].description}"></h2>
        <p>Temperature: ${temp} &deg;F</p>
        <p>Wind Speed: ${windSpeed} mph</p>
        <p>Humidity: ${humidity}%</p>
        <br>
        <h3>5-Day Forecast:</h3>
        
      `;

      // API request for 5-day forecast
      return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`);
    })
    .then(response => response.json())
    .then(data => {
      // Display 5-day forecast data
      let forecastHtml = "";
      for (let i = 0; i < data.list.length; i += 8) {
        let forecast = data.list[i];
        let date = new Date(forecast.dt * 1000).toLocaleDateString();
        let weatherIcon = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
        let temp = Math.round(forecast.main.temp);
        let humidity = forecast.main.humidity;
        let windSpeed = Math.round(forecast.wind.speed);
        forecastHtml += `
          <div class="forecast-item">
            <h3>${date}</h3>
            <img src="${weatherIcon}" alt="${forecast.weather[0].description}">
            <p>Temperature: ${temp} &deg;F</p>
            <p>Wind Speed: ${windSpeed} mph</p>
            <p>Humidity: ${humidity}%</p>
            
          </div>
        `;
      }
      
      forecastEl.innerHTML = forecastHtml;
    })
    .catch(error => {
      console.log(error);
      currentWeatherEl.innerHTML = "<p>Please enter a city name.</p>";
      forecastEl.innerHTML = "";
    });
}

// Update search history list from local storage
function updateHistoryList() {
    let searchHistoryStr = localStorage.getItem("searchHistory");
    if (searchHistoryStr) {
      searchHistory = JSON.parse(searchHistoryStr);
      let historyListHtml = "";
      for (let i = 0; i < searchHistory.length; i++) {
        historyListHtml += `<li><button style="background-color: lightgray; color: black">${searchHistory[i]}</button></li>`;
      }
      historyListEl.innerHTML = historyListHtml;
    }
  }
  
  // Initialize search history list on page load
  updateHistoryList();
  