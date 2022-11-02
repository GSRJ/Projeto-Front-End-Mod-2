import { loginUser } from "./requests.js";

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const user = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const response = await loginUser(user);
  localStorage.setItem("token", response.token);
});

const toRegisterButton = document.querySelectorAll(".to-register");
const toHomeButton = document.querySelectorAll(".to-home");

toRegisterButton.forEach((button) => {
  button.addEventListener("click", () => {
    window.location.href = "../pages/register.html";
  });
});

toHomeButton.forEach((button) => {
  button.addEventListener("click", () => {
    window.location.href = "../index.html";
  });
});
