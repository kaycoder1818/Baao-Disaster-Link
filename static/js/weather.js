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
    function updateWeatherData() {
        fetch('/weather_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ location: 'baao' }), // Send the location in the request body
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
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



    // Call the function when the page loads
    updateCurrentDate();
    updateWeatherData();
});

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

