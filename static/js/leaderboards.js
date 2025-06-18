// Sidebar Toggle functionality
const hamburgerBtn = document.getElementById('hamburgerBtn');
const closeSidebarBtn = document.getElementById('closeSidebarBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');

const API_BASE_URL = 'https://recharge-ashen.vercel.app';

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

let leaderboardData = null;

// Function to show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.querySelector('.dashboard-container').prepend(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Function to fetch leaderboard data
async function fetchLeaderboardData() {
    try {
        const response = await fetch(`${API_BASE_URL}/user/leaderboard`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch leaderboard data');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        showError('Failed to load leaderboard data. Please try again later.');
        return null;
    }
}

// Function to create a leaderboard entry
function createLeaderboardEntry(data, index) {
    const entry = document.createElement('div');
    entry.className = 'leaderboard-entry';
    
    entry.innerHTML = `
        <div class="rank-col">
            ${index + 1}
            ${index < 3 ? `<i class="fas fa-trophy rank-${index + 1}"></i>` : ''}
        </div>
        <div class="user-col">
            <i class="fas fa-user"></i>
            ${data.userName}
        </div>
        <div class="bottles-col">
            <i class="fas fa-bottle-water"></i>
            ${data.totalBottles}
        </div>
    `;
    
    return entry;
}

// Function to update leaderboard display
async function updateLeaderboard() {
    const leaderboardBody = document.getElementById('leaderboardBody');
    
    // Show loading state
    leaderboardBody.innerHTML = '<div class="loading">Loading leaderboard data...</div>';
    
    // Fetch new data
    const data = await fetchLeaderboardData();
    if (!data) return;
    
    // Update stored data
    leaderboardData = data.leaderboard;
    
    // Clear loading state
    leaderboardBody.innerHTML = '';
    
    // Add leaderboard entries
    leaderboardData.forEach((entry, index) => {
        leaderboardBody.appendChild(createLeaderboardEntry(entry, index));
    });
}

// Initialize leaderboard
document.addEventListener('DOMContentLoaded', () => {
    updateLeaderboard();
    
    // Refresh leaderboard every 5 minutes
    setInterval(updateLeaderboard, 5 * 60 * 1000);
}); 