const API_KEY = 'e0c3828a176a79eb6b0648675b35c7ab'
const BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast?q=';


document.addEventListener('DOMContentLoaded', function() {
    var searchBoxEl = document.getElementById("searchBox");
    var currentDayEl = document.getElementById("currentDay");
    var searchResultsDiv = document.getElementById('searchResults')

    const currentDate = dayjs().format('dddd, MMMM D, YYYY')
    currentDayEl.textContent = currentDate;
function updateCityList() {

    searchResultsDiv.innerHTML = '';

    let searches = JSON.parse(localStorage.getItem('searches')) || [];
    searches.forEach(search => {
        if (search && search.data && search.data.list && search.data.list[0]) {
            let cityLink = document.createElement('a');
            cityLink.href = "#";
            cityLink.textContent = `${search.city}`;
            searchResultsDiv.appendChild(cityLink);

            cityLink.addEventListener('click', function(e) {
                e.preventDefault(); //
                getWeatherForCity(search.city);
            });
        }
    });
}


searchBoxEl.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const city = searchBoxEl.value;
        getWeatherForCity(city);
    }
});



function getWeatherForCity(city) {
    fetch(`${BASE_URL}${city}&units=metric&appid=${API_KEY}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json();
    })
    .then(data => {
        displayForecast(data);
        storeSearch(city, data);
    })
    .catch(error => {
        console.error('There was an issue fetching weather data:', error);
    })
}

function storeSearch(city, data) {
    let searches = JSON.parse(localStorage.getItem('searches')) || [];    
    if(searches.some(search => search.city && search.city.toLowerCase() === city.toLowerCase())) return;

    
    searches.push({ city, data });
    localStorage.setItem('searches', JSON.stringify(searches));

    updateCityList();
  }


function displayForecast(data) {
    for(let i = 0; i < 5; i++) {
        const forecast = data.list[i * 8];

        const date = dayjs(forecast.dt_txt).format('dddd, MMMM D, YYYY');
        const iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
        const temperature = forecast.main.temp;
        const description = forecast.weather[0].description;
        
        document.getElementById(`day${i+1}-date`).textContent = date;
        document.getElementById(`day${i+1}-icon`).src = iconUrl;
        document.getElementById(`day${i+1}-temp`).textContent = `${temperature}°C`;
        document.getElementById(`day${i+1}-description`).textContent = description;
    }
    showWeatherIcons();
}

function showWeatherIcons() {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.classList.remove('hidden');
    forecastContainer.style.display = 'flex';
}

setInterval(updateCityList, 1000);
});