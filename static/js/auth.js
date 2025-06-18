// import { API_BASE_URL } from 'config.js';
const API_BASE_URL = 'https://recharge-ashen.vercel.app';

// Function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to validate password
function isValidPassword(password) {
    return password.length >= 6; // Minimum 6 characters
}

// Function to get correct page for role
function getPageForRole(role) {
    switch(role?.toLowerCase()) {
        case 'admin':
            return '/admin-dashboard';
        case 'superadmin':
            return '/superadmin-dashboard';
        case 'user':
            return '/user-dashboard';
        default:
            return '/user-dashboard';
            // return '/';
    }
}

// Function to check if current page matches role
function isOnCorrectPage(role) {
    const currentPage = window.location.pathname;
    const correctPage = getPageForRole(role);
    return currentPage === correctPage || currentPage === correctPage + '/';
}

// Function to handle role-based redirection
function redirectBasedOnRole(role) {
    if (isOnCorrectPage(role)) {
        return;
    }

    const targetPage = getPageForRole(role);
    window.location.href = targetPage;
}

// Function to show error message
function showError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
}

// Function to set loading state
function setLoading(isLoading) {
    const button = document.querySelector('button[type="submit"]');
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// Function to show notification
function showNotification(message, type = 'success') {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.style.color = type === 'success' ? '#28a745' : '#dc3545';
}

// Function to handle login
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Clear previous error
    showError('');

    // Validate inputs
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }

    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }

    if (!isValidPassword(password)) {
        showError('Password must be at least 6 characters long');
        return;
    }

    try {
        setLoading(true);
        console.log('Attempting login...');

        const loginData = {
            email: email,
            passwordHash: password
        };

        const response = await fetch(`${API_BASE_URL}/auth/login/email`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        const data = await response.json();
        console.log('Login response:', data);

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        if (data.message !== 'Successful') {
            throw new Error('Login failed: ' + (data.message || 'Unknown error'));
        }

        // Fetch complete user details from /user endpoint
        const userResponse = await fetch(`${API_BASE_URL}/user`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.token}`
            }
        });

        if (!userResponse.ok) {
            throw new Error('Failed to fetch user details');
        }

        const userDetails = await userResponse.json();
        console.log('User details:', userDetails);
        console.log('Login email:', email);

        // Handle user details - it might be a single object or an array
        let matchedUser = null;
        
        if (Array.isArray(userDetails.users_recharge)) {
            console.log('All user emails:', userDetails.users_recharge.map(u => u.email));
            matchedUser = userDetails.users_recharge.find(
                user => user.email && user.email.toLowerCase().trim() === email.toLowerCase().trim()
            );
        } else if (Array.isArray(userDetails)) {
            matchedUser = userDetails.find(user => user.email && user.email.toLowerCase().trim() === email.toLowerCase().trim());
        } else if (userDetails && typeof userDetails === 'object') {
            if (userDetails.user && userDetails.user.email && userDetails.user.email.toLowerCase().trim() === email.toLowerCase().trim()) {
                matchedUser = userDetails.user;
            } else if (userDetails.email && userDetails.email.toLowerCase().trim() === email.toLowerCase().trim()) {
                matchedUser = userDetails;
            }
        }

        console.log('Matched user:', matchedUser);
        
        if (!matchedUser) {
            console.error('No matching user found. User details:', userDetails);
            throw new Error('User details not found');
        }

        // Store user session data
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', matchedUser.userName || '');
        localStorage.setItem('userRole', matchedUser.role || 'user');
        localStorage.setItem('lastLogin', matchedUser.timestamp || new Date().toISOString());
        localStorage.setItem('token', data.token || '');

        console.log('Session state:', {
            isAuthenticated: localStorage.getItem('isAuthenticated'),
            email: localStorage.getItem('userEmail'),
            userName: localStorage.getItem('userName'),
            role: localStorage.getItem('userRole'),
            lastLogin: localStorage.getItem('lastLogin')
        });

        showNotification('Login successful! Redirecting...', 'success');

        // Redirect based on user role after a short delay
        setTimeout(() => {
            redirectBasedOnRole(matchedUser.role || 'user');
        }, 1500);

    } catch (error) {
        console.error('Login error:', error);
        showError(error.message || 'Login failed. Please try again.');
    } finally {
        setLoading(false);
    }
}

// Function to check if user is already logged in
function checkAuthStatus() {
    const currentPage = window.location.pathname;
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('userRole');

    // Public pages (no auth needed)
    const publicPages = ['/', '/register', ''];
    
    // If not authenticated and trying to access protected page
    if (!isAuthenticated && !publicPages.includes(currentPage)) {
        window.location.href = '/';
        return;
    }

    // If authenticated and on public page, redirect to appropriate dashboard
    if (isAuthenticated && publicPages.includes(currentPage)) {
        redirectBasedOnRole(userRole);
        return;
    }

    // If authenticated but on wrong dashboard, redirect to correct one
    if (isAuthenticated && !isOnCorrectPage(userRole)) {
        redirectBasedOnRole(userRole);
        return;
    }
}

// Function to handle logout
window.handleLogout = function(e) {
    if (e) e.preventDefault();
    
    // Clear all authentication data
    localStorage.clear();
    sessionStorage.clear();
    
    // Redirect to login page
    window.location.href = '/';
}

// Function to set active sidebar item
function setActiveSidebarItem() {
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        // Remove active class from all items
        item.classList.remove('active');
        
        // Check if the item's onclick function matches the current path
        const onclickAttr = item.getAttribute('onclick');
        if (onclickAttr) {
            if (currentPath === '/user-dashboard' && onclickAttr.includes('navigateToDashboard')) {
                item.classList.add('active');
            } else if (currentPath === '/history' && onclickAttr.includes('navigateToHistory')) {
                item.classList.add('active');
            } else if (currentPath === '/rewards' && onclickAttr.includes('navigateToRewards')) {
                item.classList.add('active');
            } else if (currentPath === '/leaderboards' && onclickAttr.includes('navigateToLeaderboards')) {
                item.classList.add('active');
            }
        }
    });
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only check auth status if we're not already on the login page
    if (window.location.pathname !== '/') {
        checkAuthStatus();
    }

    // Add login form submit handler
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Add logout button handler
    const logoutBtns = document.querySelectorAll('#logout_btn, #logout');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', handleLogout);
    });

    // Set active sidebar item
    setActiveSidebarItem();
}); 