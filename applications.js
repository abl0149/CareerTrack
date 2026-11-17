const applicationsList = document.getElementById("applicationsList");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

let allApplications = [];

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

async function loadApplications() {
  try {
    applicationsList.innerHTML = `
      <div class="card shadow-sm">
        <div class="card-body">
          <p class="text-muted mb-0">Loading applications...</p>
        </div>
      </div>
    `;

    const response = await fetch("/api/applications");

    if (!response.ok) {
      throw new Error("Failed to load applications");
    }

    allApplications = await response.json();

    renderApplications();
  } catch (error) {
    console.error(error);

    applicationsList.innerHTML = `
      <div class="card shadow-sm">
        <div class="card-body">
          <p class="text-danger mb-0">
            Failed to load applications.
          </p>
        </div>
      </div>
    `;
  }
}

function renderApplications() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedStatus = statusFilter.value;

  const filteredApplications = allApplications.filter(application => {
    const matchesSearch =
      application.company.toLowerCase().includes(searchTerm) ||
      application.role.toLowerCase().includes(searchTerm);

    const matchesStatus =
      selectedStatus === "All" ||
      application.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  applicationsList.innerHTML = "";

  if (filteredApplications.length === 0) {
    applicationsList.innerHTML = `
      <div class="card shadow-sm">
        <div class="card-body">
          <p class="text-muted mb-0">
            No applications found.
          </p>
        </div>
      </div>
    `;
    return;
  }

  filteredApplications.forEach(application => {
    const card = document.createElement("div");
    card.className = "card shadow-sm mb-3";

    const badgeClass = getStatusBadgeClass(application.status);

    card.innerHTML = `
      <div class="card-body">

        <div class="d-flex justify-content-between align-items-start">

          <div>
            <h4 class="mb-1">${application.company}</h4>
            <h6 class="text-muted">${application.role}</h6>
          </div>

          <span class="badge ${badgeClass}">
            ${application.status}
          </span>

        </div>

        <hr>

        <p class="mb-1">
          <strong>Application Date:</strong>
          ${application.date || "Not provided"}
        </p>

        <p class="mb-1">
          <strong>Deadline:</strong>
          ${application.deadline || "Not provided"}
        </p>

        <p class="mb-3">
          <strong>Notes:</strong>
          ${application.notes || "No notes"}
        </p>

        <button
          class="btn btn-warning btn-sm me-2"
          onclick="editApplication('${application.id}')"
        >
          Edit
        </button>

        <button
          class="btn btn-danger btn-sm"
          onclick="deleteApplication('${application.id}')"
        >
          Delete
        </button>

      </div>
    `;

    applicationsList.appendChild(card);
  });
}

function editApplication(id) {
  localStorage.setItem("editApplicationId", id);
  window.location.href = "edit-application.html";
}

async function deleteApplication(id) {
  const confirmed = confirm(
    "Are you sure you want to delete this application?"
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(`/api/applications/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error("Failed to delete application");
    }

    await loadApplications();
  } catch (error) {
    console.error(error);
    alert("Failed to delete application.");
  }
}

searchInput.addEventListener("input", renderApplications);
statusFilter.addEventListener("change", renderApplications);

loadApplications();
