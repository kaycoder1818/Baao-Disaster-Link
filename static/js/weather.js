// static\js\weather.js

document.addEventListener('DOMContentLoaded', (event) => {
    // Function to fetch and update the current date
    function updateCurrentDate() {
        fetch('/get_current_date')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                const dateTextElement = document.querySelector('.date-text');
                if (dateTextElement) {
                    dateTextElement.textContent = data.date;
                }
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
                // Optionally, display a default date or an error message
                const dateTextElement = document.querySelector('.date-text');
                if (dateTextElement && !dateTextElement.textContent.includes("Error")) {
                    dateTextElement.textContent = "Date unavailable"; 
                }
            });
    }

    // Function to fetch and update weather data for Baao
    function updateWeatherData(location) {
        fetch('/weather_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ location: location }), // Send the location in the request body
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {


            console.log('Weather data extracted:', data); // Log the extracted forecast object

            const weatherData = data.weatherData;
            const weatherLabel = data.weatherLabel; // Get the weatherLabel data

            // Define a helper function to get the correct image path
            function getWeatherIconPath(weatherCondition) {
                const baseStaticPath = '/static/images/'; // Direct path to your static images
                const lowerCaseCondition = weatherCondition.toLowerCase();
                if (lowerCaseCondition === 'cloudy') {
                    return baseStaticPath + 'cloudy.svg';
                } else if (lowerCaseCondition === 'thunder') {
                    return baseStaticPath + 'thunder2.svg';
                } else if (lowerCaseCondition === 'rain') {
                    return baseStaticPath + 'rain.svg';
                } else if (lowerCaseCondition === 'sunny') {
                    return baseStaticPath + 'sunny.svg';
                }
                // Add more conditions as needed
                return baseStaticPath + 'default.svg'; // A fallback default icon
            }

            // Update "Today" card (first card)
            const todayCard = document.querySelector('.weather-cards-container .vertical-box-2:nth-child(1)');
            if (todayCard) {
                todayCard.querySelector('.card-date').textContent = weatherData.todayDate;
                todayCard.querySelector('.card-description').textContent = weatherData.todayWeather;
                todayCard.querySelector('.card-temp').textContent = weatherData.todayTemp + '°C';
                todayCard.querySelector('.card-icon img').src = getWeatherIconPath(weatherData.todayWeather);
                // The .card-day for "Today" is intentionally not updated from API
            }

            // Update "Tomorrow" card (second card)
            const tomorrowCard = document.querySelector('.weather-cards-container .vertical-box-2:nth-child(2)');
            if (tomorrowCard) {
                tomorrowCard.querySelector('.card-date').textContent = weatherData.tomorrowDate;
                tomorrowCard.querySelector('.card-description').textContent = weatherData.tomorrowWeather;
                tomorrowCard.querySelector('.card-temp').textContent = weatherData.tomorrowTemp + '°C';
                tomorrowCard.querySelector('.card-icon img').src = getWeatherIconPath(weatherData.tomorrowWeather);
                // The .card-day for "Tomorrow" is intentionally not updated from API
            }

            // Update "Sunday" card (third card, using 'lastDay' label)
            const sundayCard = document.querySelector('.weather-cards-container .vertical-box-2:nth-child(3)');
            if (sundayCard) {
                sundayCard.querySelector('.card-date').textContent = weatherData.lastDate;
                sundayCard.querySelector('.card-description').textContent = weatherData.lastWeather;
                sundayCard.querySelector('.card-temp').textContent = weatherData.lastTemp + '°C';
                sundayCard.querySelector('.card-icon img').src = getWeatherIconPath(weatherData.lastWeather);
                // Update the day label for Sunday
                sundayCard.querySelector('.card-day').textContent = weatherLabel.lastDay;
            }

            // Update "Saturday" card (fourth card, using 'lastTwoDay' label)
            const saturdayCard = document.querySelector('.weather-cards-container .vertical-box-2:nth-child(4)');
            if (saturdayCard) {
                saturdayCard.querySelector('.card-date').textContent = weatherData.lastTwoDayDate;
                saturdayCard.querySelector('.card-description').textContent = weatherData.lastTwoDayWeather;
                saturdayCard.querySelector('.card-temp').textContent = weatherData.lastTwoDayTemp + '°C';
                saturdayCard.querySelector('.card-icon img').src = getWeatherIconPath(weatherData.lastTwoDayWeather);
                // Update the day label for Saturday
                saturdayCard.querySelector('.card-day').textContent = weatherLabel.lastTwoDay;
            }

        })
        .catch(error => {
            console.error('There has been a problem with your weather data fetch operation:', error);
            // Optionally, display an error message on the cards
            document.querySelectorAll('.weather-card .card-description').forEach(el => el.textContent = 'Error');
            document.querySelectorAll('.weather-card .card-temp').forEach(el => el.textContent = '--°C');
            document.querySelectorAll('.weather-cards-container .card-day:not(:nth-child(1)):not(:nth-child(2))').forEach(el => el.textContent = 'Day Err'); // Specific error for dynamic days
        });
    }


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
    updateWeatherData('baao');
    updateCurrentDate();
});

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
        "nav-phonebook": "/phonebook"
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

