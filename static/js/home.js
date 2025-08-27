// script.js

const REMOTE_API_BASE_URL = 'https://baao-disaster-link.vercel.app';


function navigateToIndex() {
    window.location.href = '/ui';
}

// // Function to handle the history button click
// function navigateToSettings() {
//     const button = document.getElementById("settings-button");
//     const spinner = document.getElementById("settings-spinner");

//     button.style.display = 'none';
//     spinner.style.display = 'block';

//     setTimeout(function() {
//         button.style.display = 'block';
//         spinner.style.display = 'none';
//         window.location.href = '/settings';
//     }, 500); 
// }


async function navigateToSettings() {
    const button = document.getElementById("settings-button");
    const spinner = document.getElementById("settings-spinner");

    if (!button || !spinner) {
        console.error("[x] Settings button or spinner not found!");
        return;
    }

    // Show spinner, hide button
    button.style.display = "none";
    spinner.style.display = "block";

    try {
        console.log("Checking /settings availability...");
        const res = await fetch("/settings", { method: "GET" });
        if (!res.ok) throw new Error("Flask /settings route not available");

        console.log("[+] Navigating to Flask /settings route");
        window.location.href = "/settings";

    } catch (err) {
        console.log("[+] Falling back to static settings.html");
        window.location.href = "settings.html";
    } finally {
        setTimeout(() => {
            button.style.display = "block";
            spinner.style.display = "none";
        }, 500); // Optional short delay for smoother UX
    }
}

// You already use inline onclick in HTML, so no DOMContentLoaded wrapping needed here


// Function to handle the save button click
function saveData() {
    const button = document.getElementById("save-button");

    button.innerHTML = '<div class="spinner" id="save-spinner"></div>'; 

    const spinner = document.getElementById("save-spinner");
    spinner.style.display = 'block';

    setTimeout(function() {
        spinner.style.display = 'none';
        button.innerHTML = 'SAVE DATA';
        
        setTimeout(function() {
            alert('Save button clicked');
        }, 500); 
    }, 500); 
}

// Function to update the indicator with the correct symbol based on the value
function updateIndicator(value, elementId) {
    const indicatorContainer = document.getElementById(elementId);

    // Ensure value is treated as a number for strict comparison
    value = Number(value);
    // console.log("indicator:",value);

    // Check if value is 1 (display ✔) or 0/other value (display X)
    if (value === 1) {
        indicatorContainer.innerHTML = `
            <div class="horizontal-box">
                <div class="circle-check-outside">
                    <div class="circle-check">
                        <span class="checkmark-inside">✔</span>
                    </div>
                </div>
            </div>`;
    } else {
        indicatorContainer.innerHTML = `
            <div class="horizontal-box">
                <div class="circle-check-outside">
                    <div class="circle-check">
                        <span class="checkmark-inside">✖</span>
                    </div>
                </div>
            </div>`;
    }
}

// // Function to fetch data and update gauges
// function fetchDataAndUpdateGauges() {
//     try {
//         // Try to get values from localStorage (if available)
//         let storedValues = JSON.parse(localStorage.getItem('gaugeValues'));

//         // If no data is found in localStorage, initialize with 0
//         if (!storedValues) {
//             storedValues = {
//                 phlevel: 0,
//                 temperature: 0,
//                 conductivity: 0,
//                 turbidity: 0,
//                 orp: 0,
//                 tds: 0,
//                 indicator: 0  // Default indicator value
//             };
//         }

//         // Update gauges with localStorage values (or 0 if not available)
//         document.querySelector('.card-gauge .number-gauge').textContent = storedValues.phlevel;
//         document.querySelectorAll('.card-gauge')[1].querySelector('.number-gauge').textContent = storedValues.temperature;
//         document.querySelectorAll('.card-gauge')[2].querySelector('.number-gauge').textContent = storedValues.conductivity;
//         document.querySelectorAll('.card-gauge')[3].querySelector('.number-gauge').textContent = storedValues.turbidity;
//         document.querySelectorAll('.card-gauge')[4].querySelector('.number-gauge').textContent = storedValues.orp;
//         document.querySelectorAll('.card-gauge')[5].querySelector('.number-gauge').textContent = storedValues.tds;

//         // Update the indicator based on the API response
//         updateIndicator(storedValues.indicator, 'check-indicator');
//     } catch (error) {
//         // Log any errors to the console
//         console.error("Error fetching or updating gauges:", error);
        
