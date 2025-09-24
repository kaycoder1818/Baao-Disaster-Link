// static\js\settings.js


// document.addEventListener("DOMContentLoaded", function () {
//     const routes = {
//         "disaster-prep": "/disaster-preparedness",
//         "fire-prep": "/fire-preparedness",
//         "earthquake-prep": "/earthquake-preparedness"
//     };

//     for (const [id, path] of Object.entries(routes)) {
//         const el = document.getElementById(id);
//         if (el) {
//             el.style.cursor = "pointer"; // show hand on hover
//             el.addEventListener("click", () => {
//                 window.location.href = path;
//             });
//         }
//     }
// });

const spinner = document.getElementById('sms-loading-spinner');



async function updateBackLink() {
const backLink = document.getElementById('back-link');
if (!backLink) {
    console.error("Back link element not found!");
    return;
}

try {
    console.log("Checking / availability...");
    const res = await fetch("/", { method: "GET" });
    if (!res.ok) throw new Error("Server route unavailable");

    console.log("[+] Using Flask route for back button");
    backLink.href = "/home";

} catch (err) {
    console.log("[+] Falling back to static .html back button");
    //   console.warn("[!] Falling back to static .html back button", err);
    backLink.href = "home.html";
}
}



function initDarkModeToggle() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    if (!darkModeToggle) {
        console.error("Dark mode toggle not found!");
        return;
    }

    // Load state from localStorage
    const savedState = localStorage.getItem('darkModeEnabled');
    if (savedState !== null) {
        const isEnabled = savedState === 'true';
        darkModeToggle.checked = isEnabled;

        // Reflect visually (optional: add a class to body or any theme logic)
        document.body.classList.toggle('dark-mode', isEnabled);
    }

    // Listen for toggle changes
    darkModeToggle.addEventListener('change', () => {
        const isChecked = darkModeToggle.checked;
        localStorage.setItem('darkModeEnabled', isChecked);

        // Reflect change immediately
        document.body.classList.toggle('dark-mode', isChecked);
    });
}


function initSmsAlertToggle() {
    const smsToggle = document.getElementById('sms-alert-toggle');

    if (!smsToggle) {
        console.error("SMS alert toggle not found!");
        return;
    }

    // Load saved state from localStorage
    const savedState = localStorage.getItem('smsAlertEnabled');
    if (savedState !== null) {
        smsToggle.checked = savedState === 'true';
    }

    // Listen for changes and update localStorage
    smsToggle.addEventListener('change', () => {
        localStorage.setItem('smsAlertEnabled', smsToggle.checked);
    });
}


function initLanguageSelect() {
    const languageSelect = document.getElementById('language-select');

    if (!languageSelect) {
        console.error("Language select element not found!");
        return;
    }

    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
        languageSelect.value = savedLanguage;
    } else {
        // Set to English by default
        languageSelect.value = 'en';
        localStorage.setItem('selectedLanguage', 'en');
    }

    // Save new selection on change
    languageSelect.addEventListener('change', () => {
        const selectedValue = languageSelect.value;
        localStorage.setItem('selectedLanguage', selectedValue);
    });
}


function showSmsModal() {
    const modal = document.getElementById('sms-modal-overlay');
    const closeBtn = document.getElementById('close-btn');
    const registerBtn = document.getElementById('register-btn');
    const input = document.getElementById('sms-number-input');
    const message = document.getElementById('sms-modal-message');

    if (!modal || !closeBtn || !registerBtn || !input || !message) return;

    // Reset fields
    input.value = '';
    message.textContent = '';
    message.className = 'message-text';

    // Show modal
    modal.classList.remove('hidden');

    // Register click
    registerBtn.onclick = async () => {
        const number = input.value.trim();
        message.textContent = '';
        message.className = 'message-text';

        // Only allow digits
        if (!/^\d+$/.test(number)) {
            message.textContent = "Please enter a valid number.";
            message.classList.add("error");
            return;
        }

        // Show spinner and disable button
        spinner.classList.remove('hidden');
        registerBtn.disabled = true;

        try {
            const res = await fetch('/api/add-subscriber', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobileNumber: number })
            });

            const data = await res.json();

            if (res.ok) {
                message.textContent = data.message || "Successfully subscribed!";
                message.classList.add("success");
            } else {
                message.textContent = data.error || "Subscription failed.";
                message.classList.add("error");
            }
        } catch (err) {
            message.textContent = "Request error. Try again.";
            message.classList.add("error");
        } finally {
            spinner.classList.add('hidden');       // Hide spinner
            registerBtn.disabled = false;          // Re-enable button
        }
    };

    // registerBtn.onclick = async () => {
    //     const number = input.value.trim();

    //     // Only allow digits
    //     if (!/^\d+$/.test(number)) {
    //         message.textContent = "Please enter a valid number.";
    //         message.classList.add("error");
    //         return;
    //     }

    //     try {
    //         const res = await fetch('/api/add-subscriber', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ mobileNumber: number })
    //         });

    //         const data = await res.json();

    //         if (res.ok) {
    //             message.textContent = data.message || "Successfully subscribed!";
    //             message.classList.add("success");
    //         } else {
    //             message.textContent = data.error || "Subscription failed.";
    //             message.classList.add("error");
    //         }
    //     } catch (err) {
    //         message.textContent = "Request error. Try again.";
    //         message.classList.add("error");
    //     }
    // };

    // Close button
    closeBtn.onclick = () => {
        modal.classList.add('hidden');
    };

    // Close modal by clicking outside
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    };
}



function initSmsAlertToggle() {
    const smsToggle = document.getElementById('sms-alert-toggle');
    const modal = document.getElementById('sms-modal-overlay');

    if (!smsToggle || !modal) {
        console.error("SMS toggle or modal not found!");
        return;
    }

    // Load saved state from localStorage
    const savedState = localStorage.getItem('smsAlertEnabled');
    if (savedState !== null) {
        smsToggle.checked = savedState === 'true';

        // Show modal if enabled
        if (smsToggle.checked) {
            showSmsModal();
        }
    }

    // Listen for changes and update localStorage
    smsToggle.addEventListener('change', () => {
        localStorage.setItem('smsAlertEnabled', smsToggle.checked);

        if (smsToggle.checked) {
            showSmsModal();
        }
    });
}


function initLocationToggle() {
  const locationToggle = document.getElementById('location-toggle');

  if (!locationToggle) {
    console.error("Location toggle not found!");
    return;
  }

  // Load saved state from localStorage
  const savedState = localStorage.getItem('locationTrackingEnabled');
  if (savedState !== null) {
    locationToggle.checked = savedState === 'true';
  }

  // Listen for toggle changes and save to localStorage
  locationToggle.addEventListener('change', () => {
    const isEnabled = locationToggle.checked;
    localStorage.setItem('locationTrackingEnabled', isEnabled);
    console.log(`Location tracking ${isEnabled ? 'enabled' : 'disabled'}.`);
  });
}





if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateBackLink);
    initDarkModeToggle();
    initSmsAlertToggle();
    initLanguageSelect();
    initLocationToggle();
} else {
    updateBackLink();
    initDarkModeToggle();
    initSmsAlertToggle();
    initLanguageSelect();
    initLocationToggle();
}
