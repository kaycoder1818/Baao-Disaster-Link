async function startApp() {
    const introContainer = document.querySelector('.intro-container');
    if (introContainer) {
        introContainer.style.display = 'none';
    } else {
        console.warn("[!] .intro-container not found.");
    }

    try {
        console.log("Checking /home availability...");
        const res = await fetch("/home", { method: "HEAD" });
        if (!res.ok) throw new Error("Flask /home route unavailable");

        console.log("[+] Navigating to Flask /home route");
        window.location.href = "/home";
    } catch (err) {
        console.log("[+] Falling back to static home.html");
        window.location.href = "home.html";
    }
}


function getGPS() {
  if (typeof Android !== "undefined" && Android.getGPSLocation) {
    Android.getGPSLocation();
  } else {
    alert("GPS function not available.");
  }
}

// Called by Android using: javascript:onReceiveGPS(lat, lng)
function onReceiveGPS(latitude, longitude) {
  const lat = latitude.toFixed(6);
  const lng = longitude.toFixed(6);

  // Store coordinates in localStorage
  localStorage.setItem('coordinates', JSON.stringify({ latitude: lat, longitude: lng }));

  // Update output display
  document.getElementById('gps-output').innerText = `Lat: ${lat}, Lng: ${lng}`;
}

function setup() {
  // Automatically call getGPS 1 second after page load
  setTimeout(getGPS, 1000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setup);
} else {
  setup();
}