//         // Fallback values in case of error
//         document.querySelector('.card-gauge .number-gauge').textContent = 0;
//         document.querySelectorAll('.card-gauge')[1].querySelector('.number-gauge').textContent = 0;
//         document.querySelectorAll('.card-gauge')[2].querySelector('.number-gauge').textContent = 0;
//         document.querySelectorAll('.card-gauge')[3].querySelector('.number-gauge').textContent = 0;
//         document.querySelectorAll('.card-gauge')[4].querySelector('.number-gauge').textContent = 0;
//         document.querySelectorAll('.card-gauge')[5].querySelector('.number-gauge').textContent = 0;

//         // Update the indicator with default value in case of error
//         updateIndicator(0, 'check-indicator');
//     }
// }

// // Call the function to fetch data and update gauges when the page loads
// document.addEventListener("DOMContentLoaded", function () {
//     fetchDataAndUpdateGauges();
// });


// document.addEventListener('DOMContentLoaded', (event) => {

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
// });


//   // Your test image for determining which API endpoint to use
//   const testImageJS2 = new Image();

//   testImageJS2.onload = function() {
//     console.log('[+] testImageJS2 loaded — use raw API');
//     startWeatherFetch('https://baao-disaster-link.vercel.app/forecast');
//   };

//   testImageJS2.onerror = function() {
//     console.log('[+] testImageJS2 failed to load — use local API');
//     startWeatherFetch('/forecast');
//   };

//   // Start loading test image (replace '.mobile' with your actual test file)
//   testImageJS2.src = '.mobile';

//   function startWeatherFetch(endpoint) {
//     async function fetchWeatherData(location) {
//       try {
//         const response = await fetch(endpoint, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ location }),
//         });

//         if (!response.ok) {
//           const errorBody = await response.text();
//           throw new Error(`Network response was not ok: ${response.status}. Body: ${errorBody}`);
//         }

//         const data = await response.json();
//         console.log('Received data:', data);

//         if (data.forecastData) {
//           const forecast = data.forecastData;
//           console.log('Forecast data extracted:', forecast);

//           const update = (id, value) => {
//             const el = document.getElementById(id);
//             if (el) el.textContent = value;
//             else console.warn(`Element #${id} not found.`);
//           };

//           update('outside-temp', forecast.outsideTemp);
//           update('outside-weather', forecast.outsideWeather);
//           update('wind-speed', forecast.windSpeed);
//           update('humidity', forecast.humidity);
//           update('visibility', forecast.visibility);
//         } else if (data.message) {
//           console.warn('API message:', data.message);
//           ['outside-temp', 'outside-weather', 'wind-speed', 'humidity', 'visibility'].forEach(id => {
//             const el = document.getElementById(id);
//             if (el) el.textContent = 'N/A';
//           });
//         }
//       } catch (error) {
//         console.error('Error fetching weather data:', error.message);
//         ['outside-temp', 'outside-weather', 'wind-speed', 'humidity', 'visibility'].forEach(id => {
//           const el = document.getElementById(id);
//           if (el) el.textContent = 'Error';
//         });
//       }
//     }

//     function runFetch() {
//       fetchWeatherData('baao');
//     }

//     // Run fetch after DOM is ready (or immediately if already ready)
//     if (document.readyState === 'loading') {
//       document.addEventListener('DOMContentLoaded', runFetch);
//     } else {
//       runFetch();
//     }
//   }

  function startWeatherFetch(endpoint) {
    async function fetchWeatherData(location) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ location }),
        });

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`Network response was not ok: ${response.status}. Body: ${errorBody}`);
        }

        const data = await response.json();
        console.log('Received data:', data);

        if (data.forecastData) {
          const forecast = data.forecastData;
          console.log('Forecast data extracted:', forecast);

          const update = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
            else console.warn(`Element #${id} not found.`);
          };

          update('outside-temp', forecast.outsideTemp);
          update('outside-weather', forecast.outsideWeather);
          update('wind-speed', forecast.windSpeed);
          update('humidity', forecast.humidity);
          update('visibility', forecast.visibility);
        } else if (data.message) {
          console.warn('API message:', data.message);
          ['outside-temp', 'outside-weather', 'wind-speed', 'humidity', 'visibility'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = 'N/A';
          });
        }
      } catch (error) {
        console.error('Error fetching weather data:', error.message);
        ['outside-temp', 'outside-weather', 'wind-speed', 'humidity', 'visibility'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.textContent = 'Error';
        });
        throw error; // Let caller know the fetch failed
      }
    }

    function runFetch() {
      fetchWeatherData('baao');
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runFetch);
    } else {
      runFetch();
    }
  }

  // Attempt remote fetch first, fallback if it throws
  (async function () {
    const remoteEndpoint = `${REMOTE_API_BASE_URL}/forecast`;
    const localEndpoint = '/forecast';

    try {
      console.log('[*] Trying remote forecast API...');
      await fetch(remoteEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: 'baao' }),
      });

      console.log('[+] Remote forecast API working — using remote');
      startWeatherFetch(remoteEndpoint);
    } catch (error) {
      console.log('[!] Remote forecast API failed — falling back to local');
      startWeatherFetch(localEndpoint);
    }
  })();


