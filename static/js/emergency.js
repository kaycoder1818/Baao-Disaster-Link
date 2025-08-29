

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




const container = document.getElementById('rhu-container');

const disasterImg = document.createElement('img');
disasterImg.src = '../static/images/RHU.webp'; // Try raw path first
disasterImg.alt = 'MDRRMO';
disasterImg.className = 'image-fit';

disasterImg.onload = function () {
    console.log("[+] raw RHU.webp loaded successfully");
    container.appendChild(disasterImg);
};

disasterImg.onerror = function () {
    console.log("[+] raw RHU.webp failed, using Flask-rendered path");
    const fallbackImg = document.createElement('img');
    fallbackImg.src = '{{ url_for("static", filename="images/RHU.webp") }}';
    fallbackImg.alt = 'MDRRMO';
    fallbackImg.className = 'image-fit';
    container.appendChild(fallbackImg);
};



const container2 = document.getElementById('baao-pnp-container');

const baaopnpImg = document.createElement('img');
baaopnpImg.src = '../static/images/PNP.webp'; // Try raw path first
baaopnpImg.alt = 'BAAO PNP';
baaopnpImg.className = 'image-fit';

baaopnpImg.onload = function () {
    console.log("[+] raw PNP.webp loaded successfully");
    container2.appendChild(baaopnpImg);
};

baaopnpImg.onerror = function () {
    console.log("[+] raw PNP.webp failed, using Flask-rendered path");
    const fallbackImg2 = document.createElement('img');
    fallbackImg2.src = '{{ url_for("static", filename="images/PNP.webp") }}';
    fallbackImg2.alt = 'BAAO PNP';
    fallbackImg2.className = 'image-fit';
    container2.appendChild(fallbackImg2);
};




const container3 = document.getElementById('bfp-container');

const bfpImg = document.createElement('img');
bfpImg.src = '../static/images/BFP.webp'; // Try raw path first
bfpImg.alt = 'BFP';
bfpImg.className = 'image-fit';

bfpImg.onload = function () {
    console.log("[+] raw BFP.webp loaded successfully");
    container3.appendChild(bfpImg);
};

bfpImg.onerror = function () {
    console.log("[+] raw BFP.webp failed, using Flask-rendered path");
    const fallbackImg3 = document.createElement('img');
    fallbackImg3.src = '{{ url_for("static", filename="images/BFP.webp") }}';
    fallbackImg3.alt = 'BFP';
    fallbackImg3.className = 'image-fit';
    container3.appendChild(fallbackImg3);
};





const container4 = document.getElementById('rhuu-container');

const rhuuImg = document.createElement('img');
rhuuImg.src = '../static/images/RHU.webp'; // Try raw path first
rhuuImg.alt = 'RHU';
rhuuImg.className = 'image-fit';

rhuuImg.onload = function () {
    console.log("[+] raw RHU.webp loaded successfully");
    container4.appendChild(rhuuImg);
};

rhuuImg.onerror = function () {
    console.log("[+] raw RHU.webp failed, using Flask-rendered path");
    const fallbackImg4 = document.createElement('img');
    fallbackImg4.src = '{{ url_for("static", filename="images/RHU.webp") }}';
    fallbackImg4.alt = 'RHU';
    fallbackImg4.className = 'image-fit';
    container4.appendChild(fallbackImg4);
};




const container5 = document.getElementById('doh-container');

const dohImg = document.createElement('img');
dohImg.src = '../static/images/DOH.webp'; // Try raw path first
dohImg.alt = 'DOH';
dohImg.className = 'image-fit';

dohImg.onload = function () {
    console.log("[+] raw DOH.webp loaded successfully");
    container5.appendChild(dohImg);
};

dohImg.onerror = function () {
    console.log("[+] raw DOH.webp failed, using Flask-rendered path");
    const fallbackImg5 = document.createElement('img');
    fallbackImg5.src = '{{ url_for("static", filename="images/DOH.webp") }}';
    fallbackImg5.alt = 'DOH';
    fallbackImg5.className = 'image-fit';
    container5.appendChild(fallbackImg5);
};


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('app').style.display = 'block';
  });
} else {
  document.getElementById('app').style.display = 'block';
}


function handleHotlineClick(element) {
  const title = element.getAttribute('data-title');
  const number = element.getAttribute('data-number');
  showModal(title, number);
}

function showModal(title, number) {
  document.getElementById("modal-title").innerText = title;
  document.getElementById("modal-number").innerText = "Hotline: " + number;
  document.getElementById("modal-overlay").style.display = "flex";
}

function hideModal() {
  document.getElementById("modal-overlay").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("modal-ok-button").onclick = hideModal;
});

