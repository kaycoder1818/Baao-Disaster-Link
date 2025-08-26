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
