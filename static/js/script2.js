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

// Function to fetch data and update gauges
function fetchDataAndUpdateGauges() {
    try {
        // Try to get values from localStorage (if available)
        let storedValues = JSON.parse(localStorage.getItem('gaugeValues'));

        // If no data is found in localStorage, initialize with 0
        if (!storedValues) {
            storedValues = {
                phlevel: 0,
                temperature: 0,
                conductivity: 0,
                turbidity: 0,
                orp: 0,
                tds: 0,
                indicator: 0  // Default indicator value
            };
        }

        // Update gauges with localStorage values (or 0 if not available)
        document.querySelector('.card-gauge .number-gauge').textContent = storedValues.phlevel;
        document.querySelectorAll('.card-gauge')[1].querySelector('.number-gauge').textContent = storedValues.temperature;
        document.querySelectorAll('.card-gauge')[2].querySelector('.number-gauge').textContent = storedValues.conductivity;
        document.querySelectorAll('.card-gauge')[3].querySelector('.number-gauge').textContent = storedValues.turbidity;
        document.querySelectorAll('.card-gauge')[4].querySelector('.number-gauge').textContent = storedValues.orp;
        document.querySelectorAll('.card-gauge')[5].querySelector('.number-gauge').textContent = storedValues.tds;

        // Update the indicator based on the API response
        updateIndicator(storedValues.indicator, 'check-indicator');
    } catch (error) {
        // Log any errors to the console
        console.error("Error fetching or updating gauges:", error);
        
        // Fallback values in case of error
        document.querySelector('.card-gauge .number-gauge').textContent = 0;
        document.querySelectorAll('.card-gauge')[1].querySelector('.number-gauge').textContent = 0;
        document.querySelectorAll('.card-gauge')[2].querySelector('.number-gauge').textContent = 0;
        document.querySelectorAll('.card-gauge')[3].querySelector('.number-gauge').textContent = 0;
        document.querySelectorAll('.card-gauge')[4].querySelector('.number-gauge').textContent = 0;
        document.querySelectorAll('.card-gauge')[5].querySelector('.number-gauge').textContent = 0;

        // Update the indicator with default value in case of error
        updateIndicator(0, 'check-indicator');
    }
}

// Call the function to fetch data and update gauges when the page loads
document.addEventListener("DOMContentLoaded", function () {
    fetchDataAndUpdateGauges();
});
