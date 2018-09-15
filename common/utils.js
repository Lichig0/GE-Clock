// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
//Return am or pm based on current hour.
export function isAmPm(hr) {
  let amPm = "am";
  
  if(hr > 12) {
    hr = hr - 12;
    amPm = "pm";
  }
  return amPm;
}
export function getDayName(dayInt) {
  switch (dayInt) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
  }
}

export function setBatteryIcon(batteryLevel) {
  if (batteryLevel >= 90) {
    return "images/battery/battery-100.png";
  } else if (batteryLevel >= 80) {
    return "images/battery/battery-90.png";
  } else if (batteryLevel >= 70) {
    return "images/battery/battery-80.png";
  } else if (batteryLevel >= 60) {
    return "images/battery/battery-70-green.png";
  } else if (batteryLevel >= 50) {
    return "images/battery/battery-60-green.png";
  } else if (batteryLevel >= 40) {
    return "images/battery/battery-50-green.png";
  } else if (batteryLevel >= 30) {
    return "images/battery/battery-40-green.png";
  } else if (batteryLevel >= 20) {
    return "images/battery/battery-30.png";
  } else if (batteryLevel >= 10) {
    return "images/battery/battery-20.png";
  } else if (batteryLevel < 10) {
    return "images/battery/battery-10.png";
  } else return "images/battery/battery-alert.png";
}

export function pulseImage(obj) {
  return obj;
}

//For OpenWeatherMap
export function getWeatherIcon(iconCode) {
  /* d = day, n = night
  01 - clear sky
  02 - few clouds
  03 - scattered clouds
  04 - broken clouds
  09 - shower rain
  10 - rain
  11 - thunderstorm
  13 - snow
  50 - mist
  */
  switch (iconCode) {
    case "01d":
        return "images/weather/weather-sunny.png";
    case "01n":
        return "images/weather/weather-night.png";
    case "02d":
    case "02n":
    case "03d":
    case "03n":
        return "images/weather/weather-partlycloudy.png";
    case "04d":
    case "04n":
      return "images/weather/weather-cloudy.png";
    case "09d":
    case "09n":
      return "images/weather/weather-rainy.png";
    case "10d":
    case "10n":
      return "images/weather/weather-pouring.png";
    case "11d":
    case "11n":
      return "images/weather/weather-lightning-rainy.png";
    case "13d":
    case "13n":
      return "images/weather/weather-snowy.png";
    case "50d":
    case "50n":
      return "images/weather/weather-fog.png";
    default:
      return "images/weather/weather-windy-variant.png";
  }
}
