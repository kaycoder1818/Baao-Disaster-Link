
document.addEventListener("DOMContentLoaded", () => {
  fetch("/accident-area")
    .then(response => response.json())
    .then(({ data, grand_totals }) => {
      const tbody = document.getElementById("accident-body");
      const tfoot = document.getElementById("accident-footer");

      // Populate table body
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

      // Add grand totals
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
    })
    .catch(error => {
      console.error("Error fetching accident data:", error);
    });
});
