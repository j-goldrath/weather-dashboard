// create variables to hold api key and request urls
let openWeatherApiKey = '28770702fffb29d20b1e4a1a73e133f1';

// create variables to target city search related elements
let cityToSearchInputEl = document.querySelector("input[name='city-search-input']"); //target city search input element by name
let cityToSearchButtonEl = document.querySelector("button[name='city-search-button']"); //target city search button element by name
let previousSearchListEl = document.getElementById("previous-search-list"); // target previous search list element by name
let currentWeatherRowEl = document.getElementById("current-weather");
let fiveDayForecastRowEl = document.getElementById("five-day-forecast");
let previousSearchesWrapperEl = document.getElementById("previous-searches-wrapper");

// create empty global array to hold previous searches
let previousSuccessfulSearches = [];

let currentWeatherReport={};

// function to add city to previous search list and update DOM
function addToPreviousSearchList(city) {

    // if this is the first time the parent function is called then the array will be empty, if so we need to remove class of d-none to display previous searches list
    if (previousSuccessfulSearches.length === 0) {
        previousSearchesWrapperEl.classList.remove("d-none");
    }

    // add city provided as argument to golbal array of previous searches
    if (!previousSuccessfulSearches.includes(city)) {
        previousSuccessfulSearches.push(city);
    }

    // blank out previous search list
    previousSearchListEl.innerHTML = "";

    // loop through global array of previous searches and add each city to previous search list by appending each li element to ul element
    for (let i = 0; i < previousSuccessfulSearches.length; i++) {

        let listItemAnchorEl = document.createElement("a");
        listItemAnchorEl.setAttribute('onclick', `getCurrentWeather("${previousSuccessfulSearches[i]}");`); // create anchor element to contain li element
        listItemAnchorEl.href = "#";
        let listItemEl = document.createElement("li"); // create li element to append to anchor element
        listItemEl.classList.add("list-group-item"); // add class of list-group-item to li element
        listItemEl.innerHTML = previousSuccessfulSearches[i]; // set innerHTML of li element to previous search city
        listItemAnchorEl.appendChild(listItemEl); // append li element to anchor element
        previousSearchListEl.appendChild(listItemAnchorEl); // append li element to ul element
    }
}

