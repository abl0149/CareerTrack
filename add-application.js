const form = document.getElementById("applicationForm");

if (!form) {
  console.error(
    'Could not find form with id="applicationForm". Check add-application.html.'
  );
} else {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const application = {
      company: document.getElementById("company").value.trim(),
      role: document.getElementById("role").value.trim(),
      status: document.getElementById("status").value,
      date: document.getElementById("date").value,
      deadline: document.getElementById("deadline").value,
      interviewDate:
        document.getElementById("interviewDate")?.value || "",
      notes: document.getElementById("notes").value.trim()
    };

    if (
      !application.company ||
      !application.role ||
      !application.status ||
      !application.date
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(application)
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));

        throw new Error(
          error.error || "Could not save application"
        );
      }

      alert("Application saved successfully!");

      window.location.href = "applications.html";
    } catch (error) {
      console.error(error);

      alert(
        `Unable to save application: ${error.message}`
      );
    }
  });
}