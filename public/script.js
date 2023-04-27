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

      // Handle response
      const alertModalBody = document.getElementById("alertModalBody");
      if (response.status === 200) {
        if (responseData.emailStatus === "Success") {
          alertModalBody.innerHTML = '<div class="alert alert-success" role="alert">Form submitted successfully. Email sent.</div>';
        } else {
          alertModalBody.innerHTML = '<div class="alert alert-danger" role="alert">Form submitted successfully. Failed to send email.</div>';
        }
        patientForm.reset();
      } else if (response.status === 401) {
        alertModalBody.innerHTML = '<div class="alert alert-danger" role="alert">' + responseData.error + '</div>';
      } else {
        alertModalBody.innerHTML = '<div class="alert alert-danger" role="alert">Failed to submit the form. Please try again.</div>';
      }
      // Show the alert modal
      $("#patientAdditionAlert").modal("show");

    } catch (error) {
      console.error("Error submitting the form:", error);
      alertModalBody.innerHTML = '<div class="alert alert-danger" role="alert">An error occurred. Please try again.</div>';

      // Show the alert modal
      $("#patientAdditionAlert").modal("show");

      // Unfade the submit button and hide the loading spinner in case of error
      submitButton.style.opacity = "1";
      submitButton.style.pointerEvents = "auto";
      loadingSpinner.style.display = "none";
    }
  });
});
