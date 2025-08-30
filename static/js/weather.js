// static\js\weather.js

const REMOTE_API_BASE_URL = 'https://baao-disaster-link.vercel.app';


function startForecastFetch(endpoint) {
  async function fetchForecast(location) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location }),
      });

      if (!res.ok) throw new Error(`Forecast fetch failed: ${res.status}`);
      const data = await res.json();
      if (!data.forecastData) throw new Error('No forecastData in response');

      const forecast = data.forecastData;
      const update = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
      };

      update('outside-temp', forecast.outsideTemp);
      update('outside-weather', forecast.outsideWeather);
      update('wind-speed', forecast.windSpeed);
      update('humidity', forecast.humidity);
      update('visibility', forecast.visibility);

    } catch (err) {
      console.error('[!] Forecast fetch error:', err.message);
      ['outside-temp', 'outside-weather', 'wind-speed', 'humidity', 'visibility'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = 'Error';
      });
    }
  }

  fetchForecast('baao');
}

// function startWeatherCardFetch(endpoint) {
//   async function fetchCardWeather(location) {
//     try {
//       const res = await fetch(endpoint, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ location }),
//       });

//       if (!res.ok) throw new Error(`Weather card fetch failed: ${res.status}`);
//       const { weatherData, weatherLabel } = await res.json();

//       const iconPath = (cond) => {
//         const base = '/static/images/';
//         const key = cond?.toLowerCase();
//         return {
//           cloudy: 'cloudy.svg',
//           thunder: 'thunder2.svg',
//           rain: 'rain.svg',
//           sunny: 'sunny.svg',
//         }[key] ? base + {
//           cloudy: 'cloudy.svg',
//           thunder: 'thunder2.svg',
//           rain: 'rain.svg',
//           sunny: 'sunny.svg',
//         }[key] : base + 'default.svg';
//       };

//       const cards = [
//         { sel: ':nth-child(1)', d: weatherData.todayDate, w: weatherData.todayWeather, t: weatherData.todayTemp },
//         { sel: ':nth-child(2)', d: weatherData.tomorrowDate, w: weatherData.tomorrowWeather, t: weatherData.tomorrowTemp },
//         { sel: ':nth-child(3)', d: weatherData.lastDate, w: weatherData.lastWeather, t: weatherData.lastTemp, day: weatherLabel.lastDay },
//         { sel: ':nth-child(4)', d: weatherData.lastTwoDayDate, w: weatherData.lastTwoDayWeather, t: weatherData.lastTwoDayTemp, day: weatherLabel.lastTwoDay },
//       ];

//       cards.forEach(({ sel, d, w, t, day }) => {
//         const card = document.querySelector(`.weather-cards-container .vertical-box-2${sel}`);
//         if (!card) return;
//         card.querySelector('.card-date').textContent = d;
//         card.querySelector('.card-description').textContent = w;
//         card.querySelector('.card-temp').textContent = `${t}°C`;
//         card.querySelector('.card-icon img').src = iconPath(w);
//         if (day) card.querySelector('.card-day').textContent = day;
//       });

//     } catch (err) {
//       console.error('[!] Weather card fetch error:', err.message);
//       document.querySelectorAll('.card-description').forEach(el => el.textContent = 'Error');
//       document.querySelectorAll('.card-temp').forEach(el => el.textContent = '--°C');
//       document.querySelectorAll('.card-day').forEach((el, i) => { if (i > 1) el.textContent = 'Day Err'; });
//     }
//   }

//   fetchCardWeather('baao');
// }

