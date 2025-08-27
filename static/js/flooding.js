let map;
let directionsService;
let directionsRenderer;
let markers = [];

const currentLocation = { lat: 13.4539341516119, lng: 123.36561660818849 };

// List of stations
const stations = [
  {
    name: "Station A",
    position: { lat: 13.449154848182909, lng: 123.38967744292196 },
  },
  {
    name: "Station B",
    position: { lat: 13.456543058905588, lng: 123.36814776984579 },
  },
  // Add more stations here if needed
];

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