import { API_BASE_URL } from './config.js';

// Fetch total bottles from API
async function fetchTotalBottles() {
    try {
        console.log('Fetching total bottles...');
        const response = await fetch(`${API_BASE_URL}/admin/total-bottles`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        console.log('Total bottles response:', response);
        const data = await response.json();
        console.log('Total bottles data:', data);
        
        const bottleDisplay = document.querySelector(".bottles-content h1");
        if (bottleDisplay) {
            bottleDisplay.innerHTML = `${data.totalBottles || 0} <span>total</span>`;
        }

        // Update date
        const dateSpan = document.querySelector(".bottles .date");
        if (dateSpan) {
            const today = new Date();
            const options = { month: 'long', day: 'numeric', year: 'numeric' };
            dateSpan.textContent = "As of " + today.toLocaleDateString(undefined, options);
        }
    } catch (error) {
        console.error("Error fetching total bottles:", error);
        const bottleDisplay = document.querySelector(".bottles-content h1");
        if (bottleDisplay) {
            bottleDisplay.innerHTML = `Error loading data`;
        }
    }
}

// Fetch station records from API
async function fetchStationRecords() {
    try {
        console.log('Fetching station records...');
        const response = await fetch(`${API_BASE_URL}/admin/station`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        console.log('Station records response:', response);
        const data = await response.json();
        console.log('Station records data:', data);
        
        // Update station statuses
        const stations = document.querySelectorAll('.station');
        if (data.stations && Array.isArray(data.stations)) {
            data.stations.forEach((stationData, index) => {
                const station = stations[index];
                if (station) {
                    const statusDiv = station.querySelector('.available');
                    if (statusDiv) {
                        // Map the API's stationStatus to display status
                        let displayStatus = 'Available';
                        switch(stationData.stationStatus.toLowerCase()) {
                            case 'active':
                                displayStatus = 'Available';
                                break;
                            case 'inactive':
                                displayStatus = 'Offline';
                                break;
                            case 'maintenance':
                                displayStatus = 'Maintenance';
                                break;
                            case 'occupied':
                                displayStatus = 'Occupied';
                                break;
                            default:
                                displayStatus = stationData.stationStatus;
                        }
                        statusDiv.textContent = displayStatus;
                        statusDiv.className = displayStatus.toLowerCase();
                    }
                }
            });
        }

        // Update machine status based on station data
        updateMachineStatus(data.stations);
    } catch (error) {
        console.error("Error fetching station records:", error);
        const stations = document.querySelectorAll('.station');
        stations.forEach(station => {
            const statusDiv = station.querySelector('.available');
            if (statusDiv) {
                statusDiv.textContent = 'Error loading data';
                statusDiv.className = 'error';
            }
        });
    }
}

// Update overall machine status based on station data
function updateMachineStatus(stationData) {
    const statusDiv = document.querySelector(".status-button");
    if (!statusDiv) return;

    if (!Array.isArray(stationData) || stationData.length === 0) {
        statusDiv.textContent = "Error";
        statusDiv.className = "status-button error";
        return;
    }

    const allOffline = stationData.every(station => station.stationStatus.toLowerCase() === 'inactive');
    const anyMaintenance = stationData.some(station => station.stationStatus.toLowerCase() === 'maintenance');
    const allOccupied = stationData.every(station => station.stationStatus.toLowerCase() === 'occupied');

    if (allOffline) {
        statusDiv.textContent = "Offline";
        statusDiv.className = "status-button offline";
    } else if (anyMaintenance) {
        statusDiv.textContent = "Maintenance";
        statusDiv.className = "status-button maintenance";
    } else if (allOccupied) {
        statusDiv.textContent = "Full";
        statusDiv.className = "status-button full";
    } else {
        statusDiv.textContent = "Available";
        statusDiv.className = "status-button";
    }
}

// Initialize and set up refresh
document.addEventListener("DOMContentLoaded", () => {
    console.log('Dashboard initialized');
    // Initial fetch
    fetchTotalBottles();
    fetchStationRecords();
    
    // Set up periodic refresh (every 30 seconds)
    setInterval(() => {
        fetchTotalBottles();
        fetchStationRecords();
    }, 30000);
});

// Placeholder for status update
document.getElementById('update-status')?.addEventListener('click', function () {
    console.log('Updating machine status');
});

