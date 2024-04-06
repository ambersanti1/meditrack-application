const loginFormHandler = async (event) => {
  event.preventDefault();

  // Collect values from the login form
  const email = document.querySelector("#email-login").value.trim();
  const password = document.querySelector("#password-login").value.trim();
  const emailLowerCase = email.toLowerCase()
  if (email && password) {
    // Send a POST request to the API endpoint
    const response = await fetch("/api/users/login", {
      method: "POST",
      body: JSON.stringify({ 
        email: emailLowerCase, 
        password }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      document.location.replace("/appointments");
    } else {
      alert("Add a secure password");
    }
  }
};

document
  .querySelector(".login-form")
  .addEventListener("submit", loginFormHandler);