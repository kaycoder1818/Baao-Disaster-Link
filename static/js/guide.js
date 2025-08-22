// static\js\guide.js


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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateBackLink);
  } else {
    updateBackLink();
  }



const container = document.getElementById('disaster-prep-container');

const disasterImg = document.createElement('img');
disasterImg.src = '../static/images/disaster-prep.webp'; // Try raw path first
disasterImg.alt = 'Disaster Preparedness Tips';
disasterImg.className = 'image-fit';

disasterImg.onload = function () {
console.log("[+] raw disaster-prep.webp loaded successfully");
container.appendChild(disasterImg);
};

disasterImg.onerror = function () {
console.log("[+] raw disaster-prep.webp failed, using Flask-rendered path");
const fallbackImg = document.createElement('img');
fallbackImg.src = '{{ url_for("static", filename="images/disaster-prep.webp") }}';
fallbackImg.alt = 'Disaster Preparedness Tips';
fallbackImg.className = 'image-fit';
container.appendChild(fallbackImg);
};



const fireContainer = document.getElementById('fire-prep-container');

const fireImg = document.createElement('img');
fireImg.src = '../static/images/fire-prep.webp'; // Try raw path first
fireImg.alt = 'Disaster Preparedness Tips';
fireImg.className = 'image-fit';

fireImg.onload = function () {
console.log("[+] raw fire-prep.webp loaded successfully");
fireContainer.appendChild(fireImg);
};

fireImg.onerror = function () {
console.log("[+] raw fire-prep.webp failed, using Flask-rendered path");
const fallbackImg = document.createElement('img');
fallbackImg.src = '{{ url_for("static", filename="images/fire-prep.webp") }}';
fallbackImg.alt = 'Disaster Preparedness Tips';
fallbackImg.className = 'image-fit';
fireContainer.appendChild(fallbackImg);
};





const earthquakeContainer = document.getElementById('earthquake-prep-container');

const earthquakeImg = document.createElement('img');
earthquakeImg.src = '../static/images/earthquake-prep.webp'; // Try raw path first
earthquakeImg.alt = 'Disaster Preparedness Tips';
earthquakeImg.className = 'image-fit';

earthquakeImg.onload = function () {
console.log("[+] raw earthquake-prep.webp loaded successfully");
earthquakeContainer.appendChild(earthquakeImg);
};

earthquakeImg.onerror = function () {
console.log("[+] raw earthquake-prep.webp failed, using Flask-rendered path");
const fallbackImg = document.createElement('img');
fallbackImg.src = '{{ url_for("static", filename="images/earthquake-prep.webp") }}';
fallbackImg.alt = 'Disaster Preparedness Tips';
fallbackImg.className = 'image-fit';
earthquakeContainer.appendChild(fallbackImg);
};



function setupNavIcons(navRoutes) {
  for (const [id, path] of Object.entries(navRoutes)) {
    const el = document.getElementById(id);
    if (el) {
      el.style.cursor = "pointer";
      el.addEventListener("click", () => {
        window.location.href = path;
      });
    }
  }
}

async function checkServerAndSetupNav() {
  try {
    // Try to fetch a known backend route (e.g., "/")
    const res = await fetch('/', { method: 'GET' });
    if (!res.ok) throw new Error('Server route not available');

    // Server routes (no .html extensions)
    const navRoutes = {
      "disaster-prep": "/disaster-preparedness",
      "fire-prep": "/fire-preparedness",
      "earthquake-prep": "/earthquake-preparedness"
    };

    console.log("[+] Using remote navigation routes");
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => setupNavIcons(navRoutes));
    } else {
      setupNavIcons(navRoutes);
    }

  } catch (err) {
    // Fallback to static .html files
    const navRoutes = {
      "disaster-prep": "disaster-prep.html",
      "fire-prep": "fire-prep.html",
      "earthquake-prep": "earthquake-prep.html"
    };

    console.log("[!] Remote navigation not available — falling back to static .html routes");
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => setupNavIcons(navRoutes));
    } else {
      setupNavIcons(navRoutes);
    }
  }
}

// Run immediately
checkServerAndSetupNav();
