


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
    backLink.href = "/guide";

} catch (err) {
    console.log("[+] Falling back to static .html back button");
    //   console.warn("[!] Falling back to static .html back button", err);
    backLink.href = "guide.html";
}
}

if (document.readyState === "loading") {
document.addEventListener("DOMContentLoaded", updateBackLink);
} else {
updateBackLink();
}


const container = document.getElementById('earthquake-prep-container1');

const disasterImg = document.createElement('img');
disasterImg.src = '../static/images/earthquake-tips.jpg'; // Try raw path first
disasterImg.alt = 'Disaster Preparedness Tips';
disasterImg.className = 'image-fit';

disasterImg.onload = function () {
    console.log("[+] raw earthquake-tips.jpg loaded successfully");
    container.appendChild(disasterImg);
};

disasterImg.onerror = function () {
    console.log("[+] raw earthquake-tips.jpg failed, using Flask-rendered path");
    const fallbackImg = document.createElement('img');
    fallbackImg.src = '{{ url_for("static", filename="images/earthquake-tips.jpg") }}';
    fallbackImg.alt = 'Disaster Preparedness Tips';
    fallbackImg.className = 'image-fit';
    container.appendChild(fallbackImg);
};


const fireContainer = document.getElementById('earthquake-prep-container2');

const fireImg = document.createElement('img');
fireImg.src = '../static/images/earthquake-safety.jpg'; // Try raw path first
fireImg.alt = 'Disaster Preparedness Tips';
fireImg.className = 'image-fit';

fireImg.onload = function () {
    console.log("[+] raw earthquake-safety.jpg loaded successfully");
    fireContainer.appendChild(fireImg);
};

fireImg.onerror = function () {
    console.log("[+] raw earthquake-safety.jpg failed, using Flask-rendered path");
    const fallbackImg = document.createElement('img');
    fallbackImg.src = '{{ url_for("static", filename="images/earthquake-safety.jpg") }}';
    fallbackImg.alt = 'Disaster Preparedness Tips';
    fallbackImg.className = 'image-fit';
    fireContainer.appendChild(fallbackImg);
};
