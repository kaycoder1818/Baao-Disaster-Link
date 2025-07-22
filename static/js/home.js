// script.js

function navigateToIndex() {
    window.location.href = '/ui';
}

// Function to handle the history button click
function navigateToHistory() {
    const button = document.getElementById("history-button");
    const spinner = document.getElementById("history-spinner");

    button.style.display = 'none';
    spinner.style.display = 'block';

    setTimeout(function() {
        button.style.display = 'block';
        spinner.style.display = 'none';
        window.location.href = 'history.html';
    }, 500); 
}

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


document.addEventListener('DOMContentLoaded', (event) => {

    async function fetchWeatherData(location) {
        try {
            // console.log(`Attempting to fetch weather data for location: ${location}`);

            const response = await fetch('/forecast', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ location: location }),
            });
            
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText || ''}. Body: ${errorBody}`);
            }
            
            const data = await response.json();
            // console.log('Received data from Flask API:', data); // This log confirms data receipt

            // --- Update Current Weather Section ---
            if (data.forecastData) {
                const forecast = data.forecastData;
                console.log('Forecast data extracted:', forecast); // Log the extracted forecast object

                // Update the outside temperature
                const outsideTempElement = document.getElementById('outside-temp');
                if (outsideTempElement) {
                    outsideTempElement.textContent = forecast.outsideTemp;
                    // console.log(`Updated #outside-temp to: ${forecast.outsideTemp}`);
                } else {
                    console.warn('Element #outside-temp not found.');
                }

                // Update the outside weather description
                const outsideWeatherElement = document.getElementById('outside-weather');
                if (outsideWeatherElement) {
                    outsideWeatherElement.textContent = forecast.outsideWeather;
                    // console.log(`Updated #outside-weather to: ${forecast.outsideWeather}`);
                } else {
                    console.warn('Element #outside-weather not found.');
                }

                // Update the wind speed
                const windSpeedElement = document.getElementById('wind-speed');
                if (windSpeedElement) {
                    windSpeedElement.textContent = forecast.windSpeed;
                    // console.log(`Updated #wind-speed to: ${forecast.windSpeed}`);
                } else {
                    console.warn('Element #wind-speed not found.');
                }

                // Update the humidity
                const humidityElement = document.getElementById('humidity');
                if (humidityElement) {
                    humidityElement.textContent = forecast.humidity;
                    // console.log(`Updated #humidity to: ${forecast.humidity}`);
                } else {
                    console.warn('Element #humidity not found.');
                }

                // Update the visibility
                const visibility = document.getElementById('visibility');
                if (visibility) {
                    visibility.textContent = forecast.visibility;
                    // console.log(`Updated #visibility to: ${forecast.visibility}`);
                } else {
                    console.warn('Element #visibility not found.');
                }

                // Update the visibility
                // Select the specific number-gauge-small element within the visibility-box
                // const visibilityNumberElement = document.querySelector('#visibility-box .number-gauge-small');
                // if (visibilityNumberElement) {
                //     visibilityNumberElement.textContent = forecast.Visibility;
                //     console.log(`Updated visibility value to: ${forecast.Visibility}`);
                // } else {
                //     console.warn('Element for visibility value (#visibility-box .number-gauge-small) not found.');
                // }
            } else if (data.message) {
                console.warn('API message:', data.message);
                const elementsToUpdate = [
                    '#outside-temp', '#outside-weather', '#wind-speed', '#humidity',
                    '#visibility-box .number-gauge-small'
                ];
                elementsToUpdate.forEach(selector => {
                    const el = document.querySelector(selector);
                    if (el) {
                        el.textContent = 'N/A';
                    }
                });
            }

        } catch (error) {
            console.error('Error fetching current weather data:', error.message);
            const elementsToUpdate = [
                '#outside-temp', '#outside-weather', '#wind-speed', '#humidity',
                '#visibility-box .number-gauge-small'
            ];
            elementsToUpdate.forEach(selector => {
                const el = document.querySelector(selector);
                if (el) {
                    el.textContent = 'Error';
                }
            });
        }
    }



    // Call the function when the page loads
    fetchWeatherData('baao');
});


document.addEventListener("DOMContentLoaded", function () {
    const routes = {
        "evacuation-box": "/evacuation",
        "weather-box": "/weather",
        "flood-box": "/flooding",
        "accident-box": "/accident",
        "wind-box": "/wind",
        "humidity-box": "/humidity",
        "visibility-box": "/visibility"
    };

    for (const [id, path] of Object.entries(routes)) {
        const el = document.getElementById(id);
        if (el) {
            el.style.cursor = "pointer"; // show hand on hover
            el.addEventListener("click", () => {
                window.location.href = path;
            });
        }
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const navRoutes = {
        "nav-home": "/",
        "nav-phone": "/phone",
        "nav-emergency": "/emergency"
    };

    for (const [id, path] of Object.entries(navRoutes)) {
        const icon = document.getElementById(id);
        if (icon) {
            icon.style.cursor = "pointer";
            icon.addEventListener("click", () => {
                window.location.href = path;
            });
        }
    }
});

