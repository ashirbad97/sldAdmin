//Dark mode toggle
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
  
  //Handle form submission
  patientForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(patientForm);
    const data = Object.fromEntries(formData.entries());

    //Parse tokens input as an array of objects
    data.tokens = data.tokens.split(',').map(token => ({ token: token.trim() }));

    try {
      const response = await fetch("/addPatientFormData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      //Handle response
      if (response.status === 200) {
        alert("Form submitted successfully.");
        patientForm.reset();
      //Keyphrase validation failed
      } else if (response.status === 401) {
        alert(responseData.error);
      } else {
        alert("Failed to submit the form. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("An error occurred. Please try again.");
    }
  });
});

