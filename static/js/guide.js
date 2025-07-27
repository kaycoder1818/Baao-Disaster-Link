// static\js\guide.js


document.addEventListener("DOMContentLoaded", function () {
    const routes = {
        "disaster-prep": "/disaster-preparedness",
        "fire-prep": "/fire-preparedness",
        "earthquake-prep": "/earthquake-preparedness"
    };

    for (const [id, path] of Object.entries(routes)) {
        const el = document.getElementById(id);
        if (el) {
            el.style.cursor = "pointer"; // show hand on hover
            el.addEventListener("click", () => {
                window.location.href = path;
            });
        }
    }
});