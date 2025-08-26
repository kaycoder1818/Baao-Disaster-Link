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

if (document.readyState === "loading") {
document.addEventListener("DOMContentLoaded", updateBackLink);
} else {
updateBackLink();
}
