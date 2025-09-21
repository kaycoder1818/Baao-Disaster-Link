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




if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateBackLink);
    initDarkModeToggle();
    initSmsAlertToggle();
    initLanguageSelect(); 
} else {
    updateBackLink();
    initDarkModeToggle();
    initSmsAlertToggle();
    initLanguageSelect(); 
}
