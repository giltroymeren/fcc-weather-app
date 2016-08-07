// http://stackoverflow.com/a/28792224
var geocoder;
var city, country, weather;
var latitude, longitude, tempKelvin, tempCelcius, tempFahrenheit; tempKelvin - 273.15;

function onSuccess(position) {
    lat = position.coords.latitude;
    lng = position.coords.longitude;
    setAndGetLocation(lat, lng);
}

function onError(position) {
    console.error("Failure to access geolocation.");
}

function initialize() {
    geocoder = new google.maps.Geocoder();
    var latlng  = new google.maps.LatLng(35.652832, 139.839478);
}

function setAndGetLocation(latitude, longitude) {
    var coordinates = new google.maps.LatLng(latitude, longitude);
    geocoder.geocode({latLng: coordinates}, function(result, status) {
        if(status == google.maps.GeocoderStatus.OK) {
            city = result[0].address_components[1].short_name;
            country = result[0].address_components[4].short_name;

            document.getElementById("location").innerHTML =
                city + ", " + country;

            setAndGetWeatherAndTemp(latitude, longitude);
        } else {
            console.error("Geocoder failed because of " + status);
        }
    });
}

function getWeather(latitude, longitude, callback) {
    // http://stackoverflow.com/a/16825593
    var request = new XMLHttpRequest();
    request.onload = function() {
        if(request.readyState === 4 && request.status === 200) {
            callback(request.responseText);
        } else {
            console.error("XMLHttpRequest NOK " + request.status);
        }
    };
    var API_KEY_OPENWEATHER = "bb209e1daadb77216092394ad80fb386";
    request.open("GET",
        "http://api.openweathermap.org/data/2.5/weather?lat=" + latitude +
        "&lon=" + longitude + "&APPID=" + API_KEY_OPENWEATHER,
        true);
    request.send();
};

function setWeatherIcon(weather, icon) {
    console.log(weather + " " + icon);
    document.getElementById("weather").innerHTML = "<img src=" + icon +
        " alt="+ weather+ ">";
}

function setTemperature(temp, unit) {
    document.getElementById("temp-value").innerHTML = Math.floor(temp);
    document.getElementById("temp-unit").innerHTML = unit;
}

function setAndGetWeatherAndTemp(latitude, longitude) {
    // callbacks with parameters, cheers!
    getWeather(latitude, longitude, function(result) {
        var data = JSON.parse(result);
        weather = data["weather"][0]["main"];
        var icon = "http://openweathermap.org/img/w/" +
            data["weather"][0]["icon"] + ".png"
        tempKelvin = data["main"].temp;

        setWeatherIcon(weather, icon);

        tempCelcius = tempKelvin - 273.15;
        tempFahrenheit = (tempKelvin * 9 / 5) - 459.67;
        setTemperature(tempCelcius, "C");
    });
}

// https://gist.github.com/marchawkins/9755430
google.maps.event.addDomListener(window, 'load', initialize);

document.addEventListener('DOMContentLoaded', function(event) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }

    document.getElementById("temp-unit").addEventListener('click', function() {
        if(this.innerHTML === "C") {
            setTemperature(tempFahrenheit, "F")
        } else {
            setTemperature(tempCelcius, "C");
        }
    });
});