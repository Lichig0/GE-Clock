import clock from "clock";
import document from "document";
// Import the HeartRate module
import { HeartRateSensor } from "heart-rate";
import { today } from "user-activity";
import { goals } from "user-activity";
import { battery } from "power";

import * as util from "../common/utils";

// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
let time = document.getElementById("time");
let dateLabel = document.getElementById("date");
let dateName = document.getElementById("day-name");
let steps = document.getElementById("steps");
let placeLabel = document.getElementById("place");
let temperatureLabel = document.getElementById("temperature");
let myHeartRate = document.getElementById("myHeartRate");
let batteryLabel = document.getElementById("battery");
let batteryIcon = document.getElementById("battery-icon");
let conditionIcon = document.getElementById("condition-icon");

let stepBar = document.getElementById("step-bar");
let calBar = document.getElementById("cal-bar");
let activityBar = document.getElementById("activity-bar");
let distanceBar = document.getElementById("distance-bar");

var hrm = new HeartRateSensor();
console.log(goals.steps);
steps.text=today.local.steps;
myHeartRate.text = "---";
temperatureLabel.text = "   ";

hrm.onreading = function() {
  // Peek the current sensor values
  let hr = hrm.heartRate;
  
  // console.log("Current heart rate: " + hrm.heartRate);
  myHeartRate.text = `${hr}`;
}

// Update the <text> element with the current time
function updateClock() {
  let date = new Date();
  let month = date.getMonth()+1;
  let day = util.getDayName(date.getDay());
  let monthDay = date.getDate();
  let year = date.getFullYear();
  let hours = date.getHours();
  let mins = util.zeroPad(date.getMinutes());
  let bat = Math.floor(battery.chargeLevel) + "%"
  let amPm = util.isAmPm(hours);
  
  if(amPm === "pm") { hours = hours - 12; }
  hours = (hours === 0) ? 12 : hours;
 
  dateLabel.text = `${month}/${monthDay}/${year}`;
  dateName.text = day;
  time.text = `${hours}:${mins}${amPm}`;
  steps.text = today.local.steps;
  batteryLabel.text = `${bat}`;
  batteryIcon.href = util.setBatteryIcon(battery.chargeLevel);
  
  stepBar.height = (today.local.steps / goals.steps) * 250;
  calBar.height = (today.local.calories / goals.calories) * 250;
  activityBar.height = (today.local.activeMinutes / goals.activeMinutes) * 250;
  distanceBar.height = (today.local.distance / goals.distance) * 250;
  
}

// Update the clock every tick event
clock.ontick = () => updateClock();
hrm.start();

//Weather
// Import the messaging module
import * as messaging from "messaging";

// Request weather data from the companion
function fetchWeather() {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the companion
    messaging.peerSocket.send({
      command: 'weather'
    });
  }
}

// Display the weather data received from the companion
function processWeatherData(data) {
  console.log("The temperature is: " + data.temperature);
  console.log("Place is: " + data.name);
  placeLabel.text=data.name;
  temperatureLabel.text = Math.floor(data.temperature);
  conditionIcon.href = util.getWeatherIcon(data.conditions);
}

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  // Fetch weather when the connection opens
  fetchWeather();
}

// Listen for messages from the companion
messaging.peerSocket.onmessage = function(evt) {
  if (evt.data) {
    processWeatherData(evt.data);
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}
fetchWeather(); //Initial fetch.
// Fetch the weather every 15 minutes
setInterval(fetchWeather, 15 * 1000 * 60);