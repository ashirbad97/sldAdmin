// Dark mode toggle
document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const body = document.body;

  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  if (prefersDarkScheme.matches) {
    body.classList.add('dark-mode');
    darkModeToggle.checked = true;
  }

  darkModeToggle.addEventListener('change', () => {
    body.classList.toggle('dark-mode');
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const patientForm = document.getElementById("patientForm");
  
  patientForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(patientForm);
    const data = Object.fromEntries(formData.entries());

    // Parse tokens input as an array of objects
    data.tokens = data.tokens.split(',').map(token => ({ token: token.trim() }));

    try {
      const response = await fetch("/addPatientFormData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Form submitted successfully.");
        patientForm.reset();
      } else {
        alert("Failed to submit the form. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("An error occurred. Please try again.");
    }
  });
});

