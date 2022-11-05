import { getUserData } from "./requests.js";
import { getDepartmentInfo } from "./requests.js";
import { getCoworkers } from "./requests.js";
import { userEdit } from "./requests.js";

const logoutButton = document.querySelector(".logout");

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.reload();
});

function verifyToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "../index.html";
  }
}
verifyToken();

const userData = document.querySelector(".user-data");
const editUserForm = document.querySelector("form");
const formBox = document.querySelector(".modal-form");
const closeIcon = document.querySelector(".close-icon");

async function renderUserData() {
  const data = await getUserData();
  userData.innerHTML = `<div class="all-informations">
        <div class="user-name">
        <h2>${data.username}</h2>
        </div>
        <div class="user-info">
        <p>Email: ${data.email}</p>
        <p>${data.professional_level}</p>
        <p>${data.kind_of_work}</p>      
        <button class="edit-button"><img src="../assets/img/editIconBlue.svg" alt="edit icon"></button>
        </div>
        </div>
        `;

  const editButton = document.querySelector(".edit-button");
  editButton.addEventListener("click", () => {
    formBox.classList.add("active");
  });
}
closeIcon.addEventListener("click", () => {
  formBox.classList.remove("active");
});

renderUserData();

const departmentInfo = document.querySelector(".department-info");

async function renderDepartmentInfo() {
  const data = await getDepartmentInfo();
  if (data === "error") {
    departmentInfo.innerHTML = `<img src="../assets/img/notHired.svg" alt="image Error">
        `;
  } else {
    departmentInfo.innerHTML = `
            <div class="your-company">
                <h2>${data.name}</h2>
                <h2> - </h2>
                <h2>${data.departments[0].name}</h2>
            </div>
            `;
  }
}

renderDepartmentInfo();

const coworkers = document.querySelector(".coworkers");

async function renderCoworkers() {
  const data = await getCoworkers();
  console.log(data);

  data[0].users.forEach((coworker) => {
    coworkers.innerHTML += `
            <div class="coworker">
                <h2>${coworker.username}</h2>
                <p>${coworker.professional_level}</p>

            </div>
            `;
  });
}

renderCoworkers();

editUserForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(editUserForm);
  const user = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const data = await userEdit(user);
  if (data.error) {
    alert(data.error);
  } else {
    alert("Ediçaõ feita com sucesso");
    window.location.reload();
  }
});

const menuButton = document.querySelector(".menu");

const headerbutton = document.querySelector(".buttons");

menuButton.addEventListener("mouseenter", () => {
  headerbutton.classList.add("active");
});

headerbutton.addEventListener("mouseleave", () => {
  headerbutton.classList.remove("active");
});