// document.addEventListener("DOMContentLoaded", function () {
//     const routes = {
//         "evacuation-box": "/evacuation",
//         "weather-box": "/weather",
//         "flood-box": "/flooding",
//         "accident-box": "/accident",
//         // "wind-box": "/wind",
//         // "humidity-box": "/humidity",
//         // "visibility-box": "/visibility"
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

// function setupNavigation() {
//   const testImage = new Image();

//   testImage.onload = function () {
//     // .mobile exists — enable navigation with .html suffix
//     const routes = {
//       "evacuation-box": "evacuation.html",
//       "weather-box": "weather.html",
//       "flood-box": "flooding.html",
//       "accident-box": "accident.html",
//     };

//     for (const [id, path] of Object.entries(routes)) {
//       const el = document.getElementById(id);
//       if (el) {
//         el.style.cursor = "pointer";
//         el.addEventListener("click", () => {
//           window.location.href = path;
//         });
//       }
//     }
//   };

//   testImage.onerror = function () {
//     // .mobile not present — enable navigation without .html suffix
//     const routes = {
//       "evacuation-box": "/evacuation",
//       "weather-box": "/weather",
//       "flood-box": "/flooding",
//       "accident-box": "/accident",
//     };

//     for (const [id, path] of Object.entries(routes)) {
//       const el = document.getElementById(id);
//       if (el) {
//         el.style.cursor = "pointer";
//         el.addEventListener("click", () => {
//           window.location.href = path;
//         });
//       }
//     }
//   };

//   testImage.src = ".mobile"; // trigger load test
// }

// // Run setupNavigation after DOM is ready (or immediately if already ready)
// if (document.readyState === "loading") {
//   document.addEventListener("DOMContentLoaded", setupNavigation);
// } else {
//   setupNavigation();
// }


function setupNavigation(routes) {
  for (const [id, path] of Object.entries(routes)) {
    const el = document.getElementById(id);
    if (el) {
      el.style.cursor = "pointer";
      el.addEventListener("click", () => {
        window.location.href = path;
      });
    }
  }
}

(async function initNavigation() {
  try {
    // Try a route you know only exists in server mode
    const res = await fetch('/', { method: 'GET' });
    if (!res.ok) throw new Error("Server route not found");

    console.log("[+] Using remote route navigation (no .html)");
    setupNavigation({
      "evacuation-box": "/evacuation",
      "weather-box": "/weather",
      "flood-box": "/flooding",
      "accident-box": "/accident",
    });

  } catch (err) {
    console.log("[!] Falling back to .html static navigation");
    setupNavigation({
      "evacuation-box": "evacuation.html",
      "weather-box": "weather.html",
      "flood-box": "flooding.html",
      "accident-box": "accident.html",
    });
  }
})();



// document.addEventListener("DOMContentLoaded", function () {
//     const navRoutes = {
//         "nav-home": "/",
//         "nav-phone": "/guide",
//         "nav-emergency": "/emergency"
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



// function setupNavIcons(navRoutes) {
//   for (const [id, path] of Object.entries(navRoutes)) {
//     const icon = document.getElementById(id);
//     if (icon) {
//       icon.style.cursor = "pointer";
//       icon.addEventListener("click", () => {
//         window.location.href = path;
//       });
//     }
//   }
// }

// function checkMobileAndSetupNav() {
//   const testImage = new Image();

//   testImage.onload = function () {
//     // .mobile exists — use this routing
//     const navRoutes = {
//       "nav-home": "index.html",
//       "nav-phone": "guide.html",
//       "nav-emergency": "emergency.html"
//     };

