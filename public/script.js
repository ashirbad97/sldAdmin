document.addEventListener("DOMContentLoaded", () => {
  const patientForm = document.getElementById("patientForm");

  //Handle form submission
  patientForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Show loading spinner and disable submit button
    const loadingSpinner = document.getElementById("loadingSpinner");
    const submitButton = patientForm.querySelector("button[type='submit']");

    // Fade the submit button and show the loading spinner
    submitButton.style.opacity = "0.5";
    submitButton.style.pointerEvents = "none";
    loadingSpinner.style.display = "inline-block";

    const formData = new FormData(patientForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/addPatientFormData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      // Unfade the submit button and hide the loading spinner
      submitButton.style.opacity = "1";
      submitButton.style.pointerEvents = "auto";
      loadingSpinner.style.display = "none";

      //Handle response
      if (response.status === 200) {
        if (responseData.emailStatus === "Success") {
          alert("Form submitted successfully. Email sent.");
        } else {
          alert("Form submitted successfully. Failed to send email.");
        }
        patientForm.reset();
      } else if (response.status === 401) {
        alert(responseData.error);
      } else {
        alert("Failed to submit the form. Please try again.");
      }
      // Hide loading spinner and enable submit button when done
      loadingSpinner.style.display = "none";
      submitButton.disabled = false;
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("An error occurred. Please try again.");

    // Unfade the submit button and hide the loading spinner in case of error
    submitButton.style.opacity = "1";
    submitButton.style.pointerEvents = "auto";
    loadingSpinner.style.display = "none";

    }
  });
});