function startWeatherCardFetch(endpoint) {
  async function fetchCardWeather(location) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location }),
      });

      if (!res.ok) throw new Error(`Weather card fetch failed: ${res.status}`);
      const { weatherData, weatherLabel } = await res.json();

      console.log("weatherData:", weatherData);
      console.log("weatherLabel:", weatherLabel);

      const getImageFilename = (cond) => {
        const map = {
          cloudy: 'cloudy.svg',
          thunder: 'thunder2.svg',
          rain: 'rain.svg',
          sunny: 'sunny.svg'
        };
        return map[cond?.toLowerCase()] || 'default.svg';
      };

      const loadIconWithFallback = (container, filename) => {
        const rawPath = `../static/images/${filename}`;
        const fallbackPath = `{{ url_for('static', filename='images/${filename}') }}`;

        const img = document.createElement('img');
        img.src = rawPath;
        img.alt = filename;
        img.className = 'weather-icon-img';

        img.onload = () => {
          container.innerHTML = '';
          container.appendChild(img);
        };

        img.onerror = () => {
          console.warn(`[!] Fallback for icon ${filename}`);
          const fallbackImg = document.createElement('img');
          fallbackImg.src = fallbackPath;
          fallbackImg.alt = filename;
          fallbackImg.className = 'weather-icon-img';
          container.innerHTML = '';
          container.appendChild(fallbackImg);
        };
      };

      const cards = [
        { sel: ':nth-child(1)', d: weatherData.todayDate, w: weatherData.todayWeather, t: weatherData.todayTemp },
        { sel: ':nth-child(2)', d: weatherData.tomorrowDate, w: weatherData.tomorrowWeather, t: weatherData.tomorrowTemp },
        { sel: ':nth-child(3)', d: weatherData.lastDate, w: weatherData.lastWeather, t: weatherData.lastTemp, day: weatherLabel.lastDay },
        { sel: ':nth-child(4)', d: weatherData.lastTwoDayDate, w: weatherData.lastTwoDayWeather, t: weatherData.lastTwoDayTemp, day: weatherLabel.lastTwoDay },
      ];

      cards.forEach(({ sel, d, w, t, day }) => {
        const card = document.querySelector(`.weather-cards-container .vertical-box-2${sel}`);
        if (!card) return;

        card.querySelector('.card-date').textContent = d;
        card.querySelector('.card-description').textContent = w;
        card.querySelector('.card-temp').textContent = `${t}°C`;

        const iconContainer = card.querySelector('.card-icon');
        if (iconContainer) {
          const filename = getImageFilename(w);
          loadIconWithFallback(iconContainer, filename);
        }

        if (day) {
          const dayEl = card.querySelector('.card-day');
          if (dayEl) dayEl.textContent = day;
        }
      });

    } catch (err) {
      console.error('[!] Weather card fetch error:', err.message);
      document.querySelectorAll('.card-description').forEach(el => el.textContent = 'Error');
      document.querySelectorAll('.card-temp').forEach(el => el.textContent = '--°C');
      document.querySelectorAll('.card-day').forEach((el, i) => { if (i > 1) el.textContent = 'Day Err'; });
    }
  }

  fetchCardWeather('baao');
}


function startDateFetch(endpoint) {
  async function fetchDate() {
    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`Date fetch failed: ${res.status}`);
      const { date } = await res.json();
      const el = document.querySelector('.date-text');
      if (el) el.textContent = date;
    } catch (err) {
      console.error('[!] Date fetch error:', err.message);
      const el = document.querySelector('.date-text');
      if (el) el.textContent = 'Date unavailable';
    }
  }

  fetchDate();
}

// // ---- DOMContentLoaded + Fallback Bootstrapping ---- //
// function runFetches() {
//   const endpoints = {
//     forecast: {
//       remote: `${REMOTE_API_BASE_URL}/forecast`,
//       local: '/forecast',
//       init: startForecastFetch
//     },
//     weather_data: {
//       remote: `${REMOTE_API_BASE_URL}/weather_data`,
//       local: '/weather_data',
//       init: startWeatherCardFetch
//     },
//     get_current_date: {
//       remote: `${REMOTE_API_BASE_URL}/get_current_date`,
//       local: '/get_current_date',
//       init: startDateFetch
//     }
//   };

//   Object.entries(endpoints).forEach(([key, { remote, local, init }]) => {
//     (async () => {
//       try {
//         console.log(`[*] Checking remote ${key}...`);
//         const method = key === 'get_current_date' ? 'GET' : 'POST';
//         const body = key === 'get_current_date' ? null : JSON.stringify({ location: 'baao' });

//         const res = await fetch(remote, {
//           method,
//           headers: { 'Content-Type': 'application/json' },
//           ...(body && { body })
//         });

//         if (!res.ok) throw new Error(`Remote ${key} failed`);
//         console.log(`[+] Using remote ${key}`);
//         init(remote);
//       } catch {
//         console.warn(`[!] ${key} remote fallback to local`);
//         init(local);
//       }
//     })();
//   });
// }

