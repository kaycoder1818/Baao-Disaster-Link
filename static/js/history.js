// import { API_BASE_URL } from 'config.js';
const API_BASE_URL = 'https://recharge-ashen.vercel.app';

// Sidebar Toggle functionality
const hamburgerBtn = document.getElementById('hamburgerBtn');
const closeSidebarBtn = document.getElementById('closeSidebarBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');

function openSidebar() {
    sidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    hamburgerBtn.style.opacity = '0';
    hamburgerBtn.style.visibility = 'hidden';
}

function closeSidebar() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    hamburgerBtn.style.opacity = '1';
    hamburgerBtn.style.visibility = 'visible';
}

// Event Listeners for Sidebar
hamburgerBtn.addEventListener('click', openSidebar);
closeSidebarBtn.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

// Close sidebar when clicking a nav item on mobile
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            closeSidebar();
        }
    });
});

// Filter Functionality
const dateRangeSelect = document.getElementById('dateRange');
const stationSelect = document.getElementById('station');
const historyTableBody = document.getElementById('historyTableBody');

async function updateHistoryTable() {
    const selectedDateRange = dateRangeSelect.value;
    const selectedStation = stationSelect.value;
    
    // Add loading state
    const tableContainer = document.querySelector('.history-table-container');
    tableContainer.classList.add('loading');

    try {
        // Get user email from localStorage
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
            throw new Error('User not logged in');
        }

        // Fetch bottle history
        const bottleHistory = await fetchBottleHistoryByEmail(userEmail);

        // Filter based on selected station if needed
        const filteredHistory = selectedStation === 'all' 
            ? bottleHistory 
            : bottleHistory.filter(record => record.bottleStation === selectedStation);

        // Group records by date and count occurrences
        const dailyTotals = filteredHistory.reduce((acc, record) => {
            const date = new Date(record.timestamp);
            const dateKey = date.toLocaleDateString(); // Get just the date part

            if (!acc[dateKey]) {
                acc[dateKey] = {
                    date: date,
                    count: 0,
                    stations: new Set()
                };
            }
            acc[dateKey].count += 1; // Count occurrences instead of summing bottles
            acc[dateKey].stations.add(record.bottleStation);
            return acc;
        }, {});

        // Clear existing table rows
        historyTableBody.innerHTML = '';

        // Add new rows sorted by date (most recent first)
        Object.values(dailyTotals)
            .sort((a, b) => b.date - a.date) // Sort by date descending
            .forEach(({ date, count, stations }) => {
                const row = document.createElement('tr');
                const formattedDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });
                row.innerHTML = `
                    <td>${formattedDate}</td>
                    <td>${Array.from(stations).join(', ')}</td>
                    <td class="bottle-count">${count}</td>
                `;
                historyTableBody.appendChild(row);
            });

        if (Object.keys(dailyTotals).length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="3" class="no-records">No bottle history records found</td>
            `;
            historyTableBody.appendChild(emptyRow);
        }
    } catch (error) {
        console.error('Error updating history table:', error);
        historyTableBody.innerHTML = `
            <tr>
                <td colspan="3" class="error-message">${error.message || 'Error loading bottle history. Please try again later.'}</td>
            </tr>
        `;
    } finally {
        // Remove loading state
        tableContainer.classList.remove('loading');
    }
}

async function fetchBottleHistoryByEmail(email) {
    try {
        const response = await fetch(`${API_BASE_URL}/user/bottle-history`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`HTTP error! Status: ${response.status}${errorData.message ? ` - ${errorData.message}` : ''}`);
        }

        const data = await response.json();
        const history = data.bottleHistory || [];

        const filteredHistory = history.map(record => ({
            bottleCount: record.bottleCount,
            bottleStation: record.fromStation,
            timestamp: record.timestamp
        }));

        return filteredHistory;
    } catch (error) {
        console.error('Error fetching bottle history:', error);
        throw error;
    }
}

// Event listeners for filters
dateRangeSelect.addEventListener('change', updateHistoryTable);
stationSelect.addEventListener('change', updateHistoryTable);

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
        window.location.replace('index.html');
        return;
    }

    updateHistoryTable();
});

