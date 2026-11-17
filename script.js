async function getApplications() {
  const response = await fetch("/api/applications");

  if (!response.ok) {
    throw new Error("Failed to load applications");
  }

  return response.json();
}

function getStatusBadgeClass(status) {
  if (status === "Applied") {
    return "bg-primary";
  }

  if (status === "Interview") {
    return "bg-warning text-dark";
  }

  if (status === "Offer") {
    return "bg-success";
  }

  if (status === "Rejected") {
    return "bg-danger";
  }

  return "bg-secondary";
}

async function updateDashboard() {
  try {
    const applications = await getApplications();

    document.getElementById("totalApplications").textContent =
      applications.length;

    document.getElementById("appliedCount").textContent =
      applications.filter(app => app.status === "Applied").length;

    document.getElementById("interviewCount").textContent =
      applications.filter(app => app.status === "Interview").length;

    document.getElementById("offerCount").textContent =
      applications.filter(app => app.status === "Offer").length;

    const recentApplications =
      document.getElementById("recentApplications");

    recentApplications.innerHTML = "";

    if (applications.length === 0) {
      recentApplications.innerHTML = `
        <p class="text-muted mb-0">
          No applications yet. Add your first application to get started.
        </p>
      `;
      return;
    }

    const recent = applications.slice(-3).reverse();

    recent.forEach(application => {
      const item = document.createElement("div");
      const badgeClass = getStatusBadgeClass(application.status);

      item.className = "mb-3";

      item.innerHTML = `
        <h5 class="mb-1">${application.company}</h5>
        <p class="mb-1">${application.role}</p>
        <span class="badge ${badgeClass}">
          ${application.status}
        </span>
        <hr>
      `;

      recentApplications.appendChild(item);
    });
  } catch (error) {
    console.error(error);

    document.getElementById("recentApplications").innerHTML = `
      <p class="text-danger mb-0">
        Failed to load applications.
      </p>
    `;
  }
}

updateDashboard();
