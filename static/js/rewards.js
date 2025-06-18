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

// Rewards Data
const rewardsData = [
    {
        id: 1,
        name: 'Movie Ticket',
        description: 'Get a free movie ticket at any cinema',
        points: 500,
        icon: 'fa-ticket'
    },
   
];

// Rewards Functionality
const totalPointsDisplay = document.getElementById('totalPoints');
const availableRewardsGrid = document.getElementById('availableRewards');
const confirmModal = document.getElementById('confirmModal');
const pointsCost = document.getElementById('pointsCost');
const confirmClaimBtn = document.getElementById('confirmClaim');
const cancelClaimBtn = document.getElementById('cancelClaim');

let currentPoints = parseInt(totalPointsDisplay.textContent);
let selectedReward = null;

// Create reward card element
function createRewardCard(reward) {
    const card = document.createElement('div');
    card.className = 'reward-card';
    card.innerHTML = `
        <div class="reward-image">
            <i class="fas ${reward.icon}"></i>
        </div>
        <div class="reward-info">
            <h3>${reward.name}</h3>
            <p>${reward.description}</p>
            <div class="reward-points">
                <i class="fas fa-star"></i>
                <span>${reward.points} points</span>
            </div>
        </div>
        <button class="claim-btn ${currentPoints < reward.points ? 'disabled' : ''}" 
                data-points="${reward.points}" 
                ${currentPoints < reward.points ? 'disabled' : ''}>
            ${currentPoints < reward.points ? 'Not Enough Points' : 'Redeem Reward'}
        </button>
    `;
    return card;
}

// Populate available rewards
function populateAvailableRewards() {
    availableRewardsGrid.innerHTML = '';
    rewardsData.forEach(reward => {
        const card = createRewardCard(reward);
        availableRewardsGrid.appendChild(card);
    });
    
    // Add event listeners to new claim buttons
    const claimButtons = document.querySelectorAll('.claim-btn');
    claimButtons.forEach(button => {
        if (!button.disabled) {
            button.addEventListener('click', () => showConfirmModal(button));
        }
    });
}

// Show confirmation modal
function showConfirmModal(rewardElement) {
    selectedReward = rewardElement;
    const points = rewardElement.dataset.points;
    pointsCost.textContent = points;
    confirmModal.style.display = 'block';
}

// Hide confirmation modal
function hideConfirmModal() {
    confirmModal.style.display = 'none';
    selectedReward = null;
}

// Claim reward
function claimReward() {
    if (!selectedReward) return;

    const points = parseInt(selectedReward.dataset.points);
    const rewardCard = selectedReward.closest('.reward-card');
    const rewardName = rewardCard.querySelector('h3').textContent;
    
    // Deduct points
    currentPoints -= points;
    totalPointsDisplay.textContent = currentPoints;
    
    // Update UI
    populateAvailableRewards();
    hideConfirmModal();

    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = `Successfully redeemed ${rewardName}!`;
    document.body.appendChild(successMessage);

    // Remove success message after 3 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 3000);
}

// Event Listeners for Rewards
confirmClaimBtn.addEventListener('click', claimReward);
cancelClaimBtn.addEventListener('click', hideConfirmModal);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === confirmModal) {
        hideConfirmModal();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
        window.location.replace('/');
        return;
    }

    populateAvailableRewards();
}); 