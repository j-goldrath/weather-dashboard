// create variables to hold api key and request urls
var openWeatherApiKey = '28770702fffb29d20b1e4a1a73e133f1';
var oneCallRequestUrl = 'https://api.openweathermap.org/data/2.5/onecall';
var geocodeRequestUrl = 'http://api.openweathermap.org/geo/1.0/direct';
// create variables to target city search related elements
var cityToSearchInputEl = document.querySelector("div.city-search input[name='city-search-input']"); //target city search input element by name
var cityToSearchButtonEl = document.querySelector("div.city-search button[name='city-search-button']"); //target city search button element by name


// this function takes city name as argument and reutnrs latitude and longtidue cordinates
function getCoordinatesFromCityName(cityName) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
      fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${openWeatherApiKey}`, requestOptions)
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
        //console.log("-------");
        //console.log(response);
        //console.log(response);
}