function iconLink(icon, size) {
    return `http://openweathermap.org/img/wn/${icon}@${size}x.png`
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
            weatherReport.cityName = data1.name; // set city name
            weatherReport.currentTemp = Math.round(data1.main.temp); // set current temp
            weatherReport.currentWindSpeed = Math.round(data1.wind.speed); // set wind speed
            weatherReport.currentHumidity = Math.round(data1.main.humidity); // set humidity
            weatherReport.currentWeatherDescription = data1.weather[0].main; // set weather description
            weatherReport.currentWeatherIcon = data1.weather[0].icon; // set weather icon;

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
                    weatherReport.currentUvIndex = data2.current.uvi;

                    // set attributes of weather report object based on relevant data from data2
                    weatherReport.dailyForecast = [
                        {
                            date: new Date(data2.daily[0].dt * 1000).toLocaleDateString("en-US"),
                            temp: Math.round(data2.daily[0].temp.day),
                            wind: Math.round(data2.daily[0].wind_speed),
                            humidity: Math.round(data2.daily[0].humidity),
                            description: data2.daily[0].weather[0].main,
                            icon: data2.daily[0].weather[0].icon
                        },
                        {
                            date: new Date(data2.daily[1].dt * 1000).toLocaleDateString("en-US"),
                            temp: Math.round(data2.daily[1].temp.day),
                            wind: Math.round(data2.daily[1].wind_speed),
                            humidity: Math.round(data2.daily[1].humidity),
                            description: data2.daily[1].weather[0].main,
                            icon: data2.daily[1].weather[0].icon
                        },
                        {
                            date: new Date(data2.daily[2].dt * 1000).toLocaleDateString("en-US"),
                            temp: Math.round(data2.daily[2].temp.day),
                            wind: Math.round(data2.daily[2].wind_speed),
                            humidity: Math.round(data2.daily[2].humidity),
                            description: data2.daily[2].weather[0].main,
                            icon: data2.daily[2].weather[0].icon
                        },
                        {
                            date: new Date(data2.daily[3].dt * 1000).toLocaleDateString("en-US"),
                            temp: Math.round(data2.daily[3].temp.day),
                            wind: Math.round(data2.daily[3].wind_speed),
                            humidity: Math.round(data2.daily[3].humidity),
                            description: data2.daily[3].weather[0].main,
                            icon: data2.daily[3].weather[0].icon
                        },
                        {
                            date: new Date(data2.daily[4].dt * 1000).toLocaleDateString("en-US"),
                            temp: Math.round(data2.daily[4].temp.day),
                            wind: Math.round(data2.daily[4].wind_speed),
                            humidity: Math.round(data2.daily[4].humidity),
                            description: data2.daily[4].weather[0].main,
                            icon: data2.daily[4].weather[0].icon
                        }
                    ]

                    // assuming everything above succeeded, call function to add city to previous search list and update DOM
                    addToPreviousSearchList(weatherReport.cityName)

                    let currentWeatherObj = weatherReport;

                    currentWeatherRowEl.innerHTML = ""; // clear current weather element
                    fiveDayForecastRowEl.innerHTML = ""; // clear five day forecast row element
                
                    console.log(currentWeatherObj.cityName);
                    // create html templte to use for current weather card
                    let currentWeatherCardEl = `
                    <div class="card mt-4">
                        <div class="card-body">
                            <h1 id="city-name" class="card-title">${currentWeatherObj.cityName}</h1>
                            <h5 class="card-text">Temp: <span id="current-temp">${currentWeatherObj.currentTemp}</span></h5>
                            <h5 class="card-text">Wind: <span id="current-wind-speed">${currentWeatherObj.currentWindSpeed}</span></h5>
                            <h5 class="card-text">Humidity: <span id="current-humidity">${currentWeatherObj.currentHumidity}</span></h5>
                            <h5 class="card-text">UV Index: <span id="current-uv-index">${currentWeatherObj.currentUvIndex}</span></h5>
                        </div>
                    </div>
                    `
                    console.log(currentWeatherObj.dailyForecast['0']);
                
                    let day1 = currentWeatherObj.dailyForecast['0'];
                    let day2 = currentWeatherObj.dailyForecast['1'];
                    let day3 = currentWeatherObj.dailyForecast['2'];
                    let day4 = currentWeatherObj.dailyForecast['3'];
                    let day5 = currentWeatherObj.dailyForecast['4'];
                
                    // create html template to use for five day forecast card
                    let fiveDayForcastCardEl = `
                    <div class="card mt-4">
                        <div class="card-body">
                            <h3 class="card-title">5 Day Forecast</h3>
                            <div class="row">
                                <div class="card col-sm m-2">
                                    <img src=${iconLink(day1.icon, 2)}>
                                    <p><span id="daily-date-1">${day1.date}</span></p>
                                    <p>Temp:<span id="daily-temp-1">${day1.temp} °F</span></p>
                                    <p>Wind: <span id="daily-wind-1">${day1.wind} mph</span></p>
                                    <p>Humidity: <span id="daily-humidity-1">${day1.humidity}%</span></p>
                                </div>
                                <div class="card col-sm m-2">
                                    <img src=${iconLink(day2.icon, 2)}>
                                    <p><span id="daily-date-1">${day2.date}</span></p>
                                    <p>Temp:<span id="daily-temp-1">${day2.temp} °F</span></p>
                                    <p>Wind: <span id="daily-wind-1">${day2.wind} mph</span></p>
                                    <p>Humidity: <span id="daily-humidity-1">${day2.humidity}%</span></p>
                                </div>
                                <div class="card col-sm m-2">
                                    <img src=${iconLink(day3.icon, 2)}>
                                    <p><span id="daily-date-1">${day3.date}</span></p>
                                    <p>Temp:<span id="daily-temp-1">${day3.temp} °F</span></p>
                                    <p>Wind: <span id="daily-wind-1">${day3.wind} mph</span></p>
                                    <p>Humidity: <span id="daily-humidity-1">${day3.humidity}%</span></p>
                                </div>
                                <div class="card col-sm m-2">
                                    <img src=${iconLink(day4.icon, 2)}>
                                    <p><span id="daily-date-1">${day4.date}</span></p>
                                    <p>Temp:<span id="daily-temp-1">${day4.temp} °F</span></p>
                                    <p>Wind: <span id="daily-wind-1">${day4.wind} mph</span></p>
                                    <p>Humidity: <span id="daily-humidity-1">${day4.humidity}%</span></p>
                                </div>
                                <div class="card col-sm m-2">
                                    <img src=${iconLink(day5.icon, 2)}>
                                    <p><span id="daily-date-1">${day5.date}</span></p>
                                    <p>Temp:<span id="daily-temp-1">${day5.temp} °F</span></p>
                                    <p>Wind: <span id="daily-wind-1">${day5.wind} mph</span></p>
                                    <p>Humidity: <span id="daily-humidity-1">${day5.humidity}%</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
                
                    // set inner html of required portions of dashbord to update weather for new search city
                    currentWeatherRowEl.innerHTML = currentWeatherCardEl;
                    fiveDayForecastRowEl.innerHTML = fiveDayForcastCardEl;
                

                });


        });

                    // return weather report object
                    currentWeatherReport = weatherReport;
                    return weatherReport;

};

// // function to display weather report data in DOM
// function displayWeatherReport(currentWeatherObj) {
//     currentWeatherRowEl.innerHTML = ""; // clear current weather element
//     fiveDayForecastRowEl.innerHTML = ""; // clear five day forecast row element

//     console.log(currentWeatherObj.cityName);
//     // create html templte to use for current weather card
//     let currentWeatherCardEl = `
//     <div class="card mt-4">
//         <div class="card-body">
//             <h1 id="city-name" class="card-title">${currentWeatherObj.cityName}</h1>
//             <h5 class="card-text">Temp: <span id="current-temp">${currentWeatherObj.currentTemp}</span></h5>
//             <h5 class="card-text">Wind: <span id="current-wind-speed">${currentWeatherObj.currentWindSpeed}</span></h5>
//             <h5 class="card-text">Humidity: <span id="current-humidity">${currentWeatherObj.currentHumidity}</span></h5>
//             <h5 class="card-text">UV Index: <span id="current-uv-index">${currentWeatherObj.currentUvIndex}</span></h5>
//         </div>
//     </div>
//     `
//     console.log(currentWeatherObj.dailyForecast['0']);

//     let day1 = currentWeatherObj.dailyForecast['0'];
//     let day2 = currentWeatherObj.dailyForecast['1'];
//     let day3 = currentWeatherObj.dailyForecast['2'];
//     let day4 = currentWeatherObj.dailyForecast['3'];
//     let day5 = currentWeatherObj.dailyForecast['4'];

//     // create html template to use for five day forecast card
//     let fiveDayForcastCardEl = `
//     <div class="card mt-4">
//         <div class="card-body">
//             <h3 class="card-title">5 Day Forecast</h3>
//             <div class="row">
//                 <div class="card col-sm m-2">
//                     <p><span id="daily-date-1">${day1.date}</span></p>
//                     <p>Temp:<span id="daily-temp-1">${day1.temp} °F</span></p>
//                     <p>Wind: <span id="daily-wind-1">${day1.wind} mph</span></p>
//                     <p>Humidity: <span id="daily-humidity-1">${day1.humidity}%</span></p>
//                 </div>
//                 <div class="card col-sm m-2">
//                     <p><span id="daily-date-1">${day2.date}</span></p>
//                     <p>Temp:<span id="daily-temp-1">${day2.temp} °F</span></p>
//                     <p>Wind: <span id="daily-wind-1">${day2.wind} mph</span></p>
//                     <p>Humidity: <span id="daily-humidity-1">${day2.humidity}%</span></p>
//                 </div>
//                 <div class="card col-sm m-2">
//                     <p><span id="daily-date-1">${day3.date}</span></p>
//                     <p>Temp:<span id="daily-temp-1">${day3.temp} °F</span></p>
//                     <p>Wind: <span id="daily-wind-1">${day3.wind} mph</span></p>
//                     <p>Humidity: <span id="daily-humidity-1">${day3.humidity}%</span></p>
//                 </div>
//                 <div class="card col-sm m-2">
//                     <p><span id="daily-date-1">${day4.date}</span></p>
//                     <p>Temp:<span id="daily-temp-1">${day4.temp} °F</span></p>
//                     <p>Wind: <span id="daily-wind-1">${day4.wind} mph</span></p>
//                     <p>Humidity: <span id="daily-humidity-1">${day4.humidity}%</span></p>
//                 </div>
//                 <div class="card col-sm m-2">
//                     <p><span id="daily-date-1">${day5.date}</span></p>
//                     <p>Temp:<span id="daily-temp-1">${day5.temp} °F</span></p>
//                     <p>Wind: <span id="daily-wind-1">${day5.wind} mph</span></p>
//                     <p>Humidity: <span id="daily-humidity-1">${day5.humidity}%</span></p>
//                 </div>
//             </div>
//         </div>
//     </div>
//     `

//     // set inner html of required portions of dashbord to update weather for new search city
//     currentWeatherRowEl.innerHTML = currentWeatherCardEl;
//     fiveDayForecastRowEl.innerHTML = fiveDayForcastCardEl;

// }

// Add event listener for when city search button is clicked
cityToSearchButtonEl.addEventListener("click", async function () {

    let cityToSearch = cityToSearchInputEl.value.trim(); // create variable to hold name of city typed in by user

    cityToSearchInputEl.value = ''; //clear any text from city search input field

    // run function to retrieve and display weather info specific to search city

    let currentWeather = await getCurrentWeather(cityToSearch);
    console.log(currentWeather);
    // console.log(currentWeather.dailyForecast[0]);
    // displayWeatherReport(currentWeather);
});
