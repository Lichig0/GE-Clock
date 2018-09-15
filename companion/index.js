// Import the messaging module
import * as messaging from "messaging";
import { me } from "companion";
import { geolocation } from "geolocation";
import { localStorage } from "local-storage";



// Helper
const MILLISECONDS_PER_MINUTE = 1000 * 60

// Wake the Companion after 30 minutes
me.wakeInterval = 15 * MILLISECONDS_PER_MINUTE
// Monitor for significant changes in physical location
me.monitorSignificantLocationChanges = true

let pos = getPosition();
let defaultPosition = { coords: { latitude: 0,longitude: 0, } };
let lastPosition;
const UNITS = "imperial";
const API_KEY = "12375bea240af71f5d583ed3fad02ba6";
const ENDPOINT = "https://api.openweathermap.org/data/2.5/weather?" 

function getPosition(weatherServiceCallback) 
{
  lastPosition = localStorage.getItem("lastPosition") || defaultPosition;
  // lastPosition = (lastPosition === undefined) ? defaultPosition : lastPosition;
  var tempPos = lastPosition;
  
  console.log("Last Pos: ", lastPosition);
  geolocation.getCurrentPosition( (position) => 
  {
   if(position != undefined) { tempPos = position }; 
    pos = position;
    lastPosition = position;
    console.log("Last position updated: ", lastPosition.coords.latitude + ", " + lastPosition.coords.longitude);
    
    (weatherServiceCallback != undefined) ? weatherServiceCallback(pos) : console.log("No callback function");
  }, (err) => 
 {
    console.log(err, "Using last position.");  // fetch(ENDPOINT + "lat="+ pos.coords.latitude + "&lon=" + pos.coords.longitude + "&units=" + UNITS + "&APPID=" + API_KEY)
    pos = lastPosition;
    (weatherServiceCallback != undefined) ? weatherServiceCallback(pos) : console.log(err);
  });
  return tempPos;
}

function updateWeather() {
  let cache = localStorage.getItem("weather");
  console.log("sending cached weather");
  if (cache !== undefined) {
    returnWeatherData(JSON.parse(cache));
  }
  getPosition(queryOpenWeather);
}

// Fetch the weather from OpenWeather
function queryOpenWeather(thisPos) {
  // getPosition();
  if(thisPos === undefined) {return;}
  fetch(`${ENDPOINT}lat=${thisPos.coords.latitude}&lon=${thisPos.coords.longitude}&units=${UNITS}&APPID=${API_KEY}`)
  .then(function (response) {
      response.json()
      .then(function(data) {
        // We just want the current temperature
        var weather = {
          temperature: data["main"]["temp"],
          conditions: data.weather[0].icon,
          name: data.name,
        }
        // console.log(JSON.stringify(weather));
        console.log("Sending updated weather");
        localStorage.setItem("weather", JSON.stringify(weather));
        // Send the weather data to the device
        returnWeatherData(weather);
      });
  })
  .catch(function (err) {
    console.log("Error fetching weather: " + err);
  });
}

// Send the weather data to the device
function returnWeatherData(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the device
    messaging.peerSocket.send(data);
  } else {
    console.log("Error: Connection is not open");
  }
}

if (me.launchReasons.wokenUp) {
  // The companion started due to a periodic timer
    console.log("Started due to wake interval!")
  updateWeather();
} else {
  // Close the companion and wait to be awoken
  me.yield()
}

if (me.launchReasons.locationChanged != null) {
  // The companion was started due to a significant change in physical location
  console.log("Significant location change!", me.launchReasons.locationChanged);
  
  pos = me.launchReasons.locationChanged.position;
  updateWeather();
  
  console.log("Latitude: " + pos.coords.latitude,
              "Longitude: " + pos.coords.longitude);
}

// Listen for messages from the device
messaging.peerSocket.onmessage = function(evt) {
  if (evt.data && evt.data.command == "weather") {
    // The device requested weather data
    console.log("Device wants weather data");
    updateWeather();
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}