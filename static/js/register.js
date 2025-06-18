// import { API_BASE_URL } from 'config.js';
const API_BASE_URL = 'https://recharge-ashen.vercel.app';


// Function to show notifications
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
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

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('register-email').value.trim();
    const userName = document.getElementById('register-name').value.trim();
    const password = document.getElementById('register-password').value.trim();

    // Validate inputs
    if (!userName) {
        showNotification('Please enter your name', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    if (!isValidPassword(password)) {
        showNotification('Password must be at least 6 characters long', 'error');
        return;
    }

    // Create complete user data object with default values
    const userData = {
        email: email,
        userName: userName,
        passwordHash: password, // Backend will handle hashing
        role: 'user',         // default role
        status: 'active',     // default status
        groupId: 'groupB'     // default group
    };

    try {
        console.log('Attempting registration...');

        const response = await fetch(`${API_BASE_URL}/user/add`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok) {
            if (data.message && data.message.includes('already exists')) {
                throw new Error('Email already registered. Please use a different email.');
            }
            throw new Error(data.message || 'Failed to register user');
        }

        showNotification('Registration successful! Redirecting to login...', 'success');
        
        // Reset form
        e.target.reset();
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);

    } catch (error) {
        console.error('Registration error:', error);
        showNotification(error.message || 'Registration failed. Please try again.', 'error');
    }
});
