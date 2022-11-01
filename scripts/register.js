import { registerUser } from "./requests.js";

const form = document.querySelector("form");
const selectLevel = document.querySelector("select");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  console.log(formData);
  if (selectLevel.value === "") {
    selectLevel.value = null;
  }
  const user = {
    username: formData.get("username"),
    password: formData.get("password"),
    email: formData.get("email"),
  };
  if (selectLevel.value) {
    user.professional_level = selectLevel.value;
  }

  console.log(user);
  const response = await registerUser(user);
  console.log(response);
});

const toLoginButton = document.querySelectorAll(".to-login");
const toHomeButton = document.querySelectorAll(".to-home");

toLoginButton.forEach((button) => {
  button.addEventListener("click", () => {
    window.location.href = "../pages/login.html";
  });
});

toHomeButton.forEach((button) => {
  button.addEventListener("click", () => {
    window.location.href = "../index.html";
  });
});
