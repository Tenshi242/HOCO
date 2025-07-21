function login(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const validUser = "admin";
  const validPass = "hoco2025";

  if (username === validUser && password === validPass) {
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("error-message").textContent = "Incorrect login!";
  }
}