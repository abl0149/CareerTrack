const form = document.getElementById("editApplicationForm");

const applications =
  JSON.parse(localStorage.getItem("careerTrackApplications")) || [];

const editIndex = Number(
  localStorage.getItem("editApplicationIndex")
);

if (
  !Number.isInteger(editIndex) ||
  editIndex < 0 ||
  editIndex >= applications.length
) {
  alert("Application not found.");
  window.location.href = "applications.html";
}

const application = applications[editIndex];

document.getElementById("company").value = application.company || "";
document.getElementById("role").value = application.role || "";
document.getElementById("status").value = application.status || "Applied";
document.getElementById("date").value = application.date || "";
document.getElementById("deadline").value = application.deadline || "";
document.getElementById("notes").value = application.notes || "";

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const updatedApplication = {
    company: document.getElementById("company").value.trim(),
    role: document.getElementById("role").value.trim(),
    status: document.getElementById("status").value,
    date: document.getElementById("date").value,
    deadline: document.getElementById("deadline").value,
    notes: document.getElementById("notes").value.trim()
  };

  if (
    !updatedApplication.company ||
    !updatedApplication.role ||
    !updatedApplication.status ||
    !updatedApplication.date
  ) {
    alert("Please fill in all required fields.");
    return;
  }

  applications[editIndex] = updatedApplication;

  localStorage.setItem(
    "careerTrackApplications",
    JSON.stringify(applications)
  );

  localStorage.removeItem("editApplicationIndex");

  alert("Application updated successfully.");

  window.location.href = "applications.html";
});