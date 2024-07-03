// const checkEmailExists = async (email) => {
//   const response = await fetch(`/api/users?email=${encodeURIComponent(email)}`);
//   const data = await response.json();
// // Suponiendo que el servidor devuelve un objeto JSON con una propiedad 'exists' que indica si el correo electrónico existe o no
//   return true;
// };
const fetchUsers = async () => {
  try {
    const response = await fetch("/api/users"); // Replace with your actual API endpoint
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const users = await response.json();
    console.log("Fetched users:", users);

    // Extract emails from users data
    const emails = users.map((user) => user.email);
    console.log("Extracted emails:", emails);

    return emails;
  } catch (error) {
    console.error("Error fetching users:", error);
    return []; // Return an empty array or handle error as needed
  }
};


  
const signupFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector("#name-signup").value.trim();
  const email = document.querySelector("#email-signup").value.trim();
  const password = document.querySelector("#password-signup").value.trim();

  const nameLowerCase = name.toLowerCase();
  const emailLowerCase = email.toLowerCase();
  
  if (name && email && password) {
fetchUsers()
  .then((emails) => {
    // Process the extracted emails as needed
    console.log("Processed emails:", emails);

    // Example: Checking if a specific email exists
    const emailToCheck = emailLowerCase;
    const emailExists = emails.includes(emailToCheck);
    if (emailExists) {
      alert(`Email '${emailToCheck}' already exists.`);
    } 

  })
  .catch((error) => {
    console.error("Error fetching and processing users:", error);
  });
    
    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({ 
        name: nameLowerCase, 
        email: emailLowerCase, 
        password }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      document.location.replace("/login");
    } else {
      alert("Add a secure password")
    }
  }
};

document
  .querySelector(".signup-form")
  .addEventListener("submit", signupFormHandler);