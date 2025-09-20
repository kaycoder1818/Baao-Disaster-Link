let map;
let directionsService;
let directionsRenderer;
let markers = [];
let stations = [];

const currentLocation = { lat: 13.4539341516119, lng: 123.36561660818849 };

// // List of stations
// const stations = [
//   {
//     name: "Station A",
//     position: { lat: 13.449154848182909, lng: 123.38967744292196 },
//   },
//   {
//     name: "Station B",
//     position: { lat: 13.456543058905588, lng: 123.36814776984579 },
//   },
//   // Add more stations here if needed
// ];


// // List of stations
// const stations = [
//   {
//     name: "Agdangan ES",
//     position: { lat: 13.49378, lng: 123.32579 },
//   },
//   {
//     name: "Agdangan NHS",
//     position: { lat: 13.49533, lng: 123.32157 },
//   },
//   {
//     name: "Antipolo ES",
//     position: { lat: 13.48785, lng: 123.38278 },
//   },
//   {
//     name: "Bagumbayan ES",
//     position: { lat: 13.48309, lng: 123.27788 },
//   },
//   {
//     name: "Buluang ES",
//     position: { lat: 13.47000, lng: 123.35697 },
//   },
//   {
//     name: "EPAMHS",
//     position: { lat: 13.47276, lng: 123.35546 },
//   },
//   {
//     name: "Cristo Rey ES",
//     position: { lat: 13.53634, lng: 123.43127 },
//   },
//   {
//     name: "Caranday HS",
//     position: { lat: 13.50164, lng: 123.38023 },
//   },
//   {
//     name: "Kalahi School Building",
//     position: { lat: 13.50064, lng: 123.39628 },
//   },
//   {
//     name: "West Central School",
//     position: { lat: 13.45471, lng: 123.36836 },
//   },
//   {
//     name: "Rosary School",
//     position: { lat: 13.45339, lng: 123.36797 },
//   },
//   {
//     name: "Iyagan ES",
//     position: { lat: 13.52921, lng: 123.38679 },
//   },
//   {
//     name: "Iyagan HS",
//     position: { lat: 13.53113, lng: 123.38899 },
//   },
//   {
//     name: "Lourdes ES",
//     position: { lat: 13.49938, lng: 123.36135 },
//   },
// ];


// Fetch station data from backend
async function fetchStations() {
  console.log("[fetchStations] Attempting to fetch evacuation data from /api/evacuation");

  try {
    const res = await fetch(`/api/evacuation`);
    console.log(`[fetchStations] Response status: ${res.status}`);

    const data = await res.json();
    console.log("[fetchStations] Response JSON:", data);

    if (res.ok && data.evacuationData) {
      console.log(`[fetchStations] Successfully fetched ${data.evacuationData.length} stations`);
      
      stations = data.evacuationData;

      // Store fetched data in localStorage
      localStorage.setItem("evacuationStations", JSON.stringify(stations));

      initMap(); // Initialize map only after stations are loaded
    } else {
      console.error("[fetchStations] Failed to fetch evacuation data:", data.error || "Unknown error");
      alert("Unable to load evacuation stations.");

      // Try fallback from localStorage
      loadStationsFromLocalStorage();
    }
  } catch (err) {
    console.error("[fetchStations] Network error while fetching stations:", err);
    alert("Network error while loading evacuation stations.");

    // Try fallback from localStorage
    loadStationsFromLocalStorage();
  }
}

// Load station data from localStorage fallback
function loadStationsFromLocalStorage() {
  const storedStations = localStorage.getItem("evacuationStations");

  if (storedStations) {
    try {
      stations = JSON.parse(storedStations);
      console.log(`[fetchStations] Loaded ${stations.length} stations from localStorage as fallback`);
      initMap();
    } catch (parseError) {
      console.error("[fetchStations] Error parsing stations from localStorage:", parseError);
    }
  } else {
    console.warn("[fetchStations] No evacuation stations found in localStorage.");
  }
}


function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: currentLocation,
    zoom: 14,
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
    suppressMarkers: true, // We'll add custom markers
  });

  // Add marker for current location
  new google.maps.Marker({
    position: currentLocation,
    map: map,
    title: "Current Location",
    icon: {
      url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    },
  });

  // Add markers for stations
  stations.forEach((station) => {
    const marker = new google.maps.Marker({
      position: station.position,
      map: map,
      title: station.name,
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
      },
    });

    marker.addListener("click", () => {
      calculateAndDisplayRoute(station.position);
    });

    markers.push(marker);
  });
}

function calculateAndDisplayRoute(destination) {
  const request = {
    origin: currentLocation,
    destination: destination,
    travelMode: google.maps.TravelMode.DRIVING,
  };

  directionsService.route(request, (result, status) => {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsRenderer.setDirections(result);

      // Optionally add markers for origin and destination
      // DirectionsRenderer suppresses default markers, so add custom
      // Clear old markers first
      markers.forEach((m) => m.setMap(null));
      markers = [];

      // Current location marker (blue)
      markers.push(
        new google.maps.Marker({
          position: currentLocation,
          map: map,
          title: "Current Location",
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          },
        })
      );

      // Destination marker (red)
      markers.push(
        new google.maps.Marker({
          position: destination,
          map: map,
          title: "Destination",
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
          },
        })
      );
    } else {
      console.error("Directions request failed due to " + status);
      alert("Sorry, directions request failed.");
    }
  });
}

window.initMap = initMap;


async function handleBackClick() {

    try {
        console.log("Checking / availability...");
        const res = await fetch("/", { method: "GET" });
        if (!res.ok) throw new Error("Flask / route not available");

        console.log("[+] Navigating to Flask / route");
        window.location.href = "/home";

    } catch (err) {
        console.log("[+] Falling back to static settings.html");
        window.location.href = "home.html";
    } 
}



function loadGoogleMapsScript() {
    const script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAoVrxrSQxLYbGR7YJq17NYyWTOd4npOIA&callback=initMap";
    script.async = true;
    document.head.appendChild(script);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadGoogleMapsScript);
} else {
    loadGoogleMapsScript();
}