// create variables to hold api key and request urls
let openWeatherApiKey = '28770702fffb29d20b1e4a1a73e133f1';

// create variables to target city search related elements
let cityToSearchInputEl = document.querySelector("input[name='city-search-input']"); //target city search input element by name
let cityToSearchButtonEl = document.querySelector("button[name='city-search-button']"); //target city search button element by name
let previousSearchListEl = document.querySelector("ul[name='previous-search-list']"); // target previous search list element by name

// create empty global array to hold previous searches
let previousSuccessfulSearches = [];

// function to add city to previous search list and update DOM
function addToPreviousSearchList(cityName) {

    // add city provided as argument to golbal array of previous searches
    previousSuccessfulSearches.push(cityName);

    // blank out previous search list
    previousSearchListEl.innerHTML = "";

    // loop through global array of previous searches and add each city to previous search list by appending each li element to ul element
    for (let i = 0; i < previousSuccessfulSearches.length; i++) {

        let listItemAnchorEl = document.createElement("a");
        listItemAnchorEl.onclick = `"getWeatherFor("${cityName}");"`; // create anchor element to contain li element
        let listItemEl = document.createElement("li"); // create li element to append to anchor element
        listItemEl.classList.add("list-group-item"); // add class of list-group-item to li element
        listItemEl.innerHTML = previousSuccessfulSearches[i]; // set innerHTML of li element to previous search city
        listItemAnchorEl.appendChild(listItemEl); // append li element to anchor element
        previousSearchListEl.appendChild(listItemAnchorEl); // append li element to ul element
    }
}

// function to retrive weather data for city entered in search input
function getCurrentWeather(cityName) {

    let weatherReport = {}; // create object to hold weather report data

    // openweather api url for searching current weather by city name
    let requestUrl1 = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${openWeatherApiKey}&units=imperial`;


    fetch(requestUrl1)
        .then((response) => {
            return response.json();
        })
        .then(data1 => {

            // set weatherReport attributes based on response data
            weatherReport.city_name = data1.name; // set city name
            weatherReport.current_temp = data1.main.temp; // set current temp
            weatherReport.current_wind_speed = data1.wind.speed; // set wind speed
            weatherReport.current_humidity = data1.main.humidity; // set humidity
            weatherReport.current_weather_description = data1.weather[0].main; // set weather description
            weatherReport.current_weather_icon = data1.weather[0].icon; // set weather icon;

            // get latitude and longitude from response to use for next fetch request
            let cityLon = data1.coord.lon; //set city longitude
            let cityLat = data1.coord.lat; // set city latitude

            // openweather api url for searching detailed current weather and 5-day forecasts by city coordinates
            let requestUrl2 = `http://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly&appid=${openWeatherApiKey}&units=imperial`;

            // get basic weather info for city by name and use returned coordinates to make subsequent request for more info
            fetch(requestUrl2)
                .then((response) => {
                    return response.json();
                })
                .then((data2) => {

                    // set current_uv_index attribute based on response data
                    weatherReport.current_uv_index = data2.current.uvi;

                    // set attributes of weather report object based on relevant data from data2
                    weatherReport.daily_forecast = [
                        {
                            date: new Date(data2.daily[0].dt * 1000).toLocaleDateString("en-US"),
                            temp: data2.daily[0].temp.day,
                            wind: data2.daily[0].wind_speed,
                            humidity: data2.daily[0].humidity,
                            description: data2.daily[0].weather[0].main,
                            icon: data2.daily[0].weather[0].icon
                        },
                        {
                            date: new Date(data2.daily[1].dt * 1000).toLocaleDateString("en-US"),
                            temp: data2.daily[1].temp.day,
                            wind: data2.daily[1].wind_speed,
                            humidity: data2.daily[1].humidity,
                            description: data2.daily[1].weather[0].main,
                            icon: data2.daily[1].weather[0].icon
                        },
                        {
                            date: new Date(data2.daily[2].dt * 1000).toLocaleDateString("en-US"),
                            temp: data2.daily[2].temp.day,
                            wind: data2.daily[2].wind_speed,
                            humidity: data2.daily[2].humidity,
                            description: data2.daily[2].weather[0].main,
                            icon: data2.daily[2].weather[0].icon
                        },
                        {
                            date: new Date(data2.daily[3].dt * 1000).toLocaleDateString("en-US"),
                            temp: data2.daily[3].temp.day,
                            wind: data2.daily[3].wind_speed,
                            humidity: data2.daily[3].humidity,
                            description: data2.daily[3].weather[0].main,
                            icon: data2.daily[3].weather[0].icon
                        },
                        {
                            date: new Date(data2.daily[4].dt * 1000).toLocaleDateString("en-US"),
                            temp: data2.daily[4].temp.day,
                            wind: data2.daily[4].wind_speed,
                            humidity: data2.daily[4].humidity,
                            description: data2.daily[4].weather[0].main,
                            icon: data2.daily[4].weather[0].icon
                        }
                    ]

                    // assuming everything above succeeded, call function to add city to previous search list and update DOM
                    addToPreviousSearchList(weatherReport.city_name)
                });
        });

    // return weather report object
    return weatherReport;
};



// function to display weather report data in DOM
function displayWeatherReport(currentWeatherObj) {

}

// Add event listener for when city search button is clicked
cityToSearchButtonEl.addEventListener("click", async function () {

    let cityToSearch = cityToSearchInputEl.value.trim(); // create variable to hold name of city typed in by user

    cityToSearchInputEl.value = ''; //clear any text from city search input field

    // run function to retrieve and display weather info specific to search city

    let currentWeather = await getCurrentWeather(cityToSearch);
    console.log(currentWeather);
});
