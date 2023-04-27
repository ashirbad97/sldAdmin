if(document.getElementById('allModulesListed')!=null){
    //Finds the current level of the patient which is embedded in the document
    currentLevel = document.getElementById('allModulesListed').getAttribute('value')
    for(i=currentLevel;i>=1;i--){
        button = document.getElementById('level'+i)
        button.disabled = false 
    }
}

if(document.getElementById('loginPage')!=null){

    var checkBrowser = ()=>{
        if(window.navigator.vendor != "Google Inc."){
            // Show a Modal
            $('#browserCheckModal').modal('show')
            console.log(window.navigator.vendor)
            console.log("Modal Triggered")
        }
    }

}

  
if (document.getElementById("adminHomePage") != null) {
  console.log("In HomePage");
  var popInstructions = () => {
    $("#subjectOnboardingModal").modal("show");
    console.log("Modal Triggered");
  };
  document.addEventListener("DOMContentLoaded", () => {
    const patientForm = document.getElementById("patientForm");

    const saveChangesButton = document.getElementById("save-changes");
    saveChangesButton.addEventListener("click", async (event) => {
      event.preventDefault();

      // Check if the form is valid using the built-in browser validation
      if (!patientForm.reportValidity()) {
        return;
      }

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

        const patientAdditionAlertContent = document.getElementById("patientAdditionAlertContent");

        // Handle response
        if (response.status === 200) {
          let alertContent = '';
          if (responseData.emailStatus === "Success") {
            alertContent = '<div class="alert alert-success alert-dismissible fade show" role="alert">Form submitted successfully. Email sent.</div>';
            showAlert(alertContent, true);
          } else {
            alertContent = '<div class="alert alert-danger alert-dismissible fade show" role="alert">Form submitted successfully. Failed to send email.</div>';
            showAlert(alertContent, false);
          }
          setTimeout(() => {
            $("#patientAdditionAlert").modal("hide");
          }, 2000);
          patientForm.reset();
        } else if (response.status === 401) {
          showAlert('<div class="alert alert-danger alert-dismissible fade show" role="alert">' + responseData.error + '</div>', false);
          setTimeout(() => {
            $("#patientAdditionAlert").modal("hide");
          }, 2000);
        } else {
          showAlert('<div class="alert alert-danger alert-dismissible fade show" role="alert">Failed to submit the form. Please try again.</div>', false);
          setTimeout(() => {
            $("#patientAdditionAlert").modal("hide");
          }, 2000);
        }

      } catch (error) {
        console.error("Error submitting the form:", error);
        const alertContent = '<div class="alert alert-danger alert-dismissible fade show" role="alert">An error occurred. Please try again.</div>';
        showAlert(alertContent, false);
        setTimeout(() => {
          $("#patientAdditionAlert").modal("hide");
        }, 2000);
      }      
    });
  });
}

function showAlert(alertContent, isSuccess) {
  const patientAdditionAlertContent = document.getElementById("patientAdditionAlertContent");
  patientAdditionAlertContent.innerHTML = alertContent;
  // Show the patientAdditionAlert modal
  $("#patientAdditionAlert").modal("show");

  if (isSuccess) {
    setTimeout(() => {
      $("#patientAdditionAlert").modal("hide");
      $("#subjectOnboardingModal").modal("hide"); 
      location.reload();
    }, 2000);
  }
}