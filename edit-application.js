const form = document.getElementById("editApplicationForm");
const applicationId = localStorage.getItem("editApplicationId");

if (!applicationId) {
  alert("No application selected.");
  window.location.href = "applications.html";
} else if (!form) {
  console.error(
    'Could not find form with id="editApplicationForm". Check edit-application.html.'
  );
} else {
  async function loadApplication() {
    try {
      const response = await fetch(
        `/api/applications/${encodeURIComponent(applicationId)}`
      );

      if (!response.ok) {
        throw new Error("Application not found");
      }

      const application = await response.json();

      document.getElementById("company").value =
        application.company || "";

      document.getElementById("role").value =
        application.role || "";

      document.getElementById("status").value =
        application.status || "Applied";

      document.getElementById("date").value =
        application.date || "";

      document.getElementById("deadline").value =
        application.deadline || "";

      const interviewInput =
        document.getElementById("interviewDate");

      if (interviewInput) {
        interviewInput.value =
          application.interviewDate || "";
      }

      document.getElementById("notes").value =
        application.notes || "";
    } catch (error) {
      console.error(error);

      alert(
        `Unable to load application: ${error.message}`
      );

      window.location.href = "applications.html";
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const updatedApplication = {
      company: document
        .getElementById("company")
        .value.trim(),

      role: document
        .getElementById("role")
        .value.trim(),

      status:
        document.getElementById("status").value,

      date:
        document.getElementById("date").value,

      deadline:
        document.getElementById("deadline").value,

      interviewDate:
        document.getElementById("interviewDate")
          ?.value || "",

      notes: document
        .getElementById("notes")
        .value.trim()
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

    try {
      const response = await fetch(
        `/api/applications/${encodeURIComponent(applicationId)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedApplication)
        }
      );

      if (!response.ok) {
        const error =
          await response.json().catch(() => ({}));

        throw new Error(
          error.error || "Update failed"
        );
      }

      localStorage.removeItem("editApplicationId");

      alert("Application updated successfully!");

      window.location.href = "applications.html";
    } catch (error) {
      console.error(error);

      alert(
        `Unable to update application: ${error.message}`
      );
    }
  });

  loadApplication();
}
