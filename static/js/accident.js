// static\js\accident.js
// document.addEventListener("DOMContentLoaded", () => {
//   fetch("/accident-area")
//     .then(response => response.json())
//     .then(({ data, grand_totals }) => {
//       const tbody = document.getElementById("accident-body");
//       const tfoot = document.getElementById("accident-footer");

//       // Populate table body
//       data.forEach(row => {
//         const tr = document.createElement("tr");
//         tr.innerHTML = `
//           <td>${row.brgy}</td>
//           <td>${row.acc_2021}</td>
//           <td>${row.pct_2021}</td>
//           <td>${row.acc_2022}</td>
//           <td>${row.pct_2022}</td>
//           <td>${row.total}</td>
//           <td>${row.pct_total}</td>
//         `;
//         tbody.appendChild(tr);
//       });

//       // Add grand totals
//       tfoot.innerHTML = `
//         <tr>
//           <td><strong>Grand Total</strong></td>
//           <td>${grand_totals.acc_2021}</td>
//           <td>100%</td>
//           <td>${grand_totals.acc_2022}</td>
//           <td>100%</td>
//           <td>${grand_totals.total}</td>
//           <td>100%</td>
//         </tr>
//       `;
//     })
//     .catch(error => {
//       console.error("Error fetching accident data:", error);
//     });
// });


const REMOTE_API_BASE_URL = 'https://baao-disaster-link.vercel.app';

function populateTable({ data, grand_totals }) {
  const tbody = document.getElementById("accident-body");
  const tfoot = document.getElementById("accident-footer");

  if (!tbody || !tfoot) {
    console.error("[x] Table elements not found.");
    return;
  }

  // Clear previous content
  tbody.innerHTML = "";
  tfoot.innerHTML = "";

  // Populate body
  data.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.brgy}</td>
      <td>${row.acc_2021}</td>
      <td>${row.pct_2021}</td>
      <td>${row.acc_2022}</td>
      <td>${row.pct_2022}</td>
      <td>${row.total}</td>
      <td>${row.pct_total}</td>
    `;
    tbody.appendChild(tr);
  });

  // Populate footer
  tfoot.innerHTML = `
    <tr>
      <td><strong>Grand Total</strong></td>
      <td>${grand_totals.acc_2021}</td>
      <td>100%</td>
      <td>${grand_totals.acc_2022}</td>
      <td>100%</td>
      <td>${grand_totals.total}</td>
      <td>100%</td>
    </tr>
  `;
}

async function runFetch() {
  try {
    console.log("[1] Trying Flask API route: /accident-area");
    const res = await fetch("/accident-area");
    if (!res.ok) throw new Error("Flask route failed");
    const json = await res.json();
    populateTable(json);
  } catch (err1) {
    console.warn("[!] Local route failed. Trying remote fallback...");

    try {
      console.log("[2] Trying remote API:", `${REMOTE_API_BASE_URL}/accident-area`);
      const remoteRes = await fetch(`${REMOTE_API_BASE_URL}/accident-area`);
      if (!remoteRes.ok) throw new Error("Remote API failed");
      const remoteJson = await remoteRes.json();
      populateTable(remoteJson);
    } catch (err2) {
      console.error("[x] Both sources failed to load accident data:", err2);
      const tbody = document.getElementById("accident-body");
      if (tbody) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align: center; color: red;">
              Unable to load accident data from server or remote source.
            </td>
          </tr>
        `;
      }
    }
  }
}

// Use preferred DOMContentLoaded logic
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runFetch);
} else {
  runFetch();
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

if (document.readyState === "loading") {
document.addEventListener("DOMContentLoaded", updateBackLink);
} else {
updateBackLink();
}
