// static\js\weather.js

const REMOTE_API_BASE_URL = 'https://baao-disaster-link.vercel.app';


function startForecastFetch(endpoint) {
  async function fetchForecast(location) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location }),
      });

      if (!res.ok) throw new Error(`Forecast fetch failed: ${res.status}`);
      const data = await res.json();
      if (!data.forecastData) throw new Error('No forecastData in response');

      const forecast = data.forecastData;
      const update = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
      };

      update('outside-temp', forecast.outsideTemp);
      update('outside-weather', forecast.outsideWeather);
      update('wind-speed', forecast.windSpeed);
      update('humidity', forecast.humidity);
      update('visibility', forecast.visibility);

    } catch (err) {
      console.error('[!] Forecast fetch error:', err.message);
      ['outside-temp', 'outside-weather', 'wind-speed', 'humidity', 'visibility'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = 'Error';
      });
    }
  }

  fetchForecast('baao');
}


function startWeatherCardFetch(endpoint) {
  async function fetchCardWeather(location) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location }),
      });

      if (!res.ok) throw new Error(`Weather card fetch failed: ${res.status}`);
      const { weatherData, weatherLabel } = await res.json();

      console.log("WeatherFullData:", res);

      console.log("weatherData:", weatherData);
      console.log("weatherLabel:", weatherLabel);

      const getImageFilename = (cond) => {
        const map = {
          cloudy: 'cloudy.svg',
          thunder: 'thunder2.svg',
          rain: 'rain.svg',
          sunny: 'sunny.svg'
        };
        return map[cond?.toLowerCase()] || 'default.svg';
      };

      const loadIconWithFallback = (container, filename) => {
        const rawPath = `../static/images/${filename}`;
        const fallbackPath = `{{ url_for('static', filename='images/${filename}') }}`;

        const img = document.createElement('img');
        img.src = rawPath;
        img.alt = filename;
        img.className = 'weather-icon-img';

        img.onload = () => {
          container.innerHTML = '';
          container.appendChild(img);
        };

        img.onerror = () => {
          console.warn(`[!] Fallback for icon ${filename}`);
          const fallbackImg = document.createElement('img');
          fallbackImg.src = fallbackPath;
          fallbackImg.alt = filename;
          fallbackImg.className = 'weather-icon-img';
          container.innerHTML = '';
          container.appendChild(fallbackImg);
        };
      };

      const cards = [
        { sel: ':nth-child(1)', d: weatherData.todayDate, w: weatherData.todayWeather, t: weatherData.todayTemp },
        { sel: ':nth-child(2)', d: weatherData.tomorrowDate, w: weatherData.tomorrowWeather, t: weatherData.tomorrowTemp },
        { sel: ':nth-child(3)', d: weatherData.lastDate, w: weatherData.lastWeather, t: weatherData.lastTemp, day: weatherLabel.lastDay },
        { sel: ':nth-child(4)', d: weatherData.lastTwoDayDate, w: weatherData.lastTwoDayWeather, t: weatherData.lastTwoDayTemp, day: weatherLabel.lastTwoDay },
      ];

      cards.forEach(({ sel, d, w, t, day }) => {
        const card = document.querySelector(`.weather-cards-container .vertical-box-2${sel}`);
        if (!card) return;

        card.querySelector('.card-date').textContent = d;
        card.querySelector('.card-description').textContent = w;
        card.querySelector('.card-temp').textContent = `${t}°C`;

        const iconContainer = card.querySelector('.card-icon');
        if (iconContainer) {
          const filename = getImageFilename(w);
          loadIconWithFallback(iconContainer, filename);
        }

        if (day) {
          const dayEl = card.querySelector('.card-day');
          if (dayEl) dayEl.textContent = day;
        }
      });

    } catch (err) {
      console.error('[!] Weather card fetch error:', err.message);
      document.querySelectorAll('.card-description').forEach(el => el.textContent = 'Error');
      document.querySelectorAll('.card-temp').forEach(el => el.textContent = '--°C');
      document.querySelectorAll('.card-day').forEach((el, i) => { if (i > 1) el.textContent = 'Day Err'; });
    }
  }

  fetchCardWeather('baao');
}


function startDateFetch(endpoint) {
  async function fetchDate() {
    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`Date fetch failed: ${res.status}`);
      const { date } = await res.json();
      const el = document.querySelector('.date-text');
      if (el) el.textContent = date;
    } catch (err) {
      console.error('[!] Date fetch error:', err.message);
      const el = document.querySelector('.date-text');
      if (el) el.textContent = 'Date unavailable';
    }
  }

  fetchDate();
}



