import { loginUser } from "./requests.js";
import { verifyKindOfUser } from "./requests.js";

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
  const toastBoxSucces = document.querySelector(".toast-box-success");
  console.log(toastBoxSucces);
  const toastText = document.querySelector(".toast-text");
  toastText.innerText = "Login efetuado com sucesso!";
  toastBoxSucces.classList.add("active");
  redirectUser();
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

async function redirectUser() {
  const response = await verifyKindOfUser();
  console.log(response);

  if (response.is_admin === true) {
    setTimeout(() => {
      window.location.href = "../pages/adminPage.html";
    }, 1500);
  } else if (response.is_admin === false) {
    setTimeout(() => {
      window.location.href = "../pages/userPage.html";
    }, 1500);
  }
}

redirectUser();

const menuButton = document.querySelector(".menu");

const headerbutton = document.querySelector(".buttons");

menuButton.addEventListener("mouseenter", () => {
  headerbutton.classList.add("active");
});

headerbutton.addEventListener("mouseleave", () => {
  headerbutton.classList.remove("active");
});