//     if (document.readyState === "loading") {
//       document.addEventListener("DOMContentLoaded", () => setupNavIcons(navRoutes));
//     } else {
//       setupNavIcons(navRoutes);
//     }
//   };

//   testImage.onerror = function () {
//     // .mobile not found — use fallback routing
//     const navRoutes = {
//       "nav-home": "/",
//       "nav-phone": "/guide",
//       "nav-emergency": "/emergency"
//     };

//     if (document.readyState === "loading") {
//       document.addEventListener("DOMContentLoaded", () => setupNavIcons(navRoutes));
//     } else {
//       setupNavIcons(navRoutes);
//     }
    
//     console.log(".mobile resource not found, fallback nav links activated.");
//   };

//   testImage.src = ".mobile"; // test .mobile presence
// }

// // Start the check immediately
// checkMobileAndSetupNav();



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

// Start the check immediately
checkServerAndSetupNav();


// /* Chatbot floating icon */

// const chatbotToggle = document.getElementById('chatbot-toggle');
// const chatbotModal = document.getElementById('chatbot-modal');
// const chatbotSend = document.getElementById('chatbot-send');
// const chatbotInput = document.getElementById('chatbot-input');
// const chatbotConversation = document.getElementById('chatbot-conversation');

// const conversationData = [];

// chatbotToggle.addEventListener('click', () => {
// chatbotModal.style.display = chatbotModal.style.display === 'flex' ? 'none' : 'flex';
// });

// function renderMessage(message, sender) {
// const div = document.createElement('div');
// div.classList.add('message', sender);
// div.textContent = message;
// chatbotConversation.appendChild(div);
// chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
// return div;
// }

// function showLoading() {
// const loader = document.createElement('div');
// loader.classList.add('message', 'bot', 'loading-bubble');
// loader.innerHTML = `
//     <span class="dot"></span>
//     <span class="dot"></span>
//     <span class="dot"></span>
// `;
// chatbotConversation.appendChild(loader);
// chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
// return loader;
// }

// async function sendMessage(message) {
// renderMessage(message, 'user');
// conversationData.push({ sender: 'user', message });

// const loading = showLoading();

// try {
//     const res = await fetch('/chat', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ message })
//     });

//     const data = await res.json();
//     const botReply = data.reply || "No response";

//     // Remove loading
//     chatbotConversation.removeChild(loading);

//     renderMessage(botReply, 'bot');
//     conversationData.push({ sender: 'bot', message: botReply });

// } catch (err) {
//     chatbotConversation.removeChild(loading);
//     renderMessage("Error connecting to server.", 'bot');
// }
// }

// chatbotSend.addEventListener('click', () => {
// const message = chatbotInput.value.trim();
// if (!message) return;
// chatbotInput.value = '';
// sendMessage(message);
// });

// chatbotInput.addEventListener('keydown', (e) => {
// if (e.key === 'Enter') chatbotSend.click();
// });

// window.addEventListener('beforeunload', () => {
// if (conversationData.length > 0) {
//     navigator.sendBeacon('/save-conversation', new Blob(
//     [JSON.stringify(conversationData)],
//     { type: 'application/json' }
//     ));
// }
// });


/* Chatbot floating icon */

// const chatbotToggle = document.getElementById('chatbot-toggle');
// const chatbotModal = document.getElementById('chatbot-modal');
// const chatbotSend = document.getElementById('chatbot-send');
// const chatbotInput = document.getElementById('chatbot-input');
// const chatbotConversation = document.getElementById('chatbot-conversation');

// const conversationData = [];

// let useRemoteAPI = false; // Will be set by image test

// // Test for .mobile image to determine environment
// const testImage = new Image();
// testImage.onload = () => {
//   console.log('[+] .mobile loaded — using remote API');
//   useRemoteAPI = true;
//   initChatbot();
// };
// testImage.onerror = () => {
//   console.log('[+] .mobile failed to load — using local API');
//   useRemoteAPI = false;
//   initChatbot();
// };
// testImage.src = '.mobile'; // Trigger the check

// function initChatbot() {
//   chatbotToggle.addEventListener('click', () => {
//     chatbotModal.style.display = chatbotModal.style.display === 'flex' ? 'none' : 'flex';
//   });

//   function renderMessage(message, sender) {
//     const div = document.createElement('div');
//     div.classList.add('message', sender);
//     div.textContent = message;
//     chatbotConversation.appendChild(div);
//     chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
//     return div;
//   }