function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runFetches() {
  const endpoints = {
    forecast: {
      remote: `${REMOTE_API_BASE_URL}/forecast`,
      local: '/forecast',
      init: startForecastFetch,
      method: 'POST',
      body: JSON.stringify({ location: 'baao' })
    },
    weather_data: {
      remote: `${REMOTE_API_BASE_URL}/weather_data`,
      local: '/weather_data',
      init: startWeatherCardFetch,
      method: 'POST',
      body: JSON.stringify({ location: 'baao' })
    },
    get_current_date: {
      remote: `${REMOTE_API_BASE_URL}/get_current_date`,
      local: '/get_current_date',
      init: startDateFetch,
      method: 'GET',
      body: null
    }
  };

  for (const [key, { remote, local, init, method, body }] of Object.entries(endpoints)) {
    try {
      console.log(`[1] Trying local ${key}: ${local}`);
      const res = await fetch(local, {
        method,
        headers: { 'Content-Type': 'application/json' },
        ...(body && { body })
      });

      if (!res.ok) throw new Error(`[!] Local ${key} failed: ${res.status}`);
      console.log(`[+] Local ${key} succeeded — using local`);
      init(local);
    } catch (err1) {
      console.warn(`[!] Local ${key} failed. Trying remote fallback...`);

      try {
        console.log(`[2] Trying remote ${key}: ${remote}`);
        const resRemote = await fetch(remote, {
          method,
          headers: { 'Content-Type': 'application/json' },
          ...(body && { body })
        });

        if (!resRemote.ok) throw new Error(`[!] Remote ${key} failed: ${resRemote.status}`);
        console.log(`[+] Remote ${key} succeeded — using remote`);
        init(remote);
      } catch (err2) {
        console.error(`[x] Both local and remote ${key} failed:`, err2.message);
      }
    }

    // Delay 1 second before next fetch
    await delay(1000);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runFetches);
} else {
  runFetches();
}



function setupNavIcons(navRoutes) {
  for (const [id, path] of Object.entries(navRoutes)) {
    const icon = document.getElementById(id);
    if (icon) {
      icon.style.cursor = "pointer";
      icon.addEventListener("click", () => {
        window.location.href = path;
      });
    }
  }
}

async function checkServerAndSetupNav() {
  try {
    // Try to fetch a known backend route (like Flask's /)
    const res = await fetch('/', { method: 'GET' });
    if (!res.ok) throw new Error('Server route not available');

    // Flask-style routing (no .html)
    const navRoutes = {
      "nav-home": "/",
      "nav-phone": "/guide",
      "nav-emergency": "/emergency"
    };

    console.log("[+] Using remote navigation.");
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => setupNavIcons(navRoutes));
    } else {
      setupNavIcons(navRoutes);
    }

  } catch (err) {
    // Fallback to raw .html static routing
    const navRoutes = {
      "nav-home": "index.html",
      "nav-phone": "guide.html",
      "nav-emergency": "emergency.html"
    };

    console.log("[!] Remote navigation not available — falling back to static .html navigation.");
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => setupNavIcons(navRoutes));
    } else {
      setupNavIcons(navRoutes);
    }
  }
}



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



const btn = document.getElementById('weekly-forecast-btn');
const modal = document.getElementById('forecast-modal');
const closeBtn = document.getElementById('close-modal-btn');
const spinner = document.getElementById('spinner');
const typhoonImage = document.getElementById('typhoon-image');

// btn.addEventListener('click', () => {
//   // Show modal
//   modal.classList.remove('hidden');

//   // Show spinner, hide image initially
//   spinner.style.display = 'flex';
//   typhoonImage.style.display = 'none';

//   // Set image src to flask route
//   typhoonImage.src = '/api/image/typhoon';

//   // When image loads, hide spinner and show image
//   typhoonImage.onload = () => {
//     spinner.style.display = 'none';
//     typhoonImage.style.display = 'block';
//   };

//   // If image fails to load, hide spinner and show error text (optional)
//   typhoonImage.onerror = () => {
//     spinner.style.display = 'none';
//     typhoonImage.style.display = 'none';
//     // alert('Failed to load typhoon image.');
//     modal.classList.add('hidden');
//   };
// });


btn.addEventListener('click', async () => {
  // Show modal
  modal.classList.remove('hidden');

  // Show spinner, hide image initially
  spinner.style.display = 'flex';
  typhoonImage.style.display = 'none';

  // Try to load the local image first
  const localSrc = '/api/image/typhoon';
  const remoteSrc = `${REMOTE_API_BASE_URL}/api/image/typhoon`;

  // Helper to test if an image URL is available
  async function imageExists(url) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      return res.ok;
    } catch {
      return false;
    }
  }

  let srcToUse = localSrc;

  if (!(await imageExists(localSrc))) {
    console.warn('[!] Local typhoon image not found, falling back to remote.');
    srcToUse = remoteSrc;
  }

  typhoonImage.src = srcToUse;

  typhoonImage.onload = () => {
    spinner.style.display = 'none';
    typhoonImage.style.display = 'block';
  };

  typhoonImage.onerror = () => {
    spinner.style.display = 'none';
    typhoonImage.style.display = 'none';
    modal.classList.add('hidden');
    console.error('Failed to load typhoon image from both local and remote.');
  };
});


closeBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
  // Reset image src to stop loading if modal closed early
  typhoonImage.src = '';
});

// Optional: close modal if clicking outside content area
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.add('hidden');
    typhoonImage.src = '';
  }
});



if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", updateBackLink);
  document.addEventListener("DOMContentLoaded", checkServerAndSetupNav);
} else {
  updateBackLink();
  checkServerAndSetupNav();
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('app').style.display = 'block';
  });
} else {
  document.getElementById('app').style.display = 'block';
}