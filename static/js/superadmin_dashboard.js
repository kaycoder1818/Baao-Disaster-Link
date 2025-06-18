// import { API_BASE_URL } from 'config.js';
const API_BASE_URL = 'https://recharge-ashen.vercel.app';

// DOM Elements
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const closeSidebarBtn = document.getElementById('closeSidebarBtn');
const addUserModal = document.getElementById('addUserModal');
const editUserModal = document.getElementById('editUserModal');
const addUserBtn = document.getElementById('adduserbtn');
const closeAddUserBtn = document.querySelector('.close-add-user');
const closeEditUserBtn = document.querySelector('.close-edit-user');
const refreshUsersBtn = document.getElementById('refresh-users-btn');
const usersTable = document.getElementById('users-table');

// Sidebar Toggle Functions
function openSidebar() {
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    hamburgerBtn.style.opacity = '0';
    hamburgerBtn.style.visibility = 'hidden';
}

function closeSidebar() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
    hamburgerBtn.style.opacity = '1';
    hamburgerBtn.style.visibility = 'visible';
}

// Modal Functions
function openModal(modal) {
    if (!modal) return;
    modal.style.display = 'block';
    setTimeout(() => modal.classList.add('active'), 10);
}

function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => modal.style.display = 'none', 300);
}

// Simple notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Fetch user data from API
async function fetchUserData() {
    try {
        console.log('Fetching users data...');
        const response = await fetch(`${API_BASE_URL}/user`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        console.log('Users data:', data);

        // Update the users table with the users_recharge array
        updateUsersTable(data.users_recharge || []);

    } catch (error) {
        console.error('Failed to fetch user data:', error);
        showErrorInTable('Error loading user data');
    }
}

// Update users table with data
function updateUsersTable(users) {
    const usersTable = document.getElementById('users-table');
    if (!usersTable) return;

    // Clear the table
    usersTable.innerHTML = '';

    if (!Array.isArray(users)) {
        users = [users];
    }

    users.forEach(user => {
        const row = document.createElement('tr');
        row.setAttribute('data-user-id', user.id);
        row.innerHTML = `
            <td>${user.id || '-'}</td>
            <td>${user.userName || '-'}</td>
            <td>${user.email || '-'}</td>
            <td><span class="role-badge role-${user.role?.toLowerCase()}">${user.role || 'User'}</span></td>
            <td>
                <button class="action-btn edit-btn" data-user-id="${user.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" data-user-id="${user.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        usersTable.appendChild(row);
    });

    // Add event listeners to the new buttons
    attachActionButtonListeners();
}

// Attach event listeners to action buttons
function attachActionButtonListeners() {
    // Edit buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', () => {
            const userId = button.getAttribute('data-user-id');
            handleEditUser(userId);
        });
    });

    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            const userId = button.getAttribute('data-user-id');
            handleDeleteUser(userId);
        });
    });
}

// Handle edit user
async function handleEditUser(userId) {
    const userRow = document.querySelector(`tr[data-user-id="${userId}"]`);
    if (!userRow) return;

    const userName = userRow.querySelector('td:nth-child(2)').textContent;
    const currentEmail = userRow.querySelector('td:nth-child(3)').textContent;
    const role = userRow.querySelector('td:nth-child(4)').textContent.trim();

    // Store the current email in a hidden field
    document.getElementById('edit-user-id').value = currentEmail; // Repurpose this field to store old email
    document.getElementById('edit-user-name').value = userName;
    document.getElementById('edit-user-email').value = currentEmail;
    document.getElementById('edit-user-role').value = role.toLowerCase();

    // Show the edit modal
    openModal(editUserModal);
}

// Handle delete user
async function handleDeleteUser(userId) {
    const userRow = document.querySelector(`tr[data-user-id="${userId}"]`);
    if (!userRow) return;

    // Get the user's email from the row
    const userEmail = userRow.querySelector('td:nth-child(3)').textContent;
    
    if (!confirm(`Are you sure you want to delete user with email: ${userEmail}?`)) return;

    try {
        const response = await fetch(`${API_BASE_URL}/user/delete`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: userEmail
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete user');
        }

        await fetchUserData(); // Refresh the table
        showNotification('User deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting user:', error);
        showNotification('Failed to delete user. Please try again.', 'error');
    }
}

// Show error in table when data loading fails
function showErrorInTable(message) {
    const usersTable = document.getElementById('users-table');
    if (!usersTable) return;

    usersTable.innerHTML = `
        <tr>
            <td colspan="5" style="text-align: center; color: #dc3545;">${message}</td>
        </tr>
    `;
}

// Function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to validate password strength
function isValidPassword(password) {
    return password.length >= 6; // Minimum 6 characters
}

// Initialize and set up event listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log('Superadmin Dashboard initialized');
    
    // Initial fetch
    fetchUserData();
    
    // Set up periodic refresh (every 30 seconds)
    setInterval(fetchUserData, 30000);

    // Sidebar Event Listeners
    hamburgerBtn.addEventListener('click', openSidebar);
    closeSidebarBtn.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);

    // Modal Event Listeners
    addUserBtn.addEventListener('click', () => openModal(addUserModal));
    closeAddUserBtn.addEventListener('click', () => closeModal(addUserModal));
    closeEditUserBtn.addEventListener('click', () => closeModal(editUserModal));

    // Refresh button
    refreshUsersBtn.addEventListener('click', () => {
        fetchUserData();
        showNotification('Refreshing user list...', 'info');
    });

    // Close sidebar when clicking a nav item on mobile
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeSidebar();
            }
        });
    });
});