// if (document.readyState === 'loading') {
//   document.addEventListener('DOMContentLoaded', runFetches);
// } else {
//   runFetches();
// }

// ---- DOMContentLoaded + Fallback Bootstrapping ---- //
function runFetches() {
  const endpoints = {
    forecast: {
      remote: `${REMOTE_API_BASE_URL}/forecast`,
      local: '/forecast',
      init: startForecastFetch,
      method: 'POST',
      body: JSON.stringify({ location: 'baao' })
    },
    weather_data: {
      remote: `${REMOTE_API_BASE_URL}/weather_data`,
      local: '/weather_data',
      init: startWeatherCardFetch,
      method: 'POST',
      body: JSON.stringify({ location: 'baao' })
    },
    get_current_date: {
      remote: `${REMOTE_API_BASE_URL}/get_current_date`,
      local: '/get_current_date',
      init: startDateFetch,
      method: 'GET',
      body: null
    }
  };

  Object.entries(endpoints).forEach(([key, { remote, local, init, method, body }]) => {
    (async () => {
      try {
        console.log(`[1] Trying local ${key}: ${local}`);
        const res = await fetch(local, {
          method,
          headers: { 'Content-Type': 'application/json' },
          ...(body && { body })
        });

        if (!res.ok) throw new Error(`[!] Local ${key} failed: ${res.status}`);
        console.log(`[+] Local ${key} succeeded — using local`);
        init(local);
      } catch (err1) {
        console.warn(`[!] Local ${key} failed. Trying remote fallback...`);

        try {
          console.log(`[2] Trying remote ${key}: ${remote}`);
          const resRemote = await fetch(remote, {
            method,
            headers: { 'Content-Type': 'application/json' },
            ...(body && { body })
          });

          if (!resRemote.ok) throw new Error(`[!] Remote ${key} failed: ${resRemote.status}`);
          console.log(`[+] Remote ${key} succeeded — using remote`);
          init(remote);
        } catch (err2) {
          console.error(`[x] Both local and remote ${key} failed:`, err2.message);
        }
      }
    })();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runFetches);
} else {
  runFetches();
}


// document.addEventListener('DOMContentLoaded', (event) => {
//     // Function to fetch and update the current date
//     function updateCurrentDate() {
//         fetch('/get_current_date')
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok ' + response.statusText);
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 const dateTextElement = document.querySelector('.date-text');
//                 if (dateTextElement) {
//                     dateTextElement.textContent = data.date;
//                 }
//             })
//             .catch(error => {
//                 console.error('There has been a problem with your fetch operation:', error);
//                 // Optionally, display a default date or an error message
//                 const dateTextElement = document.querySelector('.date-text');
//                 if (dateTextElement && !dateTextElement.textContent.includes("Error")) {
//                     dateTextElement.textContent = "Date unavailable"; 
//                 }
//             });
//     }

//     // Function to fetch and update weather data for Baao
//     function updateWeatherData(location) {
//         fetch('/weather_data', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ location: location }), // Send the location in the request body
//         })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok ' + response.statusText);
//             }
//             return response.json();
//         })
//         .then(data => {


//             console.log('Weather data extracted:', data); // Log the extracted forecast object

//             const weatherData = data.weatherData;
//             const weatherLabel = data.weatherLabel; // Get the weatherLabel data

//             // Define a helper function to get the correct image path
//             function getWeatherIconPath(weatherCondition) {
//                 const baseStaticPath = '/static/images/'; // Direct path to your static images
//                 const lowerCaseCondition = weatherCondition.toLowerCase();
//                 if (lowerCaseCondition === 'cloudy') {
//                     return baseStaticPath + 'cloudy.svg';
//                 } else if (lowerCaseCondition === 'thunder') {
//                     return baseStaticPath + 'thunder2.svg';
//                 } else if (lowerCaseCondition === 'rain') {
//                     return baseStaticPath + 'rain.svg';
//                 } else if (lowerCaseCondition === 'sunny') {
//                     return baseStaticPath + 'sunny.svg';
//                 }
//                 // Add more conditions as needed
//                 return baseStaticPath + 'default.svg'; // A fallback default icon
//             }

//             // Update "Today" card (first card)
//             const todayCard = document.querySelector('.weather-cards-container .vertical-box-2:nth-child(1)');
//             if (todayCard) {
//                 todayCard.querySelector('.card-date').textContent = weatherData.todayDate;
//                 todayCard.querySelector('.card-description').textContent = weatherData.todayWeather;
//                 todayCard.querySelector('.card-temp').textContent = weatherData.todayTemp + '°C';
//                 todayCard.querySelector('.card-icon img').src = getWeatherIconPath(weatherData.todayWeather);
//                 // The .card-day for "Today" is intentionally not updated from API
//             }

//             // Update "Tomorrow" card (second card)
//             const tomorrowCard = document.querySelector('.weather-cards-container .vertical-box-2:nth-child(2)');
//             if (tomorrowCard) {
//                 tomorrowCard.querySelector('.card-date').textContent = weatherData.tomorrowDate;
//                 tomorrowCard.querySelector('.card-description').textContent = weatherData.tomorrowWeather;
//                 tomorrowCard.querySelector('.card-temp').textContent = weatherData.tomorrowTemp + '°C';
//                 tomorrowCard.querySelector('.card-icon img').src = getWeatherIconPath(weatherData.tomorrowWeather);
//                 // The .card-day for "Tomorrow" is intentionally not updated from API
//             }

//             // Update "Sunday" card (third card, using 'lastDay' label)
//             const sundayCard = document.querySelector('.weather-cards-container .vertical-box-2:nth-child(3)');
//             if (sundayCard) {
//                 sundayCard.querySelector('.card-date').textContent = weatherData.lastDate;
//                 sundayCard.querySelector('.card-description').textContent = weatherData.lastWeather;
//                 sundayCard.querySelector('.card-temp').textContent = weatherData.lastTemp + '°C';
//                 sundayCard.querySelector('.card-icon img').src = getWeatherIconPath(weatherData.lastWeather);
//                 // Update the day label for Sunday
//                 sundayCard.querySelector('.card-day').textContent = weatherLabel.lastDay;
//             }

//             // Update "Saturday" card (fourth card, using 'lastTwoDay' label)
//             const saturdayCard = document.querySelector('.weather-cards-container .vertical-box-2:nth-child(4)');
//             if (saturdayCard) {
//                 saturdayCard.querySelector('.card-date').textContent = weatherData.lastTwoDayDate;
//                 saturdayCard.querySelector('.card-description').textContent = weatherData.lastTwoDayWeather;
//                 saturdayCard.querySelector('.card-temp').textContent = weatherData.lastTwoDayTemp + '°C';
//                 saturdayCard.querySelector('.card-icon img').src = getWeatherIconPath(weatherData.lastTwoDayWeather);
//                 // Update the day label for Saturday
//                 saturdayCard.querySelector('.card-day').textContent = weatherLabel.lastTwoDay;
//             }

//         })
//         .catch(error => {
//             console.error('There has been a problem with your weather data fetch operation:', error);
//             // Optionally, display an error message on the cards
//             document.querySelectorAll('.weather-card .card-description').forEach(el => el.textContent = 'Error');
//             document.querySelectorAll('.weather-card .card-temp').forEach(el => el.textContent = '--°C');
//             document.querySelectorAll('.weather-cards-container .card-day:not(:nth-child(1)):not(:nth-child(2))').forEach(el => el.textContent = 'Day Err'); // Specific error for dynamic days
//         });
//     }


//     async function fetchWeatherData(location) {
//         try {
//             // console.log(`Attempting to fetch weather data for location: ${location}`);

//             const response = await fetch('/forecast', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ location: location }),
//             });
            
//             if (!response.ok) {
//                 const errorBody = await response.text();
//                 throw new Error(`Network response was not ok: ${response.status} ${response.statusText || ''}. Body: ${errorBody}`);
//             }
            
//             const data = await response.json();
//             // console.log('Received data from Flask API:', data); // This log confirms data receipt

//             // --- Update Current Weather Section ---
//             if (data.forecastData) {
//                 const forecast = data.forecastData;
//                 console.log('Forecast data extracted:', forecast); // Log the extracted forecast object

//                 // Update the outside temperature
//                 const outsideTempElement = document.getElementById('outside-temp');
//                 if (outsideTempElement) {
//                     outsideTempElement.textContent = forecast.outsideTemp;
//                     // console.log(`Updated #outside-temp to: ${forecast.outsideTemp}`);
//                 } else {
//                     console.warn('Element #outside-temp not found.');
//                 }

//                 // Update the outside weather description
//                 const outsideWeatherElement = document.getElementById('outside-weather');
//                 if (outsideWeatherElement) {
//                     outsideWeatherElement.textContent = forecast.outsideWeather;
//                     // console.log(`Updated #outside-weather to: ${forecast.outsideWeather}`);
//                 } else {
//                     console.warn('Element #outside-weather not found.');
//                 }

//                 // Update the wind speed
//                 const windSpeedElement = document.getElementById('wind-speed');
//                 if (windSpeedElement) {
//                     windSpeedElement.textContent = forecast.windSpeed;
//                     // console.log(`Updated #wind-speed to: ${forecast.windSpeed}`);
//                 } else {
//                     console.warn('Element #wind-speed not found.');
//                 }

//                 // Update the humidity
//                 const humidityElement = document.getElementById('humidity');
//                 if (humidityElement) {
//                     humidityElement.textContent = forecast.humidity;
//                     // console.log(`Updated #humidity to: ${forecast.humidity}`);
//                 } else {
//                     console.warn('Element #humidity not found.');
//                 }

//                 // Update the visibility
//                 const visibility = document.getElementById('visibility');
//                 if (visibility) {
//                     visibility.textContent = forecast.visibility;
//                     // console.log(`Updated #visibility to: ${forecast.visibility}`);
//                 } else {
//                     console.warn('Element #visibility not found.');
//                 }

//                 // Update the visibility
//                 // Select the specific number-gauge-small element within the visibility-box
//                 // const visibilityNumberElement = document.querySelector('#visibility-box .number-gauge-small');
//                 // if (visibilityNumberElement) {
//                 //     visibilityNumberElement.textContent = forecast.Visibility;
//                 //     console.log(`Updated visibility value to: ${forecast.Visibility}`);
//                 // } else {
//                 //     console.warn('Element for visibility value (#visibility-box .number-gauge-small) not found.');
//                 // }
//             } else if (data.message) {
//                 console.warn('API message:', data.message);
//                 const elementsToUpdate = [
//                     '#outside-temp', '#outside-weather', '#wind-speed', '#humidity',
//                     '#visibility-box .number-gauge-small'
//                 ];
//                 elementsToUpdate.forEach(selector => {
//                     const el = document.querySelector(selector);
//                     if (el) {
//                         el.textContent = 'N/A';
//                     }
//                 });
//             }

//         } catch (error) {
//             console.error('Error fetching current weather data:', error.message);
//             const elementsToUpdate = [
//                 '#outside-temp', '#outside-weather', '#wind-speed', '#humidity',
//                 '#visibility-box .number-gauge-small'
//             ];
//             elementsToUpdate.forEach(selector => {
//                 const el = document.querySelector(selector);
//                 if (el) {
//                     el.textContent = 'Error';
//                 }
//             });
//         }
//     }


//     // Call the function when the page loads
//     fetchWeatherData('baao');
//     updateWeatherData('baao');
//     updateCurrentDate();
// });

// function navigateToIndex() {
//     window.location.href = '/ui';
// }

// Function to handle the history button click
// function navigateToHistory() {
//     const button = document.getElementById("history-button");
//     const spinner = document.getElementById("history-spinner");

//     button.style.display = 'none';
//     spinner.style.display = 'block';

//     setTimeout(function() {
//         button.style.display = 'block';
//         spinner.style.display = 'none';
//         window.location.href = 'history.html';
//     }, 500); 
// }

// Function to handle the save button click
// function saveData() {
//     const button = document.getElementById("save-button");

//     button.innerHTML = '<div class="spinner" id="save-spinner"></div>'; 

//     const spinner = document.getElementById("save-spinner");
//     spinner.style.display = 'block';

//     setTimeout(function() {
//         spinner.style.display = 'none';
//         button.innerHTML = 'SAVE DATA';
        
//         setTimeout(function() {
//             alert('Save button clicked');
//         }, 500); 
//     }, 500); 
// }

// Function to update the indicator with the correct symbol based on the value
// function updateIndicator(value, elementId) {
//     const indicatorContainer = document.getElementById(elementId);

//     // Ensure value is treated as a number for strict comparison
//     value = Number(value);
//     // console.log("indicator:",value);

//     // Check if value is 1 (display ✔) or 0/other value (display X)
//     if (value === 1) {
//         indicatorContainer.innerHTML = `
//             <div class="horizontal-box">
//                 <div class="circle-check-outside">
//                     <div class="circle-check">
//                         <span class="checkmark-inside">✔</span>
//                     </div>
//                 </div>
//             </div>`;
//     } else {
//         indicatorContainer.innerHTML = `
//             <div class="horizontal-box">
//                 <div class="circle-check-outside">
//                     <div class="circle-check">
//                         <span class="checkmark-inside">✖</span>
//                     </div>
//                 </div>
//             </div>`;
//     }
// }


// document.addEventListener("DOMContentLoaded", function () {
//     const routes = {
//         "evacuation-box": "/evacuation",
//         "weather-box": "/weather",
//         "flood-box": "/flooding",
//         "accident-box": "/accident",
//         "wind-box": "/wind",
//         "humidity-box": "/humidity",
//         "visibility-box": "/visibility"
//     };

//     for (const [id, path] of Object.entries(routes)) {
//         const el = document.getElementById(id);
//         if (el) {
//             el.style.cursor = "pointer"; // show hand on hover
//             el.addEventListener("click", () => {
//                 window.location.href = path;
//             });
//         }
//     }
// });


// document.addEventListener("DOMContentLoaded", function () {
//     const navRoutes = {
//         "nav-home": "/",
//         "nav-phone": "/phone",
//         "nav-phonebook": "/phonebook",
//         "forecast-link": "/forecast-table"
//     };

//     for (const [id, path] of Object.entries(navRoutes)) {
//         const icon = document.getElementById(id);
//         if (icon) {
//             icon.style.cursor = "pointer";
//             icon.addEventListener("click", () => {
//                 window.location.href = path;
//             });
//         }
//     }
// });


function setupNavIcons(navRoutes) {
  for (const [id, path] of Object.entries(navRoutes)) {
    const icon = document.getElementById(id);
    if (icon) {
      icon.style.cursor = "pointer";
      icon.addEventListener("click", () => {
        window.location.href = path;
      });
    }
  }
}

async function checkServerAndSetupNav() {
  try {
    // Try to fetch a known backend route (like Flask's /)
    const res = await fetch('/', { method: 'GET' });
    if (!res.ok) throw new Error('Server route not available');

    // Flask-style routing (no .html)
    const navRoutes = {
      "nav-home": "/",
      "nav-phone": "/guide",
      "nav-emergency": "/emergency"
    };

    console.log("[+] Using remote navigation.");
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => setupNavIcons(navRoutes));
    } else {
      setupNavIcons(navRoutes);
    }

  } catch (err) {
    // Fallback to raw .html static routing
    const navRoutes = {
      "nav-home": "index.html",
      "nav-phone": "guide.html",
      "nav-emergency": "emergency.html"
    };

    console.log("[!] Remote navigation not available — falling back to static .html navigation.");
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => setupNavIcons(navRoutes));
    } else {
      setupNavIcons(navRoutes);
    }
  }
}



async function updateBackLink() {
const backLink = document.getElementById('back-link');
if (!backLink) {
    console.error("Back link element not found!");
    return;
}

try {
    console.log("Checking / availability...");
    const res = await fetch("/", { method: "GET" });
    if (!res.ok) throw new Error("Server route unavailable");

    console.log("[+] Using Flask route for back button");
    backLink.href = "/home";

} catch (err) {
    console.log("[+] Falling back to static .html back button");
    //   console.warn("[!] Falling back to static .html back button", err);
    backLink.href = "home.html";
}
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", updateBackLink);
  document.addEventListener("DOMContentLoaded", checkServerAndSetupNav);
} else {
  updateBackLink();
  checkServerAndSetupNav();
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('app').style.display = 'block';
  });
} else {
  document.getElementById('app').style.display = 'block';
}