//   function showLoading() {
//     const loader = document.createElement('div');
//     loader.classList.add('message', 'bot', 'loading-bubble');
//     loader.innerHTML = `
//       <span class="dot"></span>
//       <span class="dot"></span>
//       <span class="dot"></span>
//     `;
//     chatbotConversation.appendChild(loader);
//     chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
//     return loader;
//   }

//   async function sendMessage(message) {
//     renderMessage(message, 'user');
//     conversationData.push({ sender: 'user', message });

//     const loading = showLoading();

//     try {
//       const res = await fetch(
//         useRemoteAPI ? 'https://baao-disaster-link.vercel.app/chat' : '/chat',
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ message })
//         }
//       );

//       const data = await res.json();
//       const botReply = data.reply || "No response";

//       chatbotConversation.removeChild(loading);
//       renderMessage(botReply, 'bot');
//       conversationData.push({ sender: 'bot', message: botReply });

//     } catch (err) {
//       chatbotConversation.removeChild(loading);
//       renderMessage("Error connecting to server.", 'bot');
//     }
//   }

//   chatbotSend.addEventListener('click', () => {
//     const message = chatbotInput.value.trim();
//     if (!message) return;
//     chatbotInput.value = '';
//     sendMessage(message);
//   });

//   chatbotInput.addEventListener('keydown', (e) => {
//     if (e.key === 'Enter') chatbotSend.click();
//   });

//   window.addEventListener('beforeunload', () => {
//     if (conversationData.length > 0) {
//       navigator.sendBeacon(
//         useRemoteAPI ? 'https://baao-disaster-link.vercel.app/save-conversation' : '/save-conversation',
//         new Blob([JSON.stringify(conversationData)], { type: 'application/json' })
//       );
//     }
//   });
// }

/* Chatbot floating icon */

const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotModal = document.getElementById('chatbot-modal');
const chatbotSend = document.getElementById('chatbot-send');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotConversation = document.getElementById('chatbot-conversation');

const conversationData = [];

let useRemoteAPI = false; // Will be set by server route check

async function checkApiAvailability() {
  try {
    const res = await fetch('/', { method: 'GET' });
    if (!res.ok) throw new Error('Route not available');
    console.log('[+] / route available — using local API');
    useRemoteAPI = false;
  } catch {
    console.log('[+] / route not found — using remote API');
    useRemoteAPI = true;
  }
  initChatbot();
}

function initChatbot() {
  chatbotToggle.addEventListener('click', () => {
    chatbotModal.style.display = chatbotModal.style.display === 'flex' ? 'none' : 'flex';
  });

  function renderMessage(message, sender) {
    const div = document.createElement('div');
    div.classList.add('message', sender);
    div.textContent = message;
    chatbotConversation.appendChild(div);
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
    return div;
  }

  function showLoading() {
    const loader = document.createElement('div');
    loader.classList.add('message', 'bot', 'loading-bubble');
    loader.innerHTML = `
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    `;
    chatbotConversation.appendChild(loader);
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
    return loader;
  }

  async function sendMessage(message) {
    renderMessage(message, 'user');
    conversationData.push({ sender: 'user', message });

    const loading = showLoading();

    try {
      const res = await fetch(
        useRemoteAPI ? `${REMOTE_API_BASE_URL}/chat` : '/chat',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message })
        }
      );

      const data = await res.json();
      const botReply = data.reply || "No response";

      chatbotConversation.removeChild(loading);
      renderMessage(botReply, 'bot');
      conversationData.push({ sender: 'bot', message: botReply });

    } catch (err) {
      chatbotConversation.removeChild(loading);
      renderMessage("Error connecting to server.", 'bot');
    }
  }

  chatbotSend.addEventListener('click', () => {
    const message = chatbotInput.value.trim();
    if (!message) return;
    chatbotInput.value = '';
    sendMessage(message);
  });

  chatbotInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') chatbotSend.click();
  });

  window.addEventListener('beforeunload', () => {
    if (conversationData.length > 0) {
      navigator.sendBeacon(
        useRemoteAPI ? `${REMOTE_API_BASE_URL}/save-conversation` : '/save-conversation',
        new Blob([JSON.stringify(conversationData)], { type: 'application/json' })
      );
    }
  });
}

// Run check on script load
checkApiAvailability();


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('app').style.display = 'block';
  });
} else {
  document.getElementById('app').style.display = 'block';
}

