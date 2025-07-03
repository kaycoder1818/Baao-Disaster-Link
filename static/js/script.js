// script.js

function startApp() {
    document.querySelector('.intro-container').style.display = 'none';
    // or redirect
    window.location.href = "/home";
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
        window.location.href = '/history';
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
    try {
        const indicatorContainer = document.getElementById(elementId);
        
        if (!indicatorContainer) {
            throw new Error(`Element with ID ${elementId} not found.`);
        }

        // Ensure value is treated as a number for strict comparison
        value = Number(value);

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
    } catch (error) {
        console.error("Error updating the indicator:", error);

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

    // Fetch new data from the API
    fetch("https://parcelpoint.vercel.app/watersense")
        .then(response => response.json())
        .then(data => {

            console.log(data);

            const watersense = data.watersense[0]; // Get the first record from the response

            // Update the localStorage with the new fetched data
            const updatedValues = {
                phlevel: watersense.phlevel,
                temperature: watersense.temperature,
                conductivity: watersense.conductivity,
                turbidity: watersense.turbidity,
                orp: watersense.orp,
                tds: watersense.tds,
                indicator: watersense.indicator  // Get the indicator value
            };

            // Store the updated values in localStorage
            localStorage.setItem('gaugeValues', JSON.stringify(updatedValues));

            // Update the gauges with the new values
            document.querySelector('.card-gauge .number-gauge').textContent = updatedValues.phlevel;
            document.querySelectorAll('.card-gauge')[1].querySelector('.number-gauge').textContent = updatedValues.temperature;
            document.querySelectorAll('.card-gauge')[2].querySelector('.number-gauge').textContent = updatedValues.conductivity;
            document.querySelectorAll('.card-gauge')[3].querySelector('.number-gauge').textContent = updatedValues.turbidity;
            document.querySelectorAll('.card-gauge')[4].querySelector('.number-gauge').textContent = updatedValues.orp;
            document.querySelectorAll('.card-gauge')[5].querySelector('.number-gauge').textContent = updatedValues.tds;

            // Update the indicator based on the API response
            updateIndicator(updatedValues.indicator, 'check-indicator');
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

// Call the function to fetch data and update gauges when the page loads
// document.addEventListener("DOMContentLoaded", function () {
//     fetchDataAndUpdateGauges();
// });
