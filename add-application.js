document.getElementById("applicationForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const application = {
    company: document.getElementById("company").value.trim(),
    role: document.getElementById("role").value.trim(),
    status: document.getElementById("status").value,
    date: document.getElementById("date").value,
    deadline: document.getElementById("deadline").value,
    notes: document.getElementById("notes").value.trim()
  };

  if (!application.company || !application.role || !application.status || !application.date) {
    alert("Please fill in all required fields.");
    return;
  }

  const applications =
    JSON.parse(localStorage.getItem("careerTrackApplications")) || [];

  applications.push(application);

  localStorage.setItem(
    "careerTrackApplications",
    JSON.stringify(applications)
  );

  alert("Application saved successfully.");

  window.location.href = "index.html